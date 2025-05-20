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
