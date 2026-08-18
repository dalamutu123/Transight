import { Paper, Typography, Chip, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { uploadsService } from '@/services/uploads.service';

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  Completed: 'success',
  Processing: 'warning',
  Failed: 'error',
};

interface Props {
  onSelectUpload: (id: string) => void;
}

export function MyUploadsWidget({ onSelectUpload }: Props) {
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading } = useQuery({
    queryKey: ['my-uploads', userId],
    queryFn: () => uploadsService.getHistory(1, 10, userId),
    enabled: !!userId,
  });

  return (
    <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200">
      <Typography variant="subtitle1" className="font-semibold mb-1">
        My Uploads
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-4">
        Files you have personally uploaded
      </Typography>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={48} />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="h-25 flex items-center justify-center text-cool-gray text-sm">
          You haven't uploaded any files yet
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {data.items.map((upload) => (
            <div
              key={upload.id}
              className="list-item-hover py-3 px-2 flex items-center justify-between gap-3 cursor-pointer"
              onClick={() => onSelectUpload(upload.id)}
            >
              <div className="min-w-0">
                <Typography variant="body2" className="font-medium truncate">
                  {upload.filename}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dayjs(upload.createdAt).format('MMM D, YYYY · h:mm A')} · {upload.successfulRecords}/
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