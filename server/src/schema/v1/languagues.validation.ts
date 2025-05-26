import { z } from "zod";
import { Language, Proficiency } from "@prisma/client";

export const createUserLanguageSchema = z.object({
  languages: z.array(z.object({
    name: z.string().min(1),
    proficiency: z.string().min(1),
  })).min(1),
});

export const updateUserLanguageSchema = z.object({
  language: z.string().optional(),
  proficiency: z.string().optional(),
});

export const deleteUserLanguageSchema = z.object({
  language: z.string().min(1),
});

export const updateAllLanguagesSchema = z.object({
  languages: z.array(z.object({
    name: z.nativeEnum(Language),
    proficiency: z.nativeEnum(Proficiency),
  })).min(1),
});