// src\app\modules\user\user.service.ts
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { SortOrder, startSession } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';

import { IUser } from './user.interface';
import { User } from './user.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import unlinkFile from '../../../shared/unlinkFile';

const createUserFromDb = async (payload: IUser) => {
  payload.role = USER_ROLES.USER;

  try {
    const result = await User.create(payload);

    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User creation failed');
    }

    const otp = generateOTP();
    const emailValues = {
      name: result.name,
      otp,
      email: result.email,
    };

    const accountEmailTemplate = emailTemplate.createAccount(emailValues);
    emailHelper.sendEmail(accountEmailTemplate);

    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000),
    };

    const updatedUser = await User.findOneAndUpdate(
      { _id: result._id },
      { $set: { authentication } },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found for update');
    }

    if (result.status === 'active') {
      const data = {
        text: `Registered successfully, ${result.name}`,
        type: 'ADMIN',
      };

      await sendNotifications(data);
    }

    return { email: result.email };
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'User creation failed'
    );
  }
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterData
  } = query;

  // Search conditions
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [{ fullName: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  // Add filter conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );
    conditions.push({ $and: filterConditions });
  }

  conditions.push({ role: USER_ROLES.USER });

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const currentPage = Number(page);
  const pageSize = Number(limit);
  const skip = (currentPage - 1) * pageSize;

  // Sorting setup
  const sortOrder = order === 'desc' ? -1 : 1;
  const sortCondition: { [key: string]: SortOrder } = {
    [sortBy as string]: sortOrder,
  };

  // Query the database
  const [users, total] = await Promise.all([
    User.find(whereConditions)
      .sort(sortCondition)
      .skip(skip)
      .limit(pageSize)
      .lean<IUser[]>(), // Assert type
    User.countDocuments(whereConditions),
  ]);

  // Format the `updatedAt` field
  const formattedUsers = users?.map(user => ({
    ...user,
    updatedAt: user.updatedAt
      ? new Date(user.updatedAt).toISOString().split('T')[0]
      : null,
  }));

  // Meta information for pagination
  return {
    result: formattedUsers,
    meta: {
      total,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
    },
  };
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
  }

  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUserOnlineStatus = async (userId: string, isOnline: boolean) => {
  console.log(`Updating user ${userId} online status to: ${isOnline}`);

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        onlineStatus: isOnline,
        lastActiveAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    console.log(`User ${userId} online status updated successfully`);
    return user;
  } catch (error) {
    console.error('Error updating user online status:', error);
    throw error;
  }
};

const getOnlineUsers = async () => {
  console.log('Fetching online users');
  try {
    const onlineUsers = await User.find({
      onlineStatus: true,
    }).select('name email profileImage');

    console.log(`Found ${onlineUsers.length} online users`);
    return onlineUsers;
  } catch (error) {
    console.error('Error fetching online users:', error);
    throw error;
  }
};

export const UserService = {
  createUserFromDb,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsers,
  getSingleUser,
  getOnlineUsers,
  updateUserOnlineStatus,
};
