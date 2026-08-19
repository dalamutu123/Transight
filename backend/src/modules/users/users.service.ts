import bcrypt from 'bcrypt';
import { AppError } from '@utils/AppError';
import { buildPagination } from '@utils/apiResponse';
import { generateTempPassword } from '@utils/generateTempPassword';
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
    mustChangePassword: user.mustChangePassword,
    createdAt: user.createdAt,
  };
}

export const usersService = {
  async create(input: CreateUserInput, actorId: string) {
    const existing = await usersRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.conflict('A user with this email already exists');
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const user = await usersRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
      roleId: input.roleId,
      mustChangePassword: true,
    });

    await auditService.record({
      userId: actorId,
      action: 'CREATE_USER',
      description: `Created user ${user.email} with role ${user.role.name}`,
    });

    // tempPassword is only ever returned here, once. It is not
    // recoverable afterward — the admin must relay it out-of-band.
    return { ...serializeUser(user), tempPassword };
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

  async remove(id: string, actorId: string) {
    if (id === actorId) {
      throw AppError.badRequest('You cannot delete your own account');
    }

    const existing = await usersRepository.findById(id);
    if (!existing) {
      throw AppError.notFound('User not found');
    }

    await usersRepository.softDelete(id);

    // Preserved deliberately: this user's uploads, transactions, reports,
    // and audit log entries remain in the system, still correctly
    // attributed to them, per data-integrity and auditability requirements.
    await auditService.record({
      userId: actorId,
      action: 'DELETE_USER',
      description: `Deleted user ${existing.email} (${existing.role.name})`,
    });

    return { success: true };
  },
};