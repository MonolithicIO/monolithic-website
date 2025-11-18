export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly timeStamp: Date;

  constructor(message: string, statusCode: number = 500, errorCode: string = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timeStamp = new Date();

    Object.setPrototypeOf(this, ApiError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, errorCode: string = "VALIDATION_ERROR") {
    super(message, 400, errorCode);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized", errorCode: string = "UNAUTHORIZED") {
    super(message, 401, errorCode);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden", errorCode: string = "FORBIDDEN") {
    super(message, 403, errorCode);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found", errorCode: string = "NOT_FOUND") {
    super(message, 404, errorCode);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, errorCode: string = "CONFLICT") {
    super(message, 409, errorCode);
  }
}
