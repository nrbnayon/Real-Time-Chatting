import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  role: USER_ROLES;
  name: string;
  email: string;
  phone: string;
  password: string;
  postCode: string;
  address?: string;
  country?: string;
  status: 'active' | 'delete';
  verified: boolean;
  profileImage: string;
  image: string;
  isChatAdmin?: boolean;
  onlineStatus?: boolean;
  lastActiveAt?: Date;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
