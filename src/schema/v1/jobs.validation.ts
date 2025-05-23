import { z } from "zod";
import {
  SkillName,
  JobStatus,
  JobType,
  JobApplicationDuration,
} from "@prisma/client";

type JobSchema = {
  jobType: JobType;
  budget?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  salary?: number;
};

export const createJobSchema = z
  .object({
    title: z.string({ required_error: "Job title is required" }),
    description: z.string({ required_error: "Job description is required" }),
    jobType: z.nativeEnum(JobType, { required_error: "Job type is required" }),
    budget: z.number().optional(),
    hourlyRateMin: z.number().optional(),
    hourlyRateMax: z.number().optional(),
    salary: z.number().optional(),
    skills: z
      .array(z.nativeEnum(SkillName))
      .min(1, "At least one skill is required"),
    requirements: z.string({ required_error: "Job requirements are required" }),
    expiresAt: z
      .string()
      .datetime("Invalid date format. Please provide a valid ISO date string")
      .optional(),
    startDate: z
      .string()
      .datetime("Invalid date format. Please provide a valid ISO date string")
      .optional(),
    numberOfWorkersRequired: z
      .number()
      .min(1, "Number of workers required is required"),
    location: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.jobType === "HOURLY") {
        return (
          data.hourlyRateMin != null &&
          data.hourlyRateMax != null &&
          !data.budget &&
          !data.salary
        );
      }
      if (data.jobType === "CONTRACT") {
        return (
          data.budget != null &&
          !data.hourlyRateMin &&
          !data.hourlyRateMax &&
          !data.salary
        );
      }
      if (data.jobType === "SALARY") {
        return (
          data.salary != null &&
          !data.budget &&
          !data.hourlyRateMin &&
          !data.hourlyRateMax
        );
      }
      return false;
    },
    {
      message: "Invalid combination of fields for the selected job type",
      path: ["jobType"], // This will make the error show up on the jobType field
    }
  );

export const getJobsQuerySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
  budget: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
  skills: z.array(z.nativeEnum(SkillName)).optional(),
  minHourlyRate: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  maxHourlyRate: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  status: z.nativeEnum(JobStatus).optional(),
});

export const getApplicantsOfJobQuerySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
});

export const getJobDetailsSchema = z.string().uuid("Invalid job ID");

export const applyJobSchema = z.object({
  coverLetter: z.string({ required_error: "Cover letter is required" }),
  proposedRate: z.number().min(0, "Proposed rate must be greater than 0"),
  availability: z
    .string()
    .datetime({
      message: "Invalid date format. Please provide a valid ISO date string",
    }),
  jobDuration: z.nativeEnum(JobApplicationDuration, {
    required_error: "Duration is required",
  }),
});

export const applyJobParamSchema = z.string().uuid("Invalid job ID");
