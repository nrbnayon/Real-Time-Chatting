import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    rating: z.number({ required_error: 'Rating is required' }).max(5).min(1),
    review: z.string({ required_error: 'Review is required' }),
  }),
});

const updatedReviewSchema = z.object({
  body: z.object({
    rating: z.number().optional(),
    review: z.string().optional(),
  }),
});

export const ReviewValidation = {
  createReviewSchema,
  updatedReviewSchema,
};
