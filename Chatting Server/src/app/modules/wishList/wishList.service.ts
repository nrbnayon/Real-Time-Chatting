import { Types } from 'mongoose';
import { Wishlist } from './wishList.model';
import { User } from '../user/user.model';

const createWishListToDB = async (
  userId: Types.ObjectId,
  productId: string
) => {
  const result = await Wishlist.create({ user: userId, product: productId });
  return result;
};

const removeWishListToDB = async (
  userId: Types.ObjectId,
  productId: string
) => {
  // Attempt to remove the item from the database
  const result = await Wishlist.findOneAndDelete({
    user: userId,
    product: productId,
  });
  return result;
};
const getAllWishListToDB = async (userId: Types.ObjectId) => {
  const wishlist = await Wishlist.find({ user: userId });
  return wishlist;
};

const myWishList = async (userId: Types.ObjectId) => {
  const wishlist = await Wishlist.find({ user: userId }).populate('product');
  return wishlist;
};

export const WishListService = {
  createWishListToDB,
  removeWishListToDB,
  getAllWishListToDB,
  myWishList,
};
