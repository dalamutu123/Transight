import { Paper, Typography, Chip, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports.service';

export function ReportHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['reports-history'],
    queryFn: () => reportsService.getHistory(1, 10),
  });

  return (
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
      ) : !data || data.items.length === 0 ? (
        <div className="h-25 flex items-center justify-center text-cool-gray text-sm">
          No reports generated yet
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {data.items.map((report) => (
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
  );
}