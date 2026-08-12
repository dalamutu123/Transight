import { Typography, Paper, Avatar, Chip } from '@mui/material';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your account information
        </Typography>
      </div>

      <Paper elevation={0} className="p-6 rounded-card border border-gray-200 flex flex-col items-center gap-3">
        <Avatar sx={{ bgcolor: '#540D6E', width: 72, height: 72, fontSize: 24 }}>{initials}</Avatar>
        <Typography variant="h6" className="font-semibold">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
        <Chip label={user.role} color="primary" size="small" />
      </Paper>
    </div>
  );
}