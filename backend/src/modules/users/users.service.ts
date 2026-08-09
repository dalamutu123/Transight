import bcrypt from 'bcrypt';
import { AppError } from '@utils/AppError';
import { buildPagination } from '@utils/apiResponse';
import { usersRepository } from './users.repository';
import { auditService } from '@modules/audit/audit.service';
import type { CreateUserInput, UpdateUserInput } from './users.validation';

function serializeUser(user: NonNullable<Awaited<ReturnType<typeof usersRepository.findById>>>) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role.name,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export const usersService = {
  async create(input: CreateUserInput, actorId: string) {
    const existing = await usersRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.conflict('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await usersRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
      roleId: input.roleId,
    });

    await auditService.record({
      userId: actorId,
      action: 'CREATE_USER',
      description: `Created user ${user.email}`,
    });

    return serializeUser(user);
  },

  async list(page: number, limit: number) {
    const { items, total } = await usersRepository.findMany(page, limit);
    return { items: items.map(serializeUser), pagination: buildPagination(page, limit, total) };
  },

  async update(id: string, input: UpdateUserInput, actorId: string) {
    const existing = await usersRepository.findById(id);
    if (!existing) {
      throw AppError.notFound('User not found');
    }

    const updated = await usersRepository.update(id, input);

    await auditService.record({
      userId: actorId,
      action: 'UPDATE_USER',
      description: `Updated user ${updated.email}`,
    });

    return serializeUser(updated);
  },
};