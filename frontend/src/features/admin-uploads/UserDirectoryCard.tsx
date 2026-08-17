import { Paper, Typography, Chip, Button, Avatar } from '@mui/material';
import type { AdminDirectoryUser } from '@/services/adminUploads.service';

interface Props {
  user: AdminDirectoryUser;
  onView: (user: AdminDirectoryUser) => void;
}

export function UserDirectoryCard({ user, onView }: Props) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar sx={{ bgcolor: '#540D6E', width: 44, height: 44, fontSize: 15 }}>{initials}</Avatar>
        <div className="min-w-0">
          <Typography variant="body1" className="font-medium truncate">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary" className="truncate block">
            {user.email}
          </Typography>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Chip label={user.role} size="small" variant="outlined" />
        {!user.isActive && <Chip label="Disabled" size="small" color="error" variant="outlined" />}
      </div>

      <Typography variant="body2" color="text.secondary">
        {user.uploadCount} {user.uploadCount === 1 ? 'upload' : 'uploads'}
      </Typography>

      <Button variant="outlined" color="primary" size="small" onClick={() => onView(user)}>
        View Uploads
      </Button>
    </Paper>
  );
}