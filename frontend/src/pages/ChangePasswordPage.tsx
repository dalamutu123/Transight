import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const clearMustChangePassword = useAuthStore((s) => s.clearMustChangePassword);
  const isForced = useAuthStore((s) => s.user?.mustChangePassword ?? false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      clearMustChangePassword();
      toast.success('Password changed successfully');
      navigate('/dashboard');
    } catch {
      setServerError('Could not change your password. Check your current password and try again.');
    } finally {
      setIsSubmitting(false);
    }
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && <Alert severity="error">{serverError}</Alert>}

          <TextField
            label="Current Password"
            type="password"
            fullWidth
            {...register('currentPassword')}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            {...register('newPassword')}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Saving...' : 'Save New Password'}
          </Button>
        </form>
      </Paper>
    </div>
  );
}