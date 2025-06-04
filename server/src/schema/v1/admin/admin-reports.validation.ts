import { z } from "zod";
import { ReportStatus } from "@prisma/client";

// Base filter schema that will be used for all report types
const baseFilterSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  search: z.string().optional(),
  startDate: z
    .string()
    .datetime("Invalid date format. Please provide a valid ISO date string")
    .optional(),
  endDate: z
    .string()
    .datetime("Invalid date format. Please provide a valid ISO date string")
    .optional(),
  status: z.nativeEnum(ReportStatus).optional(),
});

export const jobReportsFilterSchema = baseFilterSchema;
export const workerReportsFilterSchema = baseFilterSchema;
export const businessReportsFilterSchema = baseFilterSchema;

// Report ID parameter validation schemas
export const reportIdParamSchema = z.string({
  required_error: "Report ID is required",
});
