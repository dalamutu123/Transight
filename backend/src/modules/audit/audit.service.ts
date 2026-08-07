import { auditRepository } from './audit.repository';
import { buildPagination } from '@utils/apiResponse';
import type { AuditLogQuery } from './audit.validation';

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
};