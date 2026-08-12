import { api } from './api';

export interface AuditLogEntry {
  id: string;
  action: string;
  description: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
}

export interface AuditLogFilters {
  page: number;
  limit: number;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export const auditService = {
  list: (filters: AuditLogFilters) =>
    api
      .get<{ success: boolean; data: AuditLogEntry[]; pagination: { totalPages: number; page: number } }>(
        '/audit-logs',
        { params: filters }
      )
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),
};