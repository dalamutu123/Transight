import { api } from './api';

export interface DashboardSummary {
  kpis: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    totalTransactionValue: number;
    successRate: number;
  };
  charts: {
    dailyVolume: { date: string; count: number; total: number }[];
    byBank: { bank: string; count: number }[];
    byResponseCode: { responseCode: string; count: number }[];
  };
  recentUploads: {
    id: string;
    filename: string;
    totalRecords: number;
    successfulRecords: number;
    rejectedRecords: number;
    status: string;
    createdAt: string;
    uploadedByUser: { firstName: string; lastName: string };
  }[];
}

export const dashboardService = {
  getSummary: () =>
    api.get<{ success: boolean; data: DashboardSummary }>('/dashboard').then((res) => res.data.data),
};