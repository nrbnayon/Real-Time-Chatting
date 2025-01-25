import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import getFilePath from '../../../shared/getFilePath';
import { BlogService } from './blog.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createBlogIntoDb = catchAsync(async (req: Request, res: Response) => {
  let image = getFilePath(req.files, 'images');
  const value = {
    image,
    ...req.body,
  };

  const result = await BlogService.createBlogsToDB(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog published successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getAllBlogs(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blogs retrived successfully',
    data: result,
  });
});

const getSingleblog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getSingleblog(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Single Blog retrived successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.deleteBlog(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog deleted successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  let image;
  if (req.files && 'image' in req.files && req.files.image[0]) {
    image = `/images/${req.files.image[0].filename}`;
  }
  const value = {
    image,
    ...req.body,
  };

  const result = await BlogService.updateBlog(req.params.id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog updated successfully!!!',
    data: result,
  });
});

export const BlogController = {
  createBlogIntoDb,
  getAllBlogs,
  getSingleblog,
  updateBlog,
  deleteBlog,
};
