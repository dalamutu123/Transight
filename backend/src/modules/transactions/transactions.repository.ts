import { prisma } from '@config/db';
import { Prisma } from '../../../generated/prisma/client';
import type { TransactionSearchQuery } from './transactions.validation';

function buildWhereClause(filters: TransactionSearchQuery): Prisma.TransactionWhereInput {
  return {
    reference: filters.reference ? { contains: filters.reference, mode: 'insensitive' } : undefined,
    responseCode: filters.responseCode,
    transactionType: filters.transactionType,
    status: filters.status ? { name: filters.status } : undefined,
    bank: filters.bankCode ? { code: filters.bankCode } : undefined,
    transactionDate: {
      gte: filters.startDate ? new Date(filters.startDate) : undefined,
      lte: filters.endDate ? new Date(filters.endDate) : undefined,
    },
    amount: {
      gte: filters.minAmount,
      lte: filters.maxAmount,
    },
  };
}

export const transactionsRepository = {
  async search(filters: TransactionSearchQuery) {
    const where = buildWhereClause(filters);

    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { bank: true, status: true },
        orderBy: { [filters.sortBy]: filters.sortOrder },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: { bank: true, status: true, upload: true },
    });
  },
};