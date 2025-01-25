import { Types } from 'mongoose';

export type IPetProfile = {
  user: Types.ObjectId;
  name: string;
  breed: string;
  preference: string;
  weight: string;
  neck: string;
  coller: string;
  chest: string;
  image: string;
  status: 'active' | 'delete';
};
