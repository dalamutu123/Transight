import { prisma } from '@config/db';
import { Prisma } from '../../../generated/prisma/client';

export const auditRepository = {
  create(data: Prisma.AuditLogUncheckedCreateInput) {
    return prisma.auditLog.create({ data });
  },

  async findMany(filters: {
    page: number;
    limit: number;
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: Prisma.AuditLogWhereInput = {
      userId: filters.userId,
      action: filters.action ? { contains: filters.action, mode: 'insensitive' } : undefined,
      createdAt: {
        gte: filters.startDate,
        lte: filters.endDate,
      },
    };

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  },
};