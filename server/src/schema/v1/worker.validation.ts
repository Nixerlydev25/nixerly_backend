import { JobStatus, SkillName } from "@prisma/client";
import { z } from "zod";

export const getWorkerDetailsSchema = z
  .string()
  .uuid({ message: "Invalid worker ID format" });

export const getProfilePictureUploadUrl = z.object({
  contentType: z
    .string()
    .regex(/^image\/(jpeg|png|gif|webp)$/, "Invalid image format"),
  fileName: z.string().min(1, "File name is required"),
});

export const saveProfilePicture = z.object({
  s3Key: z.string().min(1, "S3 key is required"),
});

export const getJobsByBusiness = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  search: z.string().optional(),
  status: z.nativeEnum(JobStatus).optional(),
});

export const wokerPagination = z.object({
  skills: z
    .string()
    .transform((skills) => skills.split(",").map((skill) => skill as SkillName))
    .optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sort: z
    .enum(["rating", "price_low_to_high", "price_high_to_low"])
    .default("rating")
    .optional(),
  search: z.string().optional(),
  minHourlyRate: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional()
    .refine((val) => val === undefined || !isNaN(val), {
      message: "minHourlyRate must be a number",
    }),
  maxHourlyRate: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional()
    .refine((val) => val === undefined || !isNaN(val), {
      message: "maxHourlyRate must be a number",
    }),
  minTotalEarnings: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional()
    .refine((val) => val === undefined || !isNaN(val), {
      message: "minTotalEarnings must be a number",
    }),
  maxTotalEarnings: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional()
    .refine((val) => val === undefined || !isNaN(val), {
      message: "maxTotalEarnings must be a number",
    }),
  minAvgRating: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional()
    .refine((val) => val === undefined || !isNaN(val), {
      message: "minAvgRating must be a number",
    }),
  maxAvgRating: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional()
    .refine((val) => val === undefined || !isNaN(val), {
      message: "maxAvgRating must be a number",
    }),
});
