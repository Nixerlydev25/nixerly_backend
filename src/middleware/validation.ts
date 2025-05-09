import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const bodyValidation =
  (schema: ZodSchema<any>) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body = schema.parse(request.body); 
      next();
    } catch (error) {
      next(error);
    }
  };

export const paramValidation = 
  (schema: ZodSchema<any>, paramName: string = 'id') =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      const param = request.params[paramName];
      request.params[paramName] = schema.parse(param);
      next();
    } catch (error) {
      next(error);
    }
  };