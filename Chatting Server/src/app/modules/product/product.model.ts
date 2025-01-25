import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const productSchema = new Schema<IProduct>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    colour: {
      type: Schema.Types.ObjectId,
      ref: 'Colour',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: [String],
    },
    features: {
      type: [String],
    },
    video: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
    },
    count: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    size: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Size',
      },
    ],
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProduct>('Product', productSchema);
