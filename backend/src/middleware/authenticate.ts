import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@config/env';
import { AppError } from '@utils/AppError';
import { authRepository } from '@modules/auth/auth.repository';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
  firstName: string;
  lastName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

interface DecodedToken {
  id: string;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Missing or malformed Authorization header'));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;

    // Re-fetch from DB on every request so role, active status, and
    // mustChangePassword are always current — never trust stale JWT claims.
    const user = await authRepository.findUserById(decoded.id);

    if (!user || !user.isActive) {
      return next(AppError.unauthorized('Account is inactive or no longer exists'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      mustChangePassword: user.mustChangePassword,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch {
    next(AppError.unauthorized('Invalid or expired token'));
  }
}