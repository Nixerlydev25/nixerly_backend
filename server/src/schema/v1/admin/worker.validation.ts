import { z } from 'zod';
import { SkillName } from '@prisma/client';
import { UserStatus } from '../../../types/global';

export const getAllWorkers = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  skills: z.nativeEnum(SkillName).optional(),
  country: z.string().optional(),
  status: z
    .string()
    .transform((val) => {
      if (!val) return undefined;
      if (val === UserStatus.ACTIVE || val === UserStatus.BLOCKED)
        return val as UserStatus;
      throw new Error('Invalid status. Must be ACTIVE or BLOCKED');
    })
    .optional(),
});

export const toggleWorkerBlock = z.string().uuid('Invalid worker ID');
