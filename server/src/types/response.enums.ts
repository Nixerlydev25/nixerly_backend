export enum ResponseStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
  Forbidden = 403,
  Unauthorized = 401,
  BadGateway = 502,
  Redirect = 301,
  NotAcceptable = 406,
  NoContent=204,
  Conflict=409
}

export enum ResponseMessages {
  Success = "Success",
  InvalidEmailOrPassword = "Invalid email or password",
  UserAlreadyExists = "User already exists",
  InternalServerError = "Internal server error",
  InvalidRefreshToken = "Invalid refresh token",
  RefreshTokenNotProvided = "Refresh token not provided",
  LogoutSuccessful = "Logout successful",
  UserNotFound = "User not found",
  NotFound = "Data not found",
  Unauthorized = "Unauthorized",
  InvalidCredentials = "Invalid credentials",
  BadRequest = "The request could not be understood by the server due to malformed syntax.",
  Forbidden = "Insufficient permissions",
  Redirect = "user redirect",
  NoContent = "No content available",
}
