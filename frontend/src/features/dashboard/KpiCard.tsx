import { Paper, Typography, Skeleton } from '@mui/material';

interface KpiCardProps {
  label: string;
  value: string;
  accentColor?: string;
  loading?: boolean;
}

export function KpiCard({ label, value, accentColor = '#540D6E', loading }: KpiCardProps) {
  return (
    <Paper elevation={0} className="p-5 rounded-card border border-gray-200 flex-1 min-w-45">
      <Typography variant="body2" color="text.secondary" className="mb-1">
        {label}
      </Typography>
      {loading ? (
        <Skeleton variant="text" width={100} height={40} />
      ) : (
        <Typography variant="h5" className="font-semibold" sx={{ color: accentColor }}>
          {value}
        </Typography>
      )}
    </Paper>
  );
}