import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

categorySchema.pre('save', async function (next) {
  const isExist = await Category.findOne({ name: this.name });
  if (isExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Category already exist please change the name!'
    );
  }
  next();
});

export const Category = model<ICategory>('Category', categorySchema);
