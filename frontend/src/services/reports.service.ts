import { api } from './api';

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  bankCode?: string;
  responseCode?: string;
}

export interface ReportMeta {
  id: string;
  type: string;
  format: string;
  filters: ReportFilters;
  fileName: string;
  createdAt: string;
  generatedByUser: { firstName: string; lastName: string; email: string };
}

export type ReportHistoryItem = ReportMeta;

export interface ReportPreviewResult {
  report: ReportMeta;
  rows: Record<string, string>[];
  previewAvailable: boolean;
}

export type ReportGenerateResult = ReportPreviewResult;

export interface Generator {
  id: string;
  firstName: string;
  lastName: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const reportsService = {
  generate: (format: 'CSV' | 'EXCEL', filters: ReportFilters) =>
    api
      .post<{ success: boolean; data: ReportGenerateResult }>('/reports', { format, filters })
      .then((res) => res.data.data),

  getPreview: (id: string) =>
    api
      .get<{ success: boolean; data: ReportPreviewResult }>(`/reports/${id}/preview`)
      .then((res) => res.data.data),

  download: async (id: string, filename: string) => {
    const response = await api.get(`/reports/${id}/download`, { responseType: 'blob' });
    triggerBrowserDownload(new Blob([response.data]), filename);
  },

  getHistory: (page: number, limit: number, userId?: string) =>
    api
      .get<{ success: boolean; data: ReportHistoryItem[]; pagination: Pagination }>('/reports', {
        params: { page, limit, userId: userId || undefined },
      })
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),

  getGenerators: () =>
    api.get<{ success: boolean; data: Generator[] }>('/reports/generators').then((res) => res.data.data),
};