import { z } from 'zod';

export const getAllBusinesses = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    search: z.string().optional(),
    industry: z.string().optional(),
    country: z.string().optional(),
  }),
});

export const toggleBusinessBlock = z.object({
  params: z.object({
    businessId: z.string().uuid('Invalid business ID'),
  }),
});
