import { Typography, Paper } from '@mui/material';

export default function AdminUploadHistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Upload History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Investigate uploaded file activity across all users
        </Typography>
      </div>
      <Paper elevation={0} className="p-8 rounded-card border border-gray-200 text-center">
        <p className="text-cool-gray text-sm">Admin upload history coming in a future step.</p>
      </Paper>
    </div>
  );
}