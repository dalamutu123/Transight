import { prisma } from '@config/db';
import { Prisma } from '../../../generated/prisma/client';
import type { AdminAllUploadsQuery } from './uploads.validation';

function buildAdminWhereClause(filters: AdminAllUploadsQuery): Prisma.UploadWhereInput {
  return {
    uploadedBy: filters.userId,
    uploadedByUser: filters.roleId ? { roleId: filters.roleId } : undefined,
    status: filters.status,
    filename: filters.filename ? { contains: filters.filename, mode: 'insensitive' } : undefined,
    createdAt: {
      gte: filters.startDate ? new Date(filters.startDate) : undefined,
      lte: filters.endDate ? new Date(filters.endDate) : undefined,
    },
  };
}

export const uploadsRepository = {
  createUpload(data: { filename: string; uploadedBy: string }) {
    return prisma.upload.create({ data });
  },

  updateUploadSummary(
    id: string,
    data: { totalRecords: number; successfulRecords: number; rejectedRecords: number; status: string }
  ) {
    return prisma.upload.update({ where: { id }, data });
  },

  async createTransactionsAndRejections(
    validTransactions: Prisma.TransactionUncheckedCreateInput[],
    rejectedRows: Prisma.RejectedTransactionUncheckedCreateInput[]
  ) {
    return prisma.$transaction(async (tx) => {
      if (validTransactions.length > 0) {
        await tx.transaction.createMany({ data: validTransactions, skipDuplicates: true });
      }
      if (rejectedRows.length > 0) {
        await tx.rejectedTransaction.createMany({ data: rejectedRows });
      }
    });
  },

  getAllBanks() {
    return prisma.bank.findMany();
  },

  getAllStatuses() {
    return prisma.transactionStatus.findMany();
  },

  findExistingReferences(candidateRefs: string[]) {
    return prisma.transaction.findMany({
      where: { reference: { in: candidateRefs } },
      select: { reference: true },
    });
  },

  async findHistory(page: number, limit: number, userId?: string) {
    const where: Prisma.UploadWhereInput = userId ? { uploadedBy: userId } : {};

    const [items, total] = await Promise.all([
      prisma.upload.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { uploadedByUser: { select: { firstName: true, lastName: true, email: true } } },
      }),
      prisma.upload.count({ where }),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return prisma.upload.findUnique({
      where: { id },
      include: { uploadedByUser: { select: { firstName: true, lastName: true, email: true } } },
    });
  },

  findRejectedByUploadId(uploadId: string) {
    return prisma.rejectedTransaction.findMany({
      where: { uploadId },
      orderBy: { rawRowNumber: 'asc' },
    });
  },

  // Distinct set of users who have uploaded at least one file — powers the
  // "filter by user" dropdown in General Upload History (not the full user
  // directory, which is admin-only).
  async getUploaders() {
    const uploads = await prisma.upload.findMany({
      distinct: ['uploadedBy'],
      select: { uploadedByUser: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return uploads.map((u) => u.uploadedByUser);
  },

  // ---------------------------------------------------------------------
  // Administrator Upload History (Doc 11 §21)
  // ---------------------------------------------------------------------

  async getUserDirectoryWithUploadCounts(search?: string) {
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
      include: { role: true, _count: { select: { uploads: true } } },
      orderBy: { firstName: 'asc' },
    });

    return users;
  },

  async findByUserId(userId: string, page: number, limit: number) {
    const where = { uploadedBy: userId };
    const [items, total] = await Promise.all([
      prisma.upload.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.upload.count({ where }),
    ]);
    return { items, total };
  },

  async findAllForAdmin(filters: AdminAllUploadsQuery) {
    const where = buildAdminWhereClause(filters);

    const [items, total] = await Promise.all([
      prisma.upload.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        include: { uploadedByUser: { select: { firstName: true, lastName: true, email: true, role: true } } },
      }),
      prisma.upload.count({ where }),
    ]);
    return { items, total };
  },
};