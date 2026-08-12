import { api } from './api';

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  bankCode?: string;
  responseCode?: string;
}

export interface ReportHistoryItem {
  id: string;
  type: string;
  format: string;
  filters: ReportFilters;
  createdAt: string;
  generatedByUser: { firstName: string; lastName: string; email: string };
}

export const reportsService = {
  generate: async (format: 'CSV' | 'EXCEL', filters: ReportFilters) => {
    const response = await api.post(
      '/reports',
      { format, filters },
      { responseType: 'blob' }
    );

    // Trigger a browser download from the returned file blob
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transight-report.${format === 'CSV' ? 'csv' : 'xlsx'}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  getHistory: (page: number, limit: number) =>
    api
      .get<{ success: boolean; data: ReportHistoryItem[]; pagination: { totalPages: number; page: number } }>(
        '/reports',
        { params: { page, limit } }
      )
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),
};