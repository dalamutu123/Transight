import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Switch,
  Paper,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import dayjs from 'dayjs';
import type { UserItem } from '@/services/users.service';
import { useAuthStore } from '@/store/authStore';

interface Props {
  users: UserItem[];
  loading?: boolean;
  onToggleActive: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
}

export function UsersTable({ users, loading, onToggleActive, onDelete }: Props) {
  const currentUserEmail = useAuthStore((s) => s.user?.email);

  if (loading) {
    return (
      <Paper elevation={0} className="p-4 rounded-card border border-gray-200">
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={40} />
          ))}
        </div>
      </Paper>
    );
  }

  if (users.length === 0) {
    return (
      <Paper elevation={0} className="p-8 rounded-card border border-gray-200 text-center">
        <p className="text-cool-gray text-sm">No users found.</p>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className="rounded-card border border-gray-200 overflow-hidden">
      <Table size="small">
        <TableHead>
          <TableRow className="bg-slate-gray">
            <TableCell className="font-semibold">Name</TableCell>
            <TableCell className="font-semibold">Email</TableCell>
            <TableCell className="font-semibold">Role</TableCell>
            <TableCell className="font-semibold">Created</TableCell>
            <TableCell className="font-semibold">Active</TableCell>
            <TableCell className="font-semibold" align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.email === currentUserEmail;
            return (
              <TableRow key={user.id} hover>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={user.role} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{dayjs(user.createdAt).format('MMM D, YYYY')}</TableCell>
                <TableCell>
                  <Switch checked={user.isActive} onChange={() => onToggleActive(user)} color="primary" size="small" />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={isSelf ? "You can't delete your own account" : 'Delete user'}>
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={isSelf}
                        onClick={() => onDelete(user)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}