import { z } from 'zod';

const createBlogsSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  des: z.string({ required_error: 'Description is required' }),
});

const updateBlogsSchema = z.object({
  title: z.string().optional(),
  des: z.string().optional(),
});

export const BlogsValidation = {
  createBlogsSchema,
  updateBlogsSchema,
};
