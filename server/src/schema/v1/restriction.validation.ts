import { z } from "zod";
import { RestrictionType } from "@prisma/client"; 

export const createRestrictionSchema = z.object({
  userId: z.string(),
  restrictionType: z.enum([
    RestrictionType.APPLY_TO_JOBS,
    RestrictionType.SEND_MESSAGES,
    RestrictionType.POST_JOBS,
    RestrictionType.HIRE_WORKERS,
    RestrictionType.VIEW_PROFILES,
    RestrictionType.SUBMIT_REVIEWS,
    RestrictionType.SUBMIT_REPORTS,
  ]),
});

export const getRestrictionSchema = z.object({
  userId: z.string(),
});

export const removeRestrictionSchema = z.object({
  userId: z.string(),
  restrictionType: z.enum([
    RestrictionType.APPLY_TO_JOBS,
    RestrictionType.SEND_MESSAGES,
    RestrictionType.POST_JOBS,
    RestrictionType.HIRE_WORKERS,
    RestrictionType.VIEW_PROFILES,
    RestrictionType.SUBMIT_REVIEWS,
    RestrictionType.SUBMIT_REPORTS,
  ]),
});
