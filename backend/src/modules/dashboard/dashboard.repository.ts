import { prisma } from '@config/db';

export const dashboardRepository = {
  async getSummaryCounts() {
    const [total, byStatus, totalValue] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.groupBy({
        by: ['statusId'],
        _count: { _all: true },
      }),
      prisma.transaction.aggregate({ _sum: { amount: true } }),
    ]);

    return { total, byStatus, totalValue: totalValue._sum.amount ?? 0 };
  },

  getStatuses() {
    return prisma.transactionStatus.findMany();
  },

  getBanks() {
    return prisma.bank.findMany();
  },

  getDailyVolume(days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.$queryRaw<{ day: string; count: bigint; total: number }[]>`
      SELECT to_char(transaction_date, 'YYYY-MM-DD') as day,
             COUNT(*)::int as count,
             SUM(amount)::float as total
      FROM transactions
      WHERE transaction_date >= ${since}
      GROUP BY day
      ORDER BY day ASC;
    `;
  },

  getVolumeByBank() {
    return prisma.transaction.groupBy({
      by: ['bankId'],
      _count: { _all: true },
    });
  },

  getVolumeByResponseCode() {
    return prisma.transaction.groupBy({
      by: ['responseCode'],
      _count: { _all: true },
      orderBy: { _count: { responseCode: 'desc' } },
      take: 10,
    });
  },

  getRecentUploads(limit: number) {
    return prisma.upload.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { uploadedByUser: { select: { firstName: true, lastName: true } } },
    });
  },
};