import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { WishListService } from './wishList.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createWishListToDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const product = req.params.id;

  const result = await WishListService.createWishListToDB(userId, product);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'WishList created successfully',
    data: result,
  });
});

const removeWishListToDB = catchAsync(async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    // Log the input data

    const result = await WishListService.removeWishListToDB(userId, productId);

    if (!result) {
      return sendResponse(res, {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Item not found in the wishlist',
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'WishList removed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error removing wishlist item:', error);
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    });
  }
});

const getAllWishListToDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await WishListService.getAllWishListToDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'WishList retrived successfully',
    data: result,
  });
});

const getmyWishList = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await WishListService.myWishList(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'WishList retrived successfully',
    data: result,
  });
});

export const WishListController = {
  createWishListToDB,
  removeWishListToDB,
  getAllWishListToDB,
  getmyWishList,
};
