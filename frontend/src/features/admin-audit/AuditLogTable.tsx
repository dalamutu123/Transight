import { Table, TableHead, TableBody, TableRow, TableCell, Chip, Paper, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { actionColor, actionLabel } from '@/features/audit/actionColor';
import type { AdminAuditLogItem, AdminAllAuditLogItem } from '@/services/adminAudit.service';

interface Props {
  logs: (AdminAuditLogItem | AdminAllAuditLogItem)[];
  loading?: boolean;
  showUser?: boolean;
}

function hasUser(log: AdminAuditLogItem | AdminAllAuditLogItem): log is AdminAllAuditLogItem {
  return 'user' in log;
}

export function AuditLogTable({ logs, loading, showUser }: Props) {
  if (loading) {
    return (
      <Paper elevation={0} className="p-4 rounded-card border border-gray-200">
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </div>
      </Paper>
    );
  }

  if (logs.length === 0) {
    return (
      <Paper elevation={0} className="p-8 rounded-card border border-gray-200 text-center">
        <p className="text-cool-gray text-sm">No audit log entries match your filters.</p>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className="rounded-card border border-gray-200 overflow-hidden">
      <Table size="small">
        <TableHead>
          <TableRow className="bg-slate-gray">
            <TableCell className="font-semibold">Action</TableCell>
            {showUser && <TableCell className="font-semibold">User</TableCell>}
            {showUser && <TableCell className="font-semibold">Role</TableCell>}
            <TableCell className="font-semibold">Description</TableCell>
            <TableCell className="font-semibold">IP Address</TableCell>
            <TableCell className="font-semibold">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} hover>
              <TableCell>
                <Chip
                  label={actionLabel[log.action] ?? log.action}
                  size="small"
                  color={actionColor[log.action] ?? 'default'}
                />
              </TableCell>
              {showUser && (
                <TableCell>
                  {hasUser(log) ? `${log.user.firstName} ${log.user.lastName}` : '—'}
                </TableCell>
              )}
              {showUser && (
                <TableCell>
                  {hasUser(log) ? <Chip label={log.user.role.name} size="small" variant="outlined" /> : '—'}
                </TableCell>
              )}
              <TableCell>{log.description ?? '—'}</TableCell>
              <TableCell>{log.ipAddress ?? '—'}</TableCell>
              <TableCell>{dayjs(log.createdAt).format('MMM D, YYYY · h:mm A')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}