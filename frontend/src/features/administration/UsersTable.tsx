import { Table, TableHead, TableBody, TableRow, TableCell, Chip, Switch, Paper, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import type { UserItem } from '@/services/users.service';

interface Props {
  users: UserItem[];
  loading?: boolean;
  onToggleActive: (user: UserItem) => void;
}

export function UsersTable({ users, loading, onToggleActive }: Props) {
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
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}