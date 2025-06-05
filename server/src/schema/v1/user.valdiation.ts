import { z } from "zod";

export const forgotPassword = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOtp = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string({ required_error: "OTP is required" }),
});

export const resetPassword = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long"),
});

export const userIdSchema = z.string().uuid("Invalid worker ID format");

export const getAppliedJobsQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});
