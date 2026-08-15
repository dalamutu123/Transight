import { Typography, Paper } from '@mui/material';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account and preferences
        </Typography>
      </div>
      <Paper elevation={0} className="p-8 rounded-card border border-gray-200 text-center">
        <p className="text-cool-gray text-sm">Settings page coming in a future step.</p>
      </Paper>
    </div>
  );
}