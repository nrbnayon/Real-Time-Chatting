import { model, Schema } from 'mongoose';

import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { ISize } from './size.interface';

const colourSchema = new Schema<ISize>(
  {
    sizeName: {
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

colourSchema.pre('save', async function (next) {
  const isExist = await Size.findOne({ sizeName: this.sizeName });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Size already exist!');
  }
  next();
});

export const Size = model<ISize>('Size', colourSchema);
