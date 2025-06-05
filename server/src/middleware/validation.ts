import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

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

  export const queryValidation =
  (schema: ZodSchema<any>) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      request.query = schema.parse(request.query);
      next();
    } catch (error) {
      next(error);
    }
  };


export const userValidation = (schema: AnyZodObject) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.user?.userId) {
        throw new ValidationError('User ID is required');
      }
      await schema.parseAsync(request.user.userId);
      return next();
    } catch (error) {
      return next(new ValidationError(error as string));
    }
  };
};
