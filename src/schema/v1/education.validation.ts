import { z } from "zod";

export const createEducationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  description: z.string().optional(),
});

export const updateEducationSchema = z.object({
  id: z.string(),
  school: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  description: z.string().optional(),
});

export const deleteEducationSchema = z.object({
  id: z.string(),
});
