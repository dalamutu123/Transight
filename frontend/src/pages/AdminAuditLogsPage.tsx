import { useState } from 'react';
import { Typography, TextField, Tabs, Tab, Button, MenuItem, Pagination as MuiPagination } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackOutlined';
import { useQuery } from '@tanstack/react-query';
import {
  adminAuditService,
  type AdminAuditDirectoryUser,
  type AdminAllAuditFilters,
} from '@/services/adminAudit.service';
import { usersService } from '@/services/users.service';
import { AuditDirectoryCard } from '@/features/admin-audit/AuditDirectoryCard';
import { AuditLogTable } from '@/features/admin-audit/AuditLogTable';
import { AllAuditFilters } from '@/features/admin-audit/AllAuditFilters';
import { actionLabel } from '@/features/audit/actionColor';

type View = 'directory' | 'user' | 'all';

export default function AdminAuditLogsPage() {
  const [view, setView] = useState<View>('directory');
  const [selectedUser, setSelectedUser] = useState<AdminAuditDirectoryUser | null>(null);
  const [search, setSearch] = useState('');
  const [userAction, setUserAction] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [allFilters, setAllFilters] = useState<Partial<AdminAllAuditFilters>>({});
  const [allPage, setAllPage] = useState(1);

  const { data: directory, isLoading: directoryLoading } = useQuery({
    queryKey: ['admin-audit-directory', search],
    queryFn: () => adminAuditService.getDirectory(search),
    enabled: view === 'directory',
  });

  const { data: actions = [] } = useQuery({
    queryKey: ['admin-audit-actions'],
    queryFn: () => adminAuditService.getActions(),
  });

  const { data: userHistory, isLoading: userHistoryLoading } = useQuery({
    queryKey: ['admin-user-audit', selectedUser?.id, userPage, userAction],
    queryFn: () =>
      adminAuditService.getUserHistory(selectedUser!.id, {
        page: userPage,
        limit: 20,
        action: userAction || undefined,
      }),
    enabled: view === 'user' && !!selectedUser,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => usersService.getRoles(),
  });

  const { data: allLogs, isLoading: allLogsLoading } = useQuery({
    queryKey: ['admin-all-audit', allFilters, allPage],
    queryFn: () => adminAuditService.getAllLogs({ page: allPage, limit: 20, ...allFilters }),
    enabled: view === 'all',
  });

  const handleViewUser = (user: AdminAuditDirectoryUser) => {
    setSelectedUser(user);
    setUserPage(1);
    setUserAction('');
    setView('user');
  };

  const handleBackToDirectory = () => {
    setSelectedUser(null);
    setView('directory');
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Audit Logs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          System activity trail — logins, uploads, reports, and administrative actions
        </Typography>
      </div>

      {view !== 'user' && (
        <Tabs value={view} onChange={(_, val) => setView(val)} textColor="primary" indicatorColor="primary">
          <Tab label="Users" value="directory" />
          <Tab label="All Activity" value="all" />
        </Tabs>
      )}

      {view === 'directory' && (
        <>
          <TextField
            label="Search users"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ maxWidth: 320 }}
          />
          {directoryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-card bg-white border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : !directory || directory.length === 0 ? (
            <div className="text-center py-12 text-cool-gray text-sm">No users found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {directory.map((user) => (
                <AuditDirectoryCard key={user.id} user={user} onView={handleViewUser} />
              ))}
            </div>
          )}
        </>
      )}

      {view === 'user' && selectedUser && (
        <>
          <div className="flex items-center gap-3">
            <Button startIcon={<ArrowBackIcon />} onClick={handleBackToDirectory} size="small">
              Back to Audit Logs
            </Button>
          </div>
          <div>
            <Typography variant="subtitle1" className="font-semibold">
              {selectedUser.firstName} {selectedUser.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedUser.role} · {selectedUser.email}
            </Typography>
          </div>

          <TextField
            label="Filter by action"
            size="small"
            select
            value={userAction}
            onChange={(e) => {
              setUserAction(e.target.value);
              setUserPage(1);
            }}
            sx={{ maxWidth: 260 }}
          >
            <MenuItem value="">All actions</MenuItem>
            {actions.map((a) => (
              <MenuItem key={a} value={a}>
                {actionLabel[a] ?? a}
              </MenuItem>
            ))}
          </TextField>

          <AuditLogTable logs={userHistory?.items ?? []} loading={userHistoryLoading} />

          {userHistory && userHistory.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <MuiPagination
                count={userHistory.pagination.totalPages}
                page={userHistory.pagination.page}
                onChange={(_, p) => setUserPage(p)}
                color="primary"
              />
            </div>
          )}
        </>
      )}

      {view === 'all' && (
        <>
          <AllAuditFilters
            roles={roles}
            actions={actions}
            onApply={(filters) => {
              setAllFilters(filters);
              setAllPage(1);
            }}
          />
          <AuditLogTable logs={allLogs?.items ?? []} loading={allLogsLoading} showUser />
          {allLogs && allLogs.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <MuiPagination
                count={allLogs.pagination.totalPages}
                page={allLogs.pagination.page}
                onChange={(_, p) => setAllPage(p)}
                color="primary"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}