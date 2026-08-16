import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export function useReportViewerDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'report-viewer'],
    queryFn: dashboardService.getReportViewerSummary,
  });
}