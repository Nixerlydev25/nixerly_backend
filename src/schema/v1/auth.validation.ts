import { ProfileType } from "@prisma/client";
import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email format." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." }),
  name: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name must be at least 1 character long." }),
  profileType: z.nativeEnum(ProfileType, {
    required_error: "Profile type is required.",
  }),
});

export const updateUserDetailsSchema = z.object({
  defaultProfile: z.nativeEnum(ProfileType).optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email format." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const deleteAccountsSchema = z.object({
  userId: z
    .string({ required_error: "User ID is required." })
    .uuid({ message: "Invalid user ID format." }), // Assuming UUID format for user ID
  expoPushToken: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  otp: z.string({ required_error: "OTP is required." }),
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email format." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." }),
});
