import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: dashboardService.getAdminSummary,
  });
}