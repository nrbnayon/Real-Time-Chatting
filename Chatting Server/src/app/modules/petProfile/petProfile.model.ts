import { model, Schema } from 'mongoose';
import { IPetProfile } from './petProfile.intertface';

const petProfileSchema = new Schema<IPetProfile>(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    breed: {
      type: String,
      required: true,
    },
    preference: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    neck: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
    coller: {
      type: String,
      required: true,
    },
    chest: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const PetProfile = model<IPetProfile>('petProfile', petProfileSchema);
