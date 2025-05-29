import { z } from 'zod';
import { SkillName } from '@prisma/client';

export const getAllWorkers = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    search: z.string().optional(),
    skills: z.nativeEnum(SkillName).optional(),
    country: z.string().optional(),
  }),
});

export const toggleWorkerBlock = z.object({
  params: z.object({
    workerId: z.string().uuid('Invalid worker ID'),
  }),
});
