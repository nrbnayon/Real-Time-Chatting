import { model, Schema } from 'mongoose';

import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { IColours } from './colours.interface';

const colourSchema = new Schema<IColours>(
  {
    colourName: {
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
  const isExist = await Colour.findOne({ colourName: this.colourName });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Colour already exist!');
  }
  next();
});

export const Colour = model<IColours>('Colour', colourSchema);
