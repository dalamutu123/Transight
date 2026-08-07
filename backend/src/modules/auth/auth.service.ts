import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '@config/env';
import { AppError } from '@utils/AppError';
import { authRepository } from './auth.repository';
import { auditService } from '@modules/audit/audit.service';
import type { LoginInput } from './auth.validation';

export const authService = {
  async login(input: LoginInput, ipAddress?: string) {
    const user = await authRepository.findUserByEmail(input.email);

    if (!user || !user.isActive) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      await auditService.record({
        userId: user.id,
        action: 'LOGIN_FAILED',
        description: `Failed login attempt for ${user.email}`,
        ipAddress,
      });
      throw AppError.unauthorized('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    await auditService.record({
      userId: user.id,
      action: 'LOGIN',
      description: `${user.email} logged in`,
      ipAddress,
    });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      },
    };
  },

  async getCurrentUser(userId: string) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw AppError.notFound('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
    };
  },
};