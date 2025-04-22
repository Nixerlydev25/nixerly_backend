import { ResponseStatus } from "../types/response.enums";

export class DatabaseError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ResponseStatus.InternalServerError;
    this.name = "DatabaseError";
  }
}

export class AwsServiceError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ResponseStatus.BadRequest;
    this.name = "AwsServiceError";
  }
}

export class GeneralError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = ResponseStatus.InternalServerError) {
    super(message);
    this.statusCode = statusCode;
    this.name = "GeneralError";
  }
}

export class ValidationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = ResponseStatus.BadRequest) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ResponseStatus.NotFound;
    this.name = "NotFoundError";
  }
}
