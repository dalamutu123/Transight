import { api } from './api';

export interface UploadSummary {
  totalRecords: number;
  successfulRecords: number;
  rejectedRecords: number;
}

export interface RejectedRow {
  row: number;
  reason: string;
}

export interface UploadResult {
  upload: {
    id: string;
    filename: string;
    status: string;
    createdAt: string;
  };
  summary: UploadSummary;
  rejected: RejectedRow[];
}

export interface UploadHistoryItem {
  id: string;
  filename: string;
  totalRecords: number;
  successfulRecords: number;
  rejectedRecords: number;
  status: string;
  createdAt: string;
  uploadedByUser: { firstName: string; lastName: string; email: string };
}

export const uploadsService = {
  uploadCsv: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post<{ success: boolean; data: UploadResult }>('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data.data);
  },

  getHistory: (page: number, limit: number) =>
    api
      .get<{ success: boolean; data: UploadHistoryItem[]; pagination: { totalPages: number; page: number } }>(
        '/uploads',
        { params: { page, limit } }
      )
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),
};