import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/AppError';

/**
 * Restricts a route to the given roles.
 * Usage: router.post('/', authenticate, authorize('Administrator'), handler)
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden('You do not have permission to perform this action'));
    }

    next();
  };
}