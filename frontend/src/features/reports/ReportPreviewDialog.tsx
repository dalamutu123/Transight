import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { reportsService, type ReportPreviewResult } from '@/services/reports.service';

interface Props {
  open: boolean;
  onClose: () => void;
  reportId?: string | null;
  initialData?: ReportPreviewResult;
}

export function ReportPreviewDialog({ open, onClose, reportId, initialData }: Props) {
  const shouldFetch = open && !initialData && !!reportId;

  const { data: fetched, isLoading } = useQuery({
    queryKey: ['report-preview', reportId],
    queryFn: () => reportsService.getPreview(reportId!),
    enabled: shouldFetch,
  });

  const data = initialData ?? fetched;
  const columns = data && data.rows.length > 0 ? Object.keys(data.rows[0]) : [];

  const handleDownload = async () => {
    if (!data) return;
    await reportsService.download(data.report.id, data.report.fileName);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle className="flex items-start justify-between gap-4">
        <div>
          <Typography variant="h6">Report Preview</Typography>
          {data && (
            <Typography variant="body2" color="text.secondary">
              {data.report.fileName} · Generated {dayjs(data.report.createdAt).format('MMM D, YYYY · h:mm A')} by{' '}
              {data.report.generatedByUser.firstName} {data.report.generatedByUser.lastName}
            </Typography>
          )}
        </div>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="p-0">
        {isLoading || !data ? (
          <div className="p-6 flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rounded" height={36} />
            ))}
          </div>
        ) : !data.previewAvailable ? (
          <div className="p-6">
            <Alert severity="info">
              Preview isn't available for Excel reports. Download the file to view its contents.
            </Alert>
          </div>
        ) : data.rows.length === 0 ? (
          <div className="p-6 text-center text-cool-gray text-sm">This report contains no records.</div>
        ) : (
          <div className="overflow-auto max-h-125">
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col} className="font-semibold bg-slate-gray">
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.rows.map((row, i) => (
                  <TableRow key={i} hover>
                    {columns.map((col) => (
                      <TableCell key={col}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!data}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
}