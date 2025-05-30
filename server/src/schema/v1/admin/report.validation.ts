import { z } from 'zod';
import { ReportCategory } from '@prisma/client';

export const getWorkerReports = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  category: z.nativeEnum(ReportCategory).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getBusinessReports = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  category: z.nativeEnum(ReportCategory).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getJobReports = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  category: z.nativeEnum(ReportCategory).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const reportIdSchema = z.string().uuid('Invalid report ID');
