import { model, Schema } from 'mongoose';
import { IRetrun, ITerms } from './setting.interface';

// terms and condition
const termSchema = new Schema<ITerms>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TermsAndCondition = model<ITerms>('TermsAndCondition', termSchema);

// return policay
const returnSchema = new Schema<IRetrun>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Return = model<IRetrun>('Return', returnSchema);
