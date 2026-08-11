import { Paper, Typography, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { bank: string; count: number }[];
  loading?: boolean;
}

export function BankBreakdownChart({ data, loading }: Props) {
  return (
    <Paper elevation={0} className="p-5 rounded-card border border-gray-200 flex-1 min-w-75">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        Transactions by Bank
      </Typography>
      {loading ? (
        <Skeleton variant="rounded" width="100%" height={260} />
      ) : data.length === 0 ? (
        <div className="h-65 flex items-center justify-center text-cool-gray text-sm">
          No bank data available yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
            <XAxis dataKey="bank" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#540D6E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}