import { useAuthStore } from '@/store/authStore';
import AdministratorDashboard from '@/pages/dashboards/AdministratorDashboard';
import OperationsDashboard from '@/pages/dashboards/OperationsDashboard';
import ReportViewerDashboard from '@/pages/dashboards/ReportViewerDashboard';

export default function DashboardPage() {
  const role = useAuthStore((s) => s.user?.role);

  if (role === 'Administrator') return <AdministratorDashboard />;
  if (role === 'Report Viewer') return <ReportViewerDashboard />;
  return <OperationsDashboard />;
}