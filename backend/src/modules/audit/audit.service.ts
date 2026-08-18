import { auditRepository } from './audit.repository';
import { buildPagination } from '@utils/apiResponse';
import type { AuditLogQuery, AdminUserAuditQuery, AdminAllAuditQuery } from './audit.validation';

interface RecordAuditInput {
  userId: string;
  action: string;
  description?: string;
  ipAddress?: string;
}

export const auditService = {
  record(input: RecordAuditInput) {
    return auditRepository.create({
      userId: input.userId,
      action: input.action,
      description: input.description,
      ipAddress: input.ipAddress,
    });
  },

  async list(query: AuditLogQuery) {
    const { page, limit, userId, action, startDate, endDate } = query;

    const { items, total } = await auditRepository.findMany({
      page,
      limit,
      userId,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return { items, pagination: buildPagination(page, limit, total) };
  },

  // ---------------------------------------------------------------------
  // Administrator Audit Logs (Doc 11 §22)
  // ---------------------------------------------------------------------

  async getAdminDirectory(search?: string) {
    const users = await auditRepository.getUserDirectoryWithAuditCounts(search);
    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role.name,
      isActive: u.isActive,
      auditCount: u._count.auditLogs,
    }));
  },

  async getUserAuditHistory(userId: string, query: AdminUserAuditQuery) {
    const { page, limit, action, startDate, endDate } = query;

    const { items, total } = await auditRepository.findByUserId(userId, {
      page,
      limit,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return { items, pagination: buildPagination(page, limit, total) };
  },

  async getAllForAdmin(filters: AdminAllAuditQuery) {
    const { items, total } = await auditRepository.findAllForAdmin(filters);
    return { items, pagination: buildPagination(filters.page, filters.limit, total) };
  },

  async getDistinctActions() {
    const rows = await auditRepository.getDistinctActions();
    return rows.map((r) => r.action);
  },
};