import { z } from "zod";
import { SkillName } from "@prisma/client";

export const getAllWorkersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    skills: z
      .string()
      .optional()
      .transform((val) =>
        val
          ? val.split(",").map((skill) => skill as SkillName)
          : undefined
      ),
    minHourlyRate: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    maxHourlyRate: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    minTotalEarnings: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    maxTotalEarnings: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    minAvgRating: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    maxAvgRating: z
      .string()
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
  }),
}); 