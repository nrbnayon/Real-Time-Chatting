import { model, Schema } from 'mongoose';
import { IWishlist } from './wishList.interface';

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true }
);

export const Wishlist = model<IWishlist>('Wishlist', wishlistSchema);
