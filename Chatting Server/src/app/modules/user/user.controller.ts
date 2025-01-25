// src\app\modules\user\user.controller.ts
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import getFilePath from '../../../shared/getFilePath';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = { ...req.body };

      // Call the service function and capture the result
      const result = await UserService.createUserFromDb(value);

      // Send response with the email from the result
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message:
          'Please check your email to verify your account. We have sent you an OTP to complete the registration process.',
        data: result.email,
      });
    } catch (error) {
      // Explicitly handle the error type
      if (error instanceof Error) {
        next(error); // Pass the error to the global error handler
      } else {
        next(new Error('An unknown error occurred')); // Handle unknown errors
      }
    }
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      image = `/images/${req.files.image[0].filename}`;
    }

    const value = {
      image,
      ...req.body,
    };

    console.log(value);

    const result = await UserService.updateProfileToDB(user, value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User retrived successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSingleUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User retrived successfully',
    data: result,
  });
});

const getOnlineUsers = catchAsync(async (req: Request, res: Response) => {
  // Replace console.log with a logging library in production
  console.debug('Controller: Retrieving online users');

  const onlineUsers = await UserService.getOnlineUsers();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Online users retrieved successfully. Total: ${onlineUsers.length}`,
    data: onlineUsers,
  });
});

const updateOnlineStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId, status } = req.body;

  // Input validation
  if (!userId || typeof status !== 'boolean') {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid userId or status. Please provide valid inputs.',
    });
  }

  // Replace console.log with a logging library in production
  console.debug(
    `Controller: Updating user ${userId} online status to ${status}`
  );

  const updatedUser = await UserService.updateUserOnlineStatus(userId, status);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `User online status updated successfully to ${
      status ? 'online' : 'offline'
    }`,
    data: updatedUser,
  });
});


export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  getAllUser,
  getSingleUser,getOnlineUsers,updateOnlineStatus
};
