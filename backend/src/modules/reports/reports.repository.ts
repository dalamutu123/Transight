import { prisma } from '@config/db';
import { Prisma } from '../../../generated/prisma/client';

export const reportsRepository = {
  findTransactionsForReport(filters: {
    startDate?: string;
    endDate?: string;
    status?: string;
    bankCode?: string;
    responseCode?: string;
  }) {
    const where: Prisma.TransactionWhereInput = {
      status: filters.status ? { name: filters.status } : undefined,
      bank: filters.bankCode ? { code: filters.bankCode } : undefined,
      responseCode: filters.responseCode,
      transactionDate: {
        gte: filters.startDate ? new Date(filters.startDate) : undefined,
        lte: filters.endDate ? new Date(filters.endDate) : undefined,
      },
    };

    return prisma.transaction.findMany({
      where,
      include: { bank: true, status: true },
      orderBy: { transactionDate: 'desc' },
    });
  },

  createReportRecord(data: Prisma.ReportUncheckedCreateInput) {
    return prisma.report.create({ data });
  },

  async findHistory(page: number, limit: number) {
    const [items, total] = await Promise.all([
      prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { generatedByUser: { select: { firstName: true, lastName: true, email: true } } },
      }),
      prisma.report.count(),
    ]);
    return { items, total };
  },
};