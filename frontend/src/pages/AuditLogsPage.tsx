import { useState } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  Chip,
  Skeleton,
  Pagination as MuiPagination,
} from '@mui/material';
import dayjs from 'dayjs';
import { useAuditLogs } from '@/features/audit/useAuditLogs';
import { actionColor, actionLabel } from '@/features/audit/actionColor';

const ACTIONS = ['LOGIN', 'LOGIN_FAILED', 'UPLOAD_CSV', 'GENERATE_REPORT', 'CREATE_USER', 'UPDATE_USER'];

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');

  const { data, isLoading, isFetching, isError } = useAuditLogs({
    page,
    limit: 20,
    action: action || undefined,
  });

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

      <Paper elevation={0} className="p-4 rounded-card border border-gray-200">
        <TextField
          label="Filter by action"
          size="small"
          select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">All actions</MenuItem>
          {ACTIONS.map((a) => (
            <MenuItem key={a} value={a}>{actionLabel[a]}</MenuItem>
          ))}
        </TextField>
      </Paper>

      {isError ? (
        <div className="text-error text-sm">Could not load audit logs. Please try again.</div>
      ) : isLoading ? (
        <Paper elevation={0} className="p-4 rounded-card border border-gray-200">
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rounded" height={40} />
            ))}
          </div>
        </Paper>
      ) : !data || data.items.length === 0 ? (
        <Paper elevation={0} className="p-8 rounded-card border border-gray-200 text-center">
          <p className="text-cool-gray text-sm">No audit log entries match your filter.</p>
        </Paper>
      ) : (
        <>
          <div
            className="transition-opacity duration-200"
            style={{ opacity: isFetching && !isLoading ? 0.5 : 1 }}
          >
            <Paper elevation={0} className="rounded-card border border-gray-200 overflow-hidden">
              <Table size="small">
                <TableHead>
                  <TableRow className="bg-slate-gray">
                    <TableCell className="font-semibold">Action</TableCell>
                    <TableCell className="font-semibold">User</TableCell>
                    <TableCell className="font-semibold">Description</TableCell>
                    <TableCell className="font-semibold">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.items.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Chip
                          label={actionLabel[log.action] ?? log.action}
                          size="small"
                          color={actionColor[log.action] ?? 'default'}
                        />
                      </TableCell>
                      <TableCell>{log.user.firstName} {log.user.lastName}</TableCell>
                      <TableCell>{log.description ?? '—'}</TableCell>
                      <TableCell>{dayjs(log.createdAt).format('MMM D, YYYY · h:mm A')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <MuiPagination
                count={data.pagination.totalPages}
                page={data.pagination.page}
                onChange={(_, p) => setPage(p)}
                color="primary"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}