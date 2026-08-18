import { useState } from 'react';
import {
  Paper,
  Typography,
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
import { useQuery } from '@tanstack/react-query';
import { uploadsService } from '@/services/uploads.service';

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  Completed: 'success',
  Processing: 'warning',
  Failed: 'error',
};

interface Props {
  onSelectUpload: (id: string) => void;
}

export function GeneralUploadHistory({ onSelectUpload }: Props) {
  const [userId, setUserId] = useState('');
  const [page, setPage] = useState(1);

  const { data: uploaders = [] } = useQuery({
    queryKey: ['uploaders'],
    queryFn: () => uploadsService.getUploaders(),
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['general-upload-history', userId, page],
    queryFn: () => uploadsService.getHistory(page, 10, userId || undefined),
    placeholderData: (prev) => prev,
  });

  return (
    <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <div>
          <Typography variant="subtitle1" className="font-semibold">
            General Upload History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Files uploaded by all users
          </Typography>
        </div>
        <TextField
          label="Filter by user"
          size="small"
          select
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">All users</MenuItem>
          {uploaders.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="h-25 flex items-center justify-center text-cool-gray text-sm mt-4">
          No uploads found.
        </div>
      ) : (
        <>
          <div
            className="mt-4 transition-opacity duration-200"
            style={{ opacity: isFetching ? 0.5 : 1 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow className="bg-slate-gray">
                  <TableCell className="font-semibold">Filename</TableCell>
                  <TableCell className="font-semibold">Uploaded By</TableCell>
                  <TableCell className="font-semibold">Date</TableCell>
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell className="font-semibold">Accepted</TableCell>
                  <TableCell className="font-semibold">Rejected</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((upload) => (
                  <TableRow key={upload.id} hover className="cursor-pointer" onClick={() => onSelectUpload(upload.id)}>
                    <TableCell>{upload.filename}</TableCell>
                    <TableCell>
                      {upload.uploadedByUser.firstName} {upload.uploadedByUser.lastName}
                    </TableCell>
                    <TableCell>{dayjs(upload.createdAt).format('MMM D, YYYY · h:mm A')}</TableCell>
                    <TableCell>{upload.totalRecords}</TableCell>
                    <TableCell className="text-success">{upload.successfulRecords}</TableCell>
                    <TableCell className="text-error">{upload.rejectedRecords}</TableCell>
                    <TableCell>
                      <Chip label={upload.status} size="small" color={statusColor[upload.status] ?? 'default'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-4">
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
    </Paper>
  );
}