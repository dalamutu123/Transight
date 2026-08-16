import { Paper, Typography, Skeleton } from '@mui/material';

interface Props {
  data: { role: string; count: number }[];
  loading?: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  Administrator: '#540D6E',
  'Operations User': '#3B82F6',
  'Report Viewer': '#22C55E',
};

export function AdminUserRoleBreakdown({ data, loading }: Props) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200 flex-1 min-w-75">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        Users by Role
      </Typography>
      {loading ? (
        <Skeleton variant="rounded" width="100%" height={140} />
      ) : data.length === 0 ? (
        <div className="h-35 flex items-center justify-center text-cool-gray text-sm">
          No users found
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((d) => {
            const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
            return (
              <div key={d.role}>
                <div className="flex justify-between mb-1">
                  <Typography variant="body2">{d.role}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {d.count} ({pct}%)
                  </Typography>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-gray overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: ROLE_COLORS[d.role] ?? '#6B7280' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Paper>
  );
}