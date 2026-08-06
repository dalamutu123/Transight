import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/AppError';
import { sendError } from '@utils/apiResponse';
import { logger } from '@config/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(err.stack);
    }
    return sendError(res, err.message, err.statusCode, err.details);
  }

  const error = err as Error;
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}: ${error.stack || error.message}`);

  return sendError(res, 'An unexpected error occurred. Please try again later.', 500);
}

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}