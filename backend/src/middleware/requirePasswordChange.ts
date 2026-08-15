import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/AppError';

/**
 * Blocks access to any route it guards while the authenticated user still
 * has a forced password change pending. Applied to every protected router
 * except /auth/me, /auth/logout, and /auth/change-password.
 */
export function requirePasswordChangeComplete(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.mustChangePassword) {
    return next(
      AppError.forbidden('You must change your password before continuing', {
        code: 'PASSWORD_CHANGE_REQUIRED',
      })
    );
  }
  next();
}