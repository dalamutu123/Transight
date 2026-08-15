export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, details);
  }
  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }
  static forbidden(message = 'Forbidden', details?: unknown) {
    return new AppError(message, 403, details);
  }
  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }
  static conflict(message: string, details?: unknown) {
    return new AppError(message, 409, details);
  }
  static validation(message: string, details?: unknown) {
    return new AppError(message, 422, details);
  }
}