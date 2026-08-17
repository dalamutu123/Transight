import { Table, TableHead, TableBody, TableRow, TableCell, Chip, Paper, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import type { AdminAllUploadItem } from '@/services/adminUploads.service';

interface Props {
  uploads: AdminAllUploadItem[];
  loading?: boolean;
}

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  Completed: 'success',
  Processing: 'warning',
  Failed: 'error',
};

export function AllUploadsTable({ uploads, loading }: Props) {
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

  if (uploads.length === 0) {
    return (
      <Paper elevation={0} className="p-8 rounded-card border border-gray-200 text-center">
        <p className="text-cool-gray text-sm">No uploads match your filters.</p>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className="rounded-card border border-gray-200 overflow-hidden">
      <Table size="small">
        <TableHead>
          <TableRow className="bg-slate-gray">
            <TableCell className="font-semibold">Filename</TableCell>
            <TableCell className="font-semibold">Uploaded By</TableCell>
            <TableCell className="font-semibold">Role</TableCell>
            <TableCell className="font-semibold">Total</TableCell>
            <TableCell className="font-semibold">Accepted</TableCell>
            <TableCell className="font-semibold">Rejected</TableCell>
            <TableCell className="font-semibold">Status</TableCell>
            <TableCell className="font-semibold">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {uploads.map((u) => (
            <TableRow key={u.id} hover>
              <TableCell>{u.filename}</TableCell>
              <TableCell>
                {u.uploadedByUser.firstName} {u.uploadedByUser.lastName}
              </TableCell>
              <TableCell>
                <Chip label={u.uploadedByUser.role.name} size="small" variant="outlined" />
              </TableCell>
              <TableCell>{u.totalRecords}</TableCell>
              <TableCell className="text-success">{u.successfulRecords}</TableCell>
              <TableCell className="text-error">{u.rejectedRecords}</TableCell>
              <TableCell>
                <Chip label={u.status} size="small" color={statusColor[u.status] ?? 'default'} />
              </TableCell>
              <TableCell>{dayjs(u.createdAt).format('MMM D, YYYY · h:mm A')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}