import { Model, Types } from 'mongoose';

export type IProduct = {
  name: string;
  image: string[];
  video: string;
  price: number;
  rating?: number;
  count?: string;
  category: Types.ObjectId;
  colour: Types.ObjectId;
  size: Types.ObjectId[];
  description: string;
  features: string[];
  gender: 'male' | 'female';
  status: 'active' | 'delete';
};

export type UpdateProductsPayload = Partial<IProduct> & {
  imagesToDelete?: string[];
};

export type ProductModel = Model<IProduct>;
