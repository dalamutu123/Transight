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

export interface AdminDashboardSummary {
  kpis: {
    totalUsers: number;
    activeUsers: number;
    disabledUsers: number;
    totalUploads: number;
  };
  usersByRole: { role: string; count: number }[];
  recentAuditActivity: {
    id: string;
    action: string;
    description: string | null;
    createdAt: string;
    user: { firstName: string; lastName: string; email: string };
  }[];
  recentFailedLogins: {
    id: string;
    action: string;
    description: string | null;
    createdAt: string;
    user: { firstName: string; lastName: string; email: string };
  }[];
  recentUploads: DashboardSummary['recentUploads'];
}

export interface ReportViewerDashboardSummary {
  kpis: {
    totalReports: number;
    reportsLast30Days: number;
  };
  byFormat: { format: string; count: number }[];
  recentReports: {
    id: string;
    type: string;
    format: string;
    createdAt: string;
    generatedByUser: { firstName: string; lastName: string };
  }[];
}

export const dashboardService = {
  getSummary: () =>
    api.get<{ success: boolean; data: DashboardSummary }>('/dashboard').then((res) => res.data.data),

  getAdminSummary: () =>
    api
      .get<{ success: boolean; data: AdminDashboardSummary }>('/dashboard/admin')
      .then((res) => res.data.data),

  getReportViewerSummary: () =>
    api
      .get<{ success: boolean; data: ReportViewerDashboardSummary }>('/dashboard/report-viewer')
      .then((res) => res.data.data),
};