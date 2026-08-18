import { api } from './api';

export interface AdminAuditDirectoryUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  auditCount: number;
}

export interface AdminAuditLogItem {
  id: string;
  action: string;
  description: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface AdminAllAuditLogItem extends AdminAuditLogItem {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: { id: string; name: string };
  };
}

export interface AdminUserAuditFilters {
  page: number;
  limit: number;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdminAllAuditFilters {
  page: number;
  limit: number;
  userId?: string;
  roleId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const adminAuditService = {
  getDirectory: (search?: string) =>
    api
      .get<{ success: boolean; data: AdminAuditDirectoryUser[] }>('/audit-logs/admin/directory', {
        params: { search: search || undefined },
      })
      .then((res) => res.data.data),

  getActions: () =>
    api.get<{ success: boolean; data: string[] }>('/audit-logs/admin/actions').then((res) => res.data.data),

  getUserHistory: (userId: string, filters: AdminUserAuditFilters) =>
    api
      .get<{ success: boolean; data: AdminAuditLogItem[]; pagination: Pagination }>(
        `/audit-logs/admin/users/${userId}`,
        { params: filters }
      )
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),

  getAllLogs: (filters: AdminAllAuditFilters) =>
    api
      .get<{ success: boolean; data: AdminAllAuditLogItem[]; pagination: Pagination }>('/audit-logs/admin/all', {
        params: filters,
      })
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),
};