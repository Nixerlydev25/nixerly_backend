import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  AwsServiceError,
  DatabaseError,
  GeneralError,
  NotFoundError,
  ValidationError,
} from "../utils/errors";
import { ResponseMessages, ResponseStatus } from "../types/response.enums";

const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log('in error', error)
  let statusCode = ResponseStatus.InternalServerError;
  let message: string | ResponseMessages = ResponseMessages.InternalServerError;

  if (error instanceof ZodError) {
    console.log(error,'error')
    return response.status(ResponseStatus.BadRequest).json({
      success: false,
      message: "Invalid data",
      errors: error.errors,
    });
  } else if (
    error instanceof AwsServiceError ||
    error instanceof ValidationError ||
    error instanceof DatabaseError ||
    error instanceof GeneralError ||
    error instanceof NotFoundError
  ) {
    statusCode = error.statusCode;
    message = error.message;
  } else {
    message = error.message || message;
  }

  return response.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
