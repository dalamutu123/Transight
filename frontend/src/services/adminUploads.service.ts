import { api } from './api';

export interface AdminDirectoryUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  uploadCount: number;
}

export interface AdminUploadItem {
  id: string;
  filename: string;
  totalRecords: number;
  successfulRecords: number;
  rejectedRecords: number;
  status: string;
  createdAt: string;
}

export interface AdminAllUploadItem extends AdminUploadItem {
  uploadedByUser: {
    firstName: string;
    lastName: string;
    email: string;
    role: { id: string; name: string };
  };
}

export interface AdminAllUploadsFilters {
  page: number;
  limit: number;
  userId?: string;
  roleId?: string;
  status?: string;
  filename?: string;
  startDate?: string;
  endDate?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const adminUploadsService = {
  getDirectory: (search?: string) =>
    api
      .get<{ success: boolean; data: AdminDirectoryUser[] }>('/uploads/admin/directory', {
        params: { search: search || undefined },
      })
      .then((res) => res.data.data),

  getUserHistory: (userId: string, page: number, limit: number) =>
    api
      .get<{ success: boolean; data: AdminUploadItem[]; pagination: Pagination }>(
        `/uploads/admin/users/${userId}`,
        { params: { page, limit } }
      )
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),

  getAllUploads: (filters: AdminAllUploadsFilters) =>
    api
      .get<{ success: boolean; data: AdminAllUploadItem[]; pagination: Pagination }>('/uploads/admin/all', {
        params: filters,
      })
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),
};