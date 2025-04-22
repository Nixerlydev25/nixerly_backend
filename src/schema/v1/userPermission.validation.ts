import { z } from "zod";

export const createSchema = z.object({
  userId: z
  .string({ required_error: "User Id is required" }),
  permissions: z
    .array(z.string(), { required_error: "Permissions is required" })
});

export const getSchema = z.object({
  userId: z
  .string({ required_error: "User Id is required" })
});


export const updateSchema = z.object({
  permissions: z
    .array(z.string(), { required_error: "Permissions is required" })
});