import { z } from "zod";
import { SkillName, JobStatus, JobType } from "@prisma/client";

// jobType           JobType          @default(FULL_TIME)
//   startDate         DateTime?
//   numberOfWorkersRequired Int?
export const createJobSchema = z.object({
  title: z.string({ required_error: "Job title is required" }),
  description: z.string({ required_error: "Job description is required" }),
  budget: z.number().optional(),
  hourlyRateMin: z.number().optional(),
  hourlyRateMax: z.number().optional(),
  skills: z
    .array(z.nativeEnum(SkillName))
    .min(1, "At least one skill is required"),
  requirements: z.string({ required_error: "Job requirements are required" }),
  expiresAt: z
    .string()
    .datetime("Invalid date format. Please provide a valid ISO date string")
    .optional(),
  jobType: z.nativeEnum(JobType).optional(),
  startDate: z
    .string()
    .datetime("Invalid date format. Please provide a valid ISO date string")
    .optional(),
  numberOfWorkersRequired: z.number().min(1, "Number of workers required is required"),
});

export const getJobsQuerySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sortBy: z.enum(["createdAt", "budget", "hourlyRateMin"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
  minHourlyRate: z.string().transform(Number).optional(),
  maxHourlyRate: z.string().transform(Number).optional(),
  status: z.nativeEnum(JobStatus).optional(),
});
