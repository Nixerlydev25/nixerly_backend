import { z } from "zod";
import {
  WorkerReportReason,
  BusinessReportReason,
  JobReportReason,
} from "@prisma/client";

// Body schemas
export const reportWorkerBodySchema = z.object({
  reason: z.nativeEnum(WorkerReportReason, {
    required_error: "Report reason is required",
  }),
  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters long"),
});

export const reportBusinessBodySchema = z.object({
  reason: z.nativeEnum(BusinessReportReason, {
    required_error: "Report reason is required",
  }),
  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters long"),
});

export const reportJobBodySchema = z.object({
  reason: z.nativeEnum(JobReportReason, {
    required_error: "Report reason is required",
  }),
  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters long"),
});

// Param schemas
export const reportWorkerParamSchema = z.string({
  required_error: "Reported worker ID is required",
});

export const reportBusinessParamSchema = z.string({
  required_error: "Reported business ID is required",
});

export const reportJobParamSchema = z.string({
  required_error: "Reported job ID is required",
});
