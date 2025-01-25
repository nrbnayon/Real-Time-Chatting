import Stripe from 'stripe';
import config from '../../../config';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { SortOrder, Types } from 'mongoose';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { cli } from 'winston/lib/winston/config';

export const stripe = new Stripe(config.payment.stripe_secret_key as string, {
  apiVersion: '2024-09-30.acacia',
});

const makePaymentIntent = async (payload: IPayment) => {
  const { products, code } = payload;

  // Calculate the total amount based on products and their quantities
  let totalAmount = 0;
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

    totalAmount += product.price * item.quantity;
  }

  // Apply a 15% discount if a code is provided
  const discount = code ? 0.15 : 0;
  const discountedAmount = totalAmount * (1 - discount);
  const amountInCents = Math.trunc(discountedAmount * 100);

  const amountInCent = Math.trunc(totalAmount * 100); // Full amount in cents (before discount)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCent, // The full amount in cents
    currency: 'usd', // Assuming USD
    payment_method_types: ['card'],
  });

  const values = {
    ...payload,
    amount: totalAmount,
    transactionId: paymentIntent.id,
    status: paymentIntent.status,
    client_secret: paymentIntent.client_secret,
  };

  // Create the payment document in the database
  const createPayment = await Payment.create(values);

  if (!createPayment) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
  }

  // Return the client secret and transaction ID for front-end
  return {
    client_secret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
    createPayment,
  };
};

const paymentConfirmation = async (payload: IPayment) => {
  const updatePayment = await Payment.findOneAndUpdate(
    { client_secret: payload.client_secret }, // Ensure this is correct
    { status: payload.status }, // Update the status
    { new: true }
  );

  if (!updatePayment) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Payment not found with provided transactionId'
    );
  }

  // console.log(updatePayment);

  let totalAmount = 0;
  for (const item of updatePayment.products) {
    const product = await Product.findById(item.productId);
    if (!product)
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

    totalAmount += product.price * item.quantity;
  }

  const isUser = await User.findById(updatePayment?.user);

  if (updatePayment.status === 'succeeded') {
    const data = {
      text: `You have received $${totalAmount} from ${isUser?.name}`,
      type: 'ADMIN',
    };

    await sendNotifications(data);
  }

  return updatePayment;
};

const getAllPayments = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  // Apply filter conditions
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first
  const result = await Payment.find({ status: 'succeeded' })
    .populate({
      path: 'user',
      select: 'name',
    })
    .populate({
      path: 'products.productId',
      select: 'name image price',
    })
    .select('amount products createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size);

  const count = await Payment.countDocuments({ status: 'succeeded' });

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total: count,
      totalPages: Math.ceil(count / size),
      currentPage: pages,
    },
  };
  return data;
};

const getAllUserPayments = async (userId: Types.ObjectId) => {
  const payments = await Payment.find({ user: userId, status: 'succeeded' })
    .populate({
      path: 'products.productId',
      select: 'name image price',
    })
    .select('amount products createdAt');

  return payments;
};

//try webhooks

const createCheckoutSessionService = async (
  userId: string,
  email: string,
  products: any[]
) => {
  try {
    const lineItems = products.map(product => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Order Payment',
          description: 'Payment for user order',
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url:
        'https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourapp.com/cancel',
      metadata: {
        userId,
        products: JSON.stringify(products),
      },
      customer_email: email,
    });

    return session.url;
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    throw new Error('Failed to create checkout session');
  }
};

const handleStripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const { amount_total, metadata, payment_intent, client_secret } = session;
      const userId = metadata?.userId as string; // Ensure you pass metadata when creating a checkout session
      const products = JSON.parse(metadata?.products || '[]');
      const email = session.customer_email || '';
      // const client_secret = payment_intent || '';

      const amountTotal = (amount_total ?? 0) / 100;

      console.log(session, 'session');

      const paymentRecord = new Payment({
        amount: amountTotal, // Convert from cents to currency
        user: new Types.ObjectId(userId),
        products,
        email,
        transactionId: payment_intent,
        client_secret: client_secret,
        status: 'Completed',
      });

      await paymentRecord.save();
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { client_secret } = session;
      const payment = await Payment.findOne({ client_secret });
      if (payment) {
        payment.status = 'Failed';
        await payment.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const PaymentService = {
  makePaymentIntent,
  getAllPayments,
  getAllUserPayments,
  paymentConfirmation,
  createCheckoutSessionService,
  handleStripeWebhookService,
};
