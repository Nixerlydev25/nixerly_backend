import {
  OnboardingStepBusinessProfile,
  OnboardingStepWorkerProfile,
  ProfileType,
} from "@prisma/client";
import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email format." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." }),
  firstName: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name must be at least 1 character long." }),
  lastName: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name must be at least 1 character long." }),
  profileType: z.nativeEnum(ProfileType, {
    required_error: "Profile type is required.",
  }),
});

export const updateWorkerProfileSchema = z.object({
  onboardingStep: z.nativeEnum(OnboardingStepWorkerProfile).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  hourlyRate: z.number().optional(),
  availability: z.boolean().optional(),
  phoneNumber: z.string().optional(),
});

export const updateBusinessProfileSchema = z.object({
  onboardingStep: z.nativeEnum(OnboardingStepBusinessProfile).optional(),
  companyName: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  website: z.string().optional().nullable(),
  employeeCount: z.number().optional(),
  yearFounded: z.number().optional(),
  phoneNumber: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  defaultProfile: z.nativeEnum(ProfileType).optional(),
  firstTimeLogin: z.boolean().optional(),
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
