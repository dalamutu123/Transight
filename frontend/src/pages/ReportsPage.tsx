import { useAuthStore } from '@/store/authStore';
import OperationsReportsPage from '@/pages/reports/OperationsReportsPage';
import ReportViewerReportsPage from '@/pages/reports/ReportViewerReportsPage';

export default function ReportsPage() {
  const role = useAuthStore((s) => s.user?.role);

  if (role === 'Report Viewer') return <ReportViewerReportsPage />;
  return <OperationsReportsPage />;
}