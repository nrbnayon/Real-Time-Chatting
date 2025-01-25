import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import getFilePath, { getFilePathMultiple } from '../../../shared/getFilePath';
import { ProductService } from './product.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createProductIntoDb = catchAsync(async (req: Request, res: Response) => {
  //   let image = getFilePath(req.files, 'image');

  const value = {
    ...req.body,
  };

  let video = getFilePathMultiple(req.files, 'media', 'media');
  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    // value.image = image[0];
    value.image = image;
  }

  if (video && video.length > 0) {
    value.video = video[0];
  }

  const result = await ProductService.createProductIntoDb(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = req.body;

  const result = await ProductService.getAllProducts(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Products retrived successfully',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getSingleProduct(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Single Products retrived successfully',
    data: result,
  });
});

const updatedProductIntoDb = catchAsync(async (req: Request, res: Response) => {
  const PrId = req.params.id;
  const value = {
    ...req.body,
  };

  let video = getFilePathMultiple(req.files, 'media', 'media');
  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    // value.image = image[0];
    value.image = image;
  }

  if (video && video.length > 0) {
    value.video = video[0];
  }

  const result = await ProductService.updateProduct(PrId, value);
  console.log(result, 'result');
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.deleteProduct(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Products deleted successfully',
    data: result,
  });
});

const similarProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.similarProducts(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Similar Products retrived successfully',
    data: result,
  });
});

export const ProductController = {
  createProductIntoDb,
  getAllProducts,
  getSingleProduct,
  updatedProductIntoDb,
  deleteProduct,
  similarProducts,
};
