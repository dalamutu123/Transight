import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert } from '@mui/material';
import type { UserItem } from '@/services/users.service';

interface Props {
  user: UserItem | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserDialog({ user, isDeleting, onClose, onConfirm }: Props) {
  return (
    <Dialog open={!!user} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent className="flex flex-col gap-3">
        <Typography variant="body2">
          Are you sure you want to delete <strong>{user?.firstName} {user?.lastName}</strong> ({user?.email})?
        </Typography>
        <Alert severity="warning">
          This account will be permanently disabled and removed from the active user list. Their uploads,
          transactions, reports, and audit history will be preserved for record-keeping.
        </Alert>
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}