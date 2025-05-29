import { z } from 'zod';
import { UserStatus } from '../../../types/global';

export const getAllBusinesses = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  status: z
    .string()
    .transform((val) => {
      if (!val) return undefined;
      if (val === UserStatus.ACTIVE || val === UserStatus.BLOCKED)
        return val as UserStatus;
      throw new Error('Invalid status. Must be ACTIVE or BLOCKED');
    })
    .optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
});

export const toggleBusinessBlock = z.string().uuid('Invalid business ID');
