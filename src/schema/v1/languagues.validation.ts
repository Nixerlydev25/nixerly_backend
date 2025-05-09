import { z } from "zod";

export const createUserLanguageSchema = z.object({
  language: z.string().min(1),
  proficiency: z.string().min(1),
});

export const updateUserLanguageSchema = z.object({
  language: z.string().optional(),
  proficiency: z.string().optional(),
});

export const deleteUserLanguageSchema = z.object({
  language: z.string().min(1),
});