import { Roles } from "@prisma/client";
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
});

export const updateUserDetailsSchema = z.object({
  organization: z.string().optional(),
  profession: z.string().optional(),
  howDidYouHearAboutUs: z.string().optional(),
  schoolName: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  subjectsTaught: z.string().optional(),
  gradeLevel: z.string().optional(),
  educationalQualification: z.string().optional(),
  teacherLicenseNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email format." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const createAccountsSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email format." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." }),
  type: z
    .enum([Roles.ADMIN, Roles.DEVELOPER], {
      required_error: "Type is required.",
    })
    .describe('The type of account: "admin" or "developer"'),
  age: z.number().optional(),
  expoPushToken: z.string().optional(),
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
