import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService, type UserItem } from '@/services/users.service';
import { UsersTable } from '@/features/administration/UsersTable';
import { CreateUserDialog } from '@/features/administration/CreateUserDialog';
import { DeleteUserDialog } from '@/features/administration/DeleteUserDialog';

export default function AdministrationPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.list(1, 50),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => usersService.getRoles(),
  });

  const invalidateUserRelatedData = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard', 'admin'] });
  };

  const handleToggleActive = async (user: UserItem) => {
    try {
      await usersService.update(user.id, { isActive: !user.isActive });
      toast.success(`${user.firstName} ${user.lastName} ${!user.isActive ? 'activated' : 'deactivated'}`);
      invalidateUserRelatedData();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await usersService.remove(userToDelete.id);
      toast.success(`${userToDelete.firstName} ${userToDelete.lastName} has been deleted`);
      invalidateUserRelatedData();
      setUserToDelete(null);
    } catch {
      toast.error('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h5" className="font-semibold text-charcoal">
            Administration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage users, roles, and account access
          </Typography>
        </div>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New User
        </Button>
      </div>

      <UsersTable
        users={usersData?.items ?? []}
        loading={usersLoading}
        onToggleActive={handleToggleActive}
        onDelete={setUserToDelete}
      />

      <CreateUserDialog
        open={dialogOpen}
        roles={roles}
        onClose={() => setDialogOpen(false)}
        onCreated={invalidateUserRelatedData}
      />

      <DeleteUserDialog
        user={userToDelete}
        isDeleting={isDeleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}