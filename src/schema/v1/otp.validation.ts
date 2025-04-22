import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z
  .string({ required_error: "Otp is required" })
});

export const sendOtpSchema = z.object({
  email: z
  .string({ required_error: "Email is required" })
});

export const sendOtpwithUserSchema = z.object({
  email: z
  .string({ required_error: "Email is required" }),
  userId: z
  .string({ required_error: "User Id is required" })
});


export const verifyOtpByEmailSchema = z.object({
  otp: z
  .string({ required_error: "Otp is required" }),
  email: z
  .string({ required_error: "Email is required" })
});