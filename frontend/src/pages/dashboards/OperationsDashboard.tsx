import { Typography } from '@mui/material';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { KpiCard } from '@/features/dashboard/KpiCard';
import { DailyVolumeChart } from '@/features/dashboard/DailyVolumeChart';
import { BankBreakdownChart } from '@/features/dashboard/BankBreakdownChart';
import { ResponseCodeChart } from '@/features/dashboard/ResponseCodeChart';
import { RecentUploads } from '@/features/dashboard/RecentUploads';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(
    value
  );
}

export default function OperationsDashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isError) {
    return (
      <div className="text-error text-sm">
        Could not load dashboard data. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Operational overview of transaction activity
        </Typography>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Total Transactions" value={data?.kpis.totalTransactions.toLocaleString() ?? '—'} loading={isLoading} accentColor="#111344" />
        <KpiCard label="Successful" value={data?.kpis.successfulTransactions.toLocaleString() ?? '—'} loading={isLoading} accentColor="#22C55E" />
        <KpiCard label="Failed" value={data?.kpis.failedTransactions.toLocaleString() ?? '—'} loading={isLoading} accentColor="#EF4444" />
        <KpiCard label="Pending" value={data?.kpis.pendingTransactions.toLocaleString() ?? '—'} loading={isLoading} accentColor="#F59E0B" />
        <KpiCard label="Success Rate" value={data ? `${data.kpis.successRate}%` : '—'} loading={isLoading} accentColor="#3B82F6" />
        <KpiCard label="Total Value" value={data ? formatCurrency(data.kpis.totalTransactionValue) : '—'} loading={isLoading} accentColor="#540D6E" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <DailyVolumeChart data={data?.charts.dailyVolume ?? []} loading={isLoading} />
        <BankBreakdownChart data={data?.charts.byBank ?? []} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ResponseCodeChart data={data?.charts.byResponseCode ?? []} loading={isLoading} />
        <RecentUploads uploads={data?.recentUploads ?? []} loading={isLoading} />
      </div>
    </div>
  );
}