import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
      <LockOutlinedIcon sx={{ fontSize: 48, color: '#6B7280' }} />
      <Typography variant="h5" className="font-semibold text-charcoal">
        Access Denied
      </Typography>
      <Typography variant="body2" color="text.secondary" className="max-w-sm">
        You don't have permission to view this page. If you believe this is a mistake, contact an
        administrator.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')} className="mt-2">
        Back to Dashboard
      </Button>
    </div>
  );
}