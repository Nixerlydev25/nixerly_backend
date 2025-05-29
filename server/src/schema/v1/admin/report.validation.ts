import { z } from 'zod';
import { ReportType } from '@prisma/client';

export const getAllReports = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  type: z.nativeEnum(ReportType).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getWorkerReports = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  type: z.nativeEnum(ReportType).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getBusinessReports = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  type: z.nativeEnum(ReportType).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getJobReports = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  type: z.nativeEnum(ReportType).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
