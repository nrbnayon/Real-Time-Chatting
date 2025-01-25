import { z } from 'zod';

const createUserZodSchema = z.object({
  name: z.string({ required_error: 'First name is required' }),
  email: z.string({ required_error: 'Email name is required' }),
  phone: z.string({ required_error: 'Phone name is required' }),
  password: z.string({ required_error: 'Password is required' }),
  address: z.string().optional(),
  postCode: z.string().optional(),
  profileImage: z.string().optional(),
});

const updateZodSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
});

const updateLocationZodSchema = z.object({
  body: z.object({
    longitude: z.string({ required_error: 'Longitude is required' }),
    latitude: z.string({ required_error: 'Latitude is required' }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateZodSchema,
  updateLocationZodSchema,
};
