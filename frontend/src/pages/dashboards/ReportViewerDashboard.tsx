import { Typography, Paper, Chip, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useReportViewerDashboard } from '@/features/dashboard/useReportViewerDashboard';
import { KpiCard } from '@/features/dashboard/KpiCard';

export default function ReportViewerDashboard() {
  const { data, isLoading, isError } = useReportViewerDashboard();
  const navigate = useNavigate();

  if (isError) {
    return (
      <div className="text-error text-sm">
        Could not load the dashboard. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Reports Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of available operational reports
        </Typography>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <KpiCard label="Total Reports" value={data?.kpis.totalReports.toLocaleString() ?? '—'} loading={isLoading} accentColor="#111344" />
        <KpiCard label="Reports (Last 30 Days)" value={data?.kpis.reportsLast30Days.toLocaleString() ?? '—'} loading={isLoading} accentColor="#540D6E" />
        <div className="flex items-center">
          <Button variant="contained" color="primary" onClick={() => navigate('/reports')}>
            View All Reports
          </Button>
        </div>
      </div>

      <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200">
        <Typography variant="subtitle1" className="font-semibold mb-4">
          Recent Reports
        </Typography>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={48} />
            ))}
          </div>
        ) : !data || data.recentReports.length === 0 ? (
          <div className="h-25 flex items-center justify-center text-cool-gray text-sm">
            No reports have been generated yet
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {data.recentReports.map((report) => (
              <div key={report.id} className="list-item-hover py-3 px-2 flex items-center justify-between gap-3">
                <div>
                  <Typography variant="body2" className="font-medium">
                    {report.type.replace(/-/g, ' ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {report.generatedByUser.firstName} {report.generatedByUser.lastName} ·{' '}
                    {dayjs(report.createdAt).format('MMM D, h:mm A')}
                  </Typography>
                </div>
                <Chip label={report.format} size="small" variant="outlined" />
              </div>
            ))}
          </div>
        )}
      </Paper>
    </div>
  );
}