import { EmploymentType, JobStatus, JobType } from "@prisma/client";
import { z } from "zod";

export const getAllJobs = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  search: z.string().optional(),
  employmentType: z.nativeEnum(EmploymentType).optional(),
  jobType: z.nativeEnum(JobType).optional(),
  status: z.nativeEnum(JobStatus).optional(),
});

export const toggleJobBlock = z.string().uuid("Invalid job ID");
