import { prisma } from '@config/db';
import { Prisma } from '../../../generated/prisma/client';
import type { AdminAllAuditQuery } from './audit.validation';

function buildAdminWhereClause(filters: AdminAllAuditQuery): Prisma.AuditLogWhereInput {
  return {
    userId: filters.userId,
    user: filters.roleId ? { roleId: filters.roleId } : undefined,
    action: filters.action,
    createdAt: {
      gte: filters.startDate ? new Date(filters.startDate) : undefined,
      lte: filters.endDate ? new Date(filters.endDate) : undefined,
    },
  };
}

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
      action: filters.action,
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

  // ---------------------------------------------------------------------
  // Administrator Audit Logs (Doc 11 §22)
  // ---------------------------------------------------------------------

  async getUserDirectoryWithAuditCounts(search?: string) {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        OR: search
          ? [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: { role: true, _count: { select: { auditLogs: true } } },
      orderBy: { firstName: 'asc' },
    });

    return users;
  },

  async findByUserId(
    userId: string,
    filters: { page: number; limit: number; action?: string; startDate?: Date; endDate?: Date }
  ) {
    const where: Prisma.AuditLogWhereInput = {
      userId,
      action: filters.action,
      createdAt: {
        gte: filters.startDate,
        lte: filters.endDate,
      },
    };

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  },

  async findAllForAdmin(filters: AdminAllAuditQuery) {
    const where = buildAdminWhereClause(filters);

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        include: { user: { select: { firstName: true, lastName: true, email: true, role: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  },

  getDistinctActions() {
    return prisma.auditLog.findMany({
      distinct: ['action'],
      select: { action: true },
      orderBy: { action: 'asc' },
    });
  },
};