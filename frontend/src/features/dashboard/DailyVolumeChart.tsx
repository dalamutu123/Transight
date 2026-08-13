import { Paper, Typography, Skeleton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

interface Props {
  data: { date: string; count: number; total: number }[];
  loading?: boolean;
}

export function DailyVolumeChart({ data, loading }: Props) {
  return (
    <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200 flex-1 min-w-100">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        Daily Transaction Volume (30 days)
      </Typography>
      {loading ? (
        <Skeleton variant="rounded" width="100%" height={260} />
      ) : data.length === 0 ? (
        <div className="h-65 flex items-center justify-center text-cool-gray text-sm">
          No transaction data available yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => dayjs(d).format('MMM D')}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip labelFormatter={(d) => dayjs(d as string).format('MMM D, YYYY')} />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}