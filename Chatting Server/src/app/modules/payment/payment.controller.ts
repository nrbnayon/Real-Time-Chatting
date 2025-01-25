import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService, stripe } from './payment.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import config from '../../../config';

const makePaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const users = req.user;

  const value = {
    ...req.body,
    user: users.id,
    email: users.email,
  };

  const data = await PaymentService.makePaymentIntent(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment intent created successfully',
    data: data,
  });
});

const paymentConfirmation = catchAsync(async (req: Request, res: Response) => {
  const users = req.user;

  const value = {
    ...req.body,
    user: users.id,
    email: users.email,
  };

  const data = await PaymentService.paymentConfirmation(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment intent created successfully',
    data: data,
  });
});

const getAllPayment = catchAsync(async (req: Request, res: Response) => {
  const data = await PaymentService.getAllPayments(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment intent retrived successfully',
    data: data,
  });
});

const getAllUserPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const payments = await PaymentService.getAllUserPayments(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User payment list retrieved successfully',
    data: payments,
  });
});

///webhook

const createCheckoutSessionController = async (req: Request, res: Response) => {
  const userId: string = req.user.id;
  const email: string = req.user.email;

  const { products } = req.body;

  try {
    const sessionUrl = await PaymentService.createCheckoutSessionService(
      userId,
      email,
      products
    );
    res.status(200).json({ url: sessionUrl });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.payment.stripe_webhook_secret as string
    );

    await PaymentService.handleStripeWebhookService(event);

    res.status(200).send({ received: true });
  } catch (err) {
    console.error('Error in Stripe webhook');
    res.status(400).send(`Webhook Error:`);
  }
};

export const PaymentController = {
  makePaymentIntent,
  getAllPayment,
  getAllUserPayment,
  paymentConfirmation,
  createCheckoutSessionController,
  stripeWebhookController,
};
