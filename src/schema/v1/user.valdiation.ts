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

export const getProfilePictureUploadUrl = z.object({
  contentType: z.string().regex(/^image\/(jpeg|png|gif|webp)$/, "Invalid image format"),
  fileName: z.string().min(1, "File name is required"),
});

export const saveProfilePicture = z.object({
  s3Key: z.string().min(1, "S3 key is required"),
});