import { Paper, Typography, Chip, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import type { DashboardSummary } from '@/services/dashboard.service';

interface Props {
  uploads: DashboardSummary['recentUploads'];
  loading?: boolean;
}

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  Completed: 'success',
  Processing: 'warning',
  Failed: 'error',
};

export function RecentUploads({ uploads, loading }: Props) {
  return (
    <Paper elevation={0} className="p-5 rounded-card border border-gray-200 flex-1 min-w-[320px]">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        Recent Uploads
      </Typography>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" width="100%" height={48} />
          ))}
        </div>
      ) : uploads.length === 0 ? (
        <div className="h-30 flex items-center justify-center text-cool-gray text-sm">
          No uploads yet — files you upload will appear here
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {uploads.map((upload) => (
            <div key={upload.id} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Typography variant="body2" className="font-medium truncate">
                  {upload.filename}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {upload.uploadedByUser.firstName} {upload.uploadedByUser.lastName} ·{' '}
                  {dayjs(upload.createdAt).format('MMM D, h:mm A')} · {upload.successfulRecords}/
                  {upload.totalRecords} accepted
                </Typography>
              </div>
              <Chip
                label={upload.status}
                size="small"
                color={statusColor[upload.status] ?? 'default'}
                variant="outlined"
              />
            </div>
          ))}
        </div>
      )}
    </Paper>
  );
}