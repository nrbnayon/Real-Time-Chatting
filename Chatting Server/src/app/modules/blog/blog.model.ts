import { model, Schema } from 'mongoose';
import { IBlogs } from './blog.interface';

const faqSchema = new Schema<IBlogs>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    des: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = model<IBlogs>('blog', faqSchema);
