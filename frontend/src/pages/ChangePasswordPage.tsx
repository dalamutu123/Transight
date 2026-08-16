import { useNavigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { ChangePasswordForm } from '@/features/settings/ChangePasswordForm';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const clearMustChangePassword = useAuthStore((s) => s.clearMustChangePassword);
  const isForced = useAuthStore((s) => s.user?.mustChangePassword ?? false);

  const handleSuccess = () => {
    clearMustChangePassword();
    toast.success('Password changed successfully');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-gray flex items-center justify-center px-6">
      <Paper elevation={0} className="p-8 rounded-card border border-gray-200 w-full max-w-md">
        <Typography variant="h5" color="secondary" className="font-semibold mb-1">
          {isForced ? 'Set a new password' : 'Change your password'}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-6">
          {isForced
            ? 'This is a temporary password. You must set a permanent password before continuing.'
            : 'Update the password used to sign in to Transight.'}
        </Typography>

        <ChangePasswordForm onSuccess={handleSuccess} />
      </Paper>
    </div>
  );
}