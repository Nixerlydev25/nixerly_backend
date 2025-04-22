import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema =
  (schema: ZodSchema<any>) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body = schema.parse(request.body); 
      next();
    } catch (error) {
      next(error);
    }
  };