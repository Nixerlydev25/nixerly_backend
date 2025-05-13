import { z } from "zod";


export const createEducationSchema = z.array(
  z.object({
    school: z.string({ required_error: "School name is required" }),
    degree: z.string({ required_error: "Degree is required" }),
    fieldOfStudy: z.string({ required_error: "Field of study is required" }),
    startDate: z
      .string({ required_error: "Start date is required" })
      .datetime("Invalid date format. Please provide a valid ISO date string"),
    endDate: z
      .string({ required_error: "End date is required" })
      .datetime("Invalid date format. Please provide a valid ISO date string")
      .optional(),
    description: z
      .string({ required_error: "Description is required" }),
    currentlyStudying: z.boolean({
      required_error: "Currently studying is required",
    }),
  })
);

export const updateEducationSchema = z.object({
  id: z.string({ required_error: "ID is required" }),
  school: z.string({ required_error: "School name is required" }),
  degree: z.string({ required_error: "Degree is required" }),
  fieldOfStudy: z.string({ required_error: "Field of study is required" }),
  startDate: z.string().datetime("Invalid date format. Please provide a valid ISO date string"),
  endDate: z.string().datetime("Invalid date format. Please provide a valid ISO date string").optional(),
  description: z.string({ required_error: "Description is required" }),
  currentlyStudying: z.boolean({
    required_error: "Currently studying is required",
  }),
});

export const deleteEducationSchema = z.object({
  id: z.string({ required_error: "ID is required" }),
});
