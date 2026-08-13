import { Paper, Typography, Chip, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import type { UploadResult } from '@/services/uploads.service';

export function UploadResultSummary({ result }: { result: UploadResult }) {
  return (
    <div className="flex flex-col gap-4">
      <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200">
        <Typography variant="subtitle1" className="font-semibold mb-3">
          Upload Summary — {result.upload.filename}
        </Typography>
        <div className="flex gap-6">
          <div>
            <Typography variant="caption" color="text.secondary">Total Records</Typography>
            <Typography variant="h6">{result.summary.totalRecords}</Typography>
          </div>
          <div>
            <Typography variant="caption" color="text.secondary">Accepted</Typography>
            <Typography variant="h6" className="text-success">{result.summary.successfulRecords}</Typography>
          </div>
          <div>
            <Typography variant="caption" color="text.secondary">Rejected</Typography>
            <Typography variant="h6" className="text-error">{result.summary.rejectedRecords}</Typography>
          </div>
        </div>
        <Chip
          label={result.upload.status}
          color={result.upload.status === 'Completed' ? 'success' : 'default'}
          size="small"
          className="mt-3"
        />
      </Paper>

      {result.rejected.length > 0 && (
        <Paper elevation={0} className=" card-hover p-5 rounded-card border border-gray-200">
          <Typography variant="subtitle1" className="font-semibold mb-3">
            Rejected Records
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold">Row</TableCell>
                <TableCell className="font-semibold">Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.rejected.map((r) => (
                <TableRow key={r.row}>
                  <TableCell>{r.row}</TableCell>
                  <TableCell>{r.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </div>
  );
}