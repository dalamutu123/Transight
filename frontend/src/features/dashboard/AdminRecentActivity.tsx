import { Paper, Typography, Chip, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { actionColor, actionLabel } from '@/features/audit/actionColor';

interface ActivityEntry {
  id: string;
  action: string;
  description: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
}

interface Props {
  title: string;
  entries: ActivityEntry[];
  loading?: boolean;
  emptyMessage: string;
}

export function AdminRecentActivity({ title, entries, loading, emptyMessage }: Props) {
  return (
    <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200 flex-1 min-w-75">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        {title}
      </Typography>
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={44} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="h-25 flex items-center justify-center text-cool-gray text-sm">{emptyMessage}</div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {entries.map((entry) => (
            <div key={entry.id} className="list-item-hover py-3 px-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Typography variant="body2" className="font-medium truncate">
                  {entry.user.firstName} {entry.user.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" className="truncate block">
                  {entry.description ?? actionLabel[entry.action] ?? entry.action} ·{' '}
                  {dayjs(entry.createdAt).format('MMM D, h:mm A')}
                </Typography>
              </div>
              <Chip
                label={actionLabel[entry.action] ?? entry.action}
                size="small"
                color={actionColor[entry.action] ?? 'default'}
              />
            </div>
          ))}
        </div>
      )}
    </Paper>
  );
}