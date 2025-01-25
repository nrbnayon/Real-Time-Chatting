import { Types } from 'mongoose';

export type IWishlist = {
  user: Types.ObjectId;
  product: Types.ObjectId;
};
