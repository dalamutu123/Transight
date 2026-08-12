import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService, type UserItem } from '@/services/users.service';
import { UsersTable } from '@/features/administration/UsersTable';
import { CreateUserDialog } from '@/features/administration/CreateUserDialog';

export default function AdministrationPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.list(1, 50),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => usersService.getRoles(),
  });

  const handleToggleActive = async (user: UserItem) => {
    try {
      await usersService.update(user.id, { isActive: !user.isActive });
      toast.success(`${user.firstName} ${user.lastName} ${!user.isActive ? 'activated' : 'deactivated'}`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch {
      toast.error('Failed to update user status');
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
      />

      <CreateUserDialog
        open={dialogOpen}
        roles={roles}
        onClose={() => setDialogOpen(false)}
        onCreated={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
      />
    </div>
  );
}