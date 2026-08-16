import { Typography } from '@mui/material';
import { useAdminDashboard } from '@/features/dashboard/useAdminDashboard';
import { KpiCard } from '@/features/dashboard/KpiCard';
import { AdminUserRoleBreakdown } from '@/features/dashboard/AdminUserRoleBreakdown';
import { AdminRecentActivity } from '@/features/dashboard/AdminRecentActivity';
import { AdminQuickActions } from '@/features/dashboard/AdminQuickActions';
import { RecentUploads } from '@/features/dashboard/RecentUploads';

export default function AdministratorDashboard() {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isError) {
    return (
      <div className="text-error text-sm">
        Could not load the administrator dashboard. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Administrator Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Platform oversight — users, uploads, and system activity
        </Typography>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Total Users" value={data?.kpis.totalUsers.toLocaleString() ?? '—'} loading={isLoading} accentColor="#111344" />
        <KpiCard label="Active Users" value={data?.kpis.activeUsers.toLocaleString() ?? '—'} loading={isLoading} accentColor="#22C55E" />
        <KpiCard label="Disabled Users" value={data?.kpis.disabledUsers.toLocaleString() ?? '—'} loading={isLoading} accentColor="#EF4444" />
        <KpiCard label="Total Uploads" value={data?.kpis.totalUploads.toLocaleString() ?? '—'} loading={isLoading} accentColor="#540D6E" />
      </div>

      <AdminQuickActions />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AdminUserRoleBreakdown data={data?.usersByRole ?? []} loading={isLoading} />
        <RecentUploads uploads={data?.recentUploads ?? []} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AdminRecentActivity
          title="Recent Audit Activity"
          entries={data?.recentAuditActivity ?? []}
          loading={isLoading}
          emptyMessage="No recent activity recorded"
        />
        <AdminRecentActivity
          title="Recent Failed Logins"
          entries={data?.recentFailedLogins ?? []}
          loading={isLoading}
          emptyMessage="No failed login attempts recorded"
        />
      </div>
    </div>
  );
}