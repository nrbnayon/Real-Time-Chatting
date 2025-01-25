import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  price: z.number({ required_error: 'Price is required' }),
  rating: z.number().optional(),
  category: z.string({ required_error: 'Category is required' }),
  size: z.array(z.string()).nonempty({ message: 'Size is required' }),
  colour: z.string({ required_error: 'Colors is required' }),
  description: z.string({ required_error: 'Description is required' }),
  gender: z.enum(['male', 'female']),
  features: z.array(z.string()).nonempty({ message: 'Features is required' }),
});

const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  rating: z.number().optional(),
  category: z.string().optional(),
  size: z.array(z.string()).nonempty().optional(),
  colour: z.string().optional(),
  description: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  features: z.array(z.string()).nonempty().optional(),
});

export const ProductValidation = {
  createProductSchema,
  updateProductSchema,
};
