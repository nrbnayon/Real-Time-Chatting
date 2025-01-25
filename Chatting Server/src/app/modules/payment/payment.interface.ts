import { Types } from 'mongoose';

export interface IProductWithQuantity {
  productId: Types.ObjectId;
  quantity: number;
  size: string;
  neckSize: string;
  chestSize: string;
  collarSize: string;
  price?: number;
}

export type IPayment = {
  amount: number;
  user: Types.ObjectId;
  products: IProductWithQuantity[];
  transactionId: string;
  size: string;
  neckSize: string;
  chestSize: string;
  collarSize: string;
  email: string;
  code?: string;
  status: string;
  client_secret: string;
};
