import { prisma } from '@config/db';
import { Prisma } from '../../../generated/prisma/client';

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

  async findHistory(page: number, limit: number) {
    const [items, total] = await Promise.all([
      prisma.upload.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { uploadedByUser: { select: { firstName: true, lastName: true, email: true } } },
      }),
      prisma.upload.count(),
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
};