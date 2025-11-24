export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly timeStamp: Date;

  constructor(message: string, statusCode: number = 500, errorCode: string = "INTERNAL_ERROR", cause?: unknown) {
    super(message, { cause });
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
  constructor(message: string, errorCode: string = "VALIDATION_ERROR", cause?: unknown) {
    super(message, 400, errorCode, cause);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized", errorCode: string = "UNAUTHORIZED", cause?: unknown) {
    super(message, 401, errorCode, cause);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden", errorCode: string = "FORBIDDEN", cause?: unknown) {
    super(message, 403, errorCode, cause);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found", errorCode: string = "NOT_FOUND", cause?: unknown) {
    super(message, 404, errorCode, cause);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, errorCode: string = "CONFLICT", cause?: unknown) {
    super(message, 409, errorCode, cause);
  }
}
