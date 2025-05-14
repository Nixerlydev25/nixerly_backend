import { z } from "zod";

export const createExperienceSchema = z.array(
  z.object({
    title: z.string({ required_error: "Job title is required" }),
    company: z.string({ required_error: "Company name is required" }),
    country:  z.string({ required_error: "Country is required" }),
    city: z.string({ required_error: "City is required" }),
    state: z.string({ required_error: "State is required" }),
    startDate: z
      .string({ required_error: "Start date is required" })
      .datetime("Invalid date format. Please provide a valid ISO date string"),
    endDate: z
      .string()
      .datetime("Invalid date format. Please provide a valid ISO date string")
      .optional(),
    description: z.string({ required_error: "Job description is required" }),
    current: z.boolean({ required_error: "Current employment status is required" }),
  })
);

export const updateExperienceSchema = z.object({
  id: z.string({ required_error: "Experience ID is required" }),
  title: z.string({ required_error: "Job title is required" }),
  company: z.string({ required_error: "Company name is required" }),
  location: z.string({ required_error: "Location is required" }),
  startDate: z
    .string({ required_error: "Start date is required" })
    .datetime("Invalid date format. Please provide a valid ISO date string"),
  endDate: z
    .string()
    .datetime("Invalid date format. Please provide a valid ISO date string")
    .optional(),
  description: z.string({ required_error: "Job description is required" }),
  current: z.boolean({ required_error: "Current employment status is required" }),
});

export const deleteExperienceSchema = z.object({
  id: z.string({ required_error: "Experience ID is required" }),
});
