import { z } from "zod";

export const workerIdParamSchema = z.string({
  required_error: "Worker ID is required",
});

export const businessIdParamSchema = z.string({
  required_error: "Business ID is required",
});

export const jobIdParamSchema = z.string({
  required_error: "Job ID is required",
}); 