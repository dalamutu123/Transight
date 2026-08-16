import { Typography, Paper, Avatar, Chip, Divider } from '@mui/material';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { ChangePasswordForm } from '@/features/settings/ChangePasswordForm';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account and personal preferences
        </Typography>
      </div>

      <Paper elevation={0} className="card-hover p-6 rounded-card border border-gray-200">
        <Typography variant="subtitle1" className="font-semibold mb-4">
          Profile
        </Typography>
        <div className="flex items-center gap-4">
          <Avatar sx={{ bgcolor: '#540D6E', width: 56, height: 56, fontSize: 20 }}>{initials}</Avatar>
          <div>
            <Typography variant="body1" className="font-medium">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Chip label={user.role} color="primary" size="small" className="mt-1" />
          </div>
        </div>
      </Paper>

      <Paper elevation={0} className="card-hover p-6 rounded-card border border-gray-200">
        <Typography variant="subtitle1" className="font-semibold mb-1">
          Change Password
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          Update the password used to sign in to Transight.
        </Typography>
        <ChangePasswordForm onSuccess={() => toast.success('Password changed successfully')} />
      </Paper>

      <Paper elevation={0} className="p-6 rounded-card border border-gray-200 border-dashed">
        <Divider className="mb-4" />
        <Typography variant="body2" color="text.secondary" className="text-center">
          Additional personal preferences will be available here in a future release.
        </Typography>
      </Paper>
    </div>
  );
}