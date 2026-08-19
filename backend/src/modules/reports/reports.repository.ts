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
    return prisma.report.create({
      data,
      include: { generatedByUser: { select: { firstName: true, lastName: true, email: true } } },
    });
  },

  findById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: { generatedByUser: { select: { firstName: true, lastName: true, email: true } } },
    });
  },

  async findHistory(page: number, limit: number, userId?: string) {
    const where: Prisma.ReportWhereInput = userId ? { generatedBy: userId } : {};

    const [items, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { generatedByUser: { select: { firstName: true, lastName: true, email: true } } },
      }),
      prisma.report.count({ where }),
    ]);
    return { items, total };
  },

  // Distinct set of users who have generated at least one report — powers the
  // "filter by user" dropdown for Report Viewer (Doc 11 §13).
  async getGenerators() {
    const reports = await prisma.report.findMany({
      distinct: ['generatedBy'],
      select: { generatedByUser: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reports.map((r) => r.generatedByUser);
  },
};