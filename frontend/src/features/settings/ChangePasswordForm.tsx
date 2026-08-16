import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Alert } from '@mui/material';
import { authService } from '@/services/auth.service';

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

interface Props {
  onSuccess: () => void;
  submitLabel?: string;
}

export function ChangePasswordForm({ onSuccess, submitLabel = 'Save New Password' }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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
      reset();
      onSuccess();
    } catch {
      setServerError('Could not change your password. Check your current password and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}