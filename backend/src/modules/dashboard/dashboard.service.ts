import { dashboardRepository } from './dashboard.repository';

export const dashboardService = {
  async getSummary() {
    const [{ total, byStatus, totalValue }, statuses, banks, dailyVolume, byBank, byResponseCode, recentUploads] =
      await Promise.all([
        dashboardRepository.getSummaryCounts(),
        dashboardRepository.getStatuses(),
        dashboardRepository.getBanks(),
        dashboardRepository.getDailyVolume(30),
        dashboardRepository.getVolumeByBank(),
        dashboardRepository.getVolumeByResponseCode(),
        dashboardRepository.getRecentUploads(5),
      ]);

    const statusMap = new Map(statuses.map((s) => [s.id, s.name]));
    const bankMap = new Map(banks.map((b) => [b.id, b.code]));

    const countByStatusName = (name: string) =>
      byStatus.find((s) => statusMap.get(s.statusId) === name)?._count._all ?? 0;

    const successful = countByStatusName('Successful');
    const failed = countByStatusName('Failed');
    const pending = countByStatusName('Pending');

    return {
      kpis: {
        totalTransactions: total,
        successfulTransactions: successful,
        failedTransactions: failed,
        pendingTransactions: pending,
        totalTransactionValue: totalValue,
        successRate: total > 0 ? Number(((successful / total) * 100).toFixed(2)) : 0,
      },
      charts: {
        dailyVolume: dailyVolume.map((d) => ({ date: d.day, count: Number(d.count), total: d.total })),
        byBank: byBank.map((b) => ({ bank: bankMap.get(b.bankId) ?? 'Unknown', count: b._count._all })),
        byResponseCode: byResponseCode.map((r) => ({
          responseCode: r.responseCode,
          count: r._count._all,
        })),
      },
      recentUploads,
    };
  },
};