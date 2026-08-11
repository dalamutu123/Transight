import { Paper, Typography, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  data: { responseCode: string; count: number }[];
  loading?: boolean;
}

// Teal-leaning palette per brand doc's "Response Codes – Teal" chart guidance,
// with enough variety to distinguish multiple slices.
const COLORS = ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#0F766E', '#134E4A'];

export function ResponseCodeChart({ data, loading }: Props) {
  return (
    <Paper elevation={0} className="p-5 rounded-card border border-gray-200 flex-1 min-w-75">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        Transactions by Response Code
      </Typography>
      {loading ? (
        <Skeleton variant="rounded" width="100%" height={260} />
      ) : data.length === 0 ? (
        <div className="h-65 flex items-center justify-center text-cool-gray text-sm">
          No response code data available yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="responseCode" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}