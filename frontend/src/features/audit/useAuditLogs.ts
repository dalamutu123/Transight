import { useQuery } from '@tanstack/react-query';
import { auditService, type AuditLogFilters } from '@/services/audit.service';

export function useAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => auditService.list(filters),
    placeholderData: (previousData) => previousData,
  });
}