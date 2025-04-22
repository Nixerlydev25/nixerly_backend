import { z } from "zod";
import { Restrictions } from "@prisma/client"; 

export const createRestrictionSchema = z.object({
  userId: z.string(),
  restrictionType: z.enum([
    Restrictions.CREATE_POST,
    Restrictions.EDIT_POST,
    Restrictions.DELETE_POST,
    Restrictions.VIEW_POST,
    Restrictions.CREATE_COMMENT,
    Restrictions.VIEW_COMMENT,
    Restrictions.ANALYTICS,
    Restrictions.REPORT,
    Restrictions.ACCOUNT,
    Restrictions.CONTENT,
  ]),
});

export const getRestrictionSchema = z.object({
  userId: z.string(),
});

export const removeRestrictionSchema = z.object({
  userId: z.string(),
  restrictionType: z.enum([
    Restrictions.CREATE_POST,
    Restrictions.EDIT_POST,
    Restrictions.DELETE_POST,
    Restrictions.VIEW_POST,
    Restrictions.CREATE_COMMENT,
    Restrictions.VIEW_COMMENT,
    Restrictions.ANALYTICS,
    Restrictions.REPORT,
    Restrictions.ACCOUNT,
    Restrictions.CONTENT,
  ]),
});
