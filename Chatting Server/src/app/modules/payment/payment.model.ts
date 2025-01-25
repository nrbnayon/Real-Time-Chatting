import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';
import { string } from 'zod';

const paymentSchema = new Schema<IPayment>(
  {
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        neckSize: {
          type: String,
          required: true,
        },
        chestSize: {
          type: String,
          required: true,
        },
        collarSize: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
        },
      },
    ],
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    chestSize: {
      type: String,
    },
    neckSize: {
      type: String,
    },
    collarSize: {
      type: String,
    },
    size: {
      type: String,
    },
    status: {
      type: String,
    },
    client_secret: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
