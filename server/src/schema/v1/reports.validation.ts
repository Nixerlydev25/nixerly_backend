import { z } from 'zod';
import { ReportCategory } from '@prisma/client';

export const createReportWorkerSchema = z.object({
  reason: z.string().min(1),
  category: z.nativeEnum(ReportCategory),
  targetWorkerId: z.string().min(1),
});

export const reportWorkerIdSchema = z.string().uuid('Invalid worker ID');

export const reportBusinessSchema = z.object({
  reason: z.string().min(1),
  category: z.nativeEnum(ReportCategory),
  targetBusinessId: z.string().min(1),
});

export const reportBusinessIdSchema = z.string().uuid('Invalid business ID');

export const reportJobSchema = z.object({
  reason: z.string().min(1),
  category: z.nativeEnum(ReportCategory),
  targetJobId: z.string().min(1),
});

export const reportJobIdSchema = z.string().uuid('Invalid job ID');
