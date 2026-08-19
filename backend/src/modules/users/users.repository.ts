import { prisma } from '@config/db';
import { Prisma } from '../../../generated/prisma/client';

export const usersRepository = {
  findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  },

  create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  },

  async findMany(page: number, limit: number) {
    const where = { deletedAt: null };
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { role: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return prisma.user.findFirst({ where: { id, deletedAt: null }, include: { role: true } });
  },

  update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return prisma.user.update({ where: { id }, data, include: { role: true } });
  },

  // Soft delete: preserves the row (and every historical foreign-key
  // reference from uploads, transactions, reports, and audit logs) while
  // permanently disabling the account and removing it from active lists.
  softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
      include: { role: true },
    });
  },
};