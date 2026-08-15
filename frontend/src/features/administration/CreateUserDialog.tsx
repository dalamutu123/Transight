import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { usersService, type Role, type CreateUserResult } from '@/services/users.service';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  roleId: z.string().min(1, 'Select a role'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  roles: Role[];
  onClose: () => void;
  onCreated: () => void;
}

export function CreateUserDialog({ open, roles, onClose, onCreated }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreateUserResult | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleFullClose = () => {
    setCreatedUser(null);
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await usersService.create(data);
      setCreatedUser(result);
      onCreated();
    } catch {
      toast.error('Failed to create user. The email may already be in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!createdUser) return;
    await navigator.clipboard.writeText(createdUser.tempPassword);
    toast.success('Temporary password copied to clipboard');
  };

  // After creation, show the one-time temporary password instead of the form.
  if (createdUser) {
    return (
      <Dialog open={open} onClose={handleFullClose} fullWidth maxWidth="sm">
        <DialogTitle className="flex items-center justify-between">
          User Created
          <IconButton onClick={handleFullClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2">
          <Typography variant="body2" color="text.secondary">
            <strong>{createdUser.firstName} {createdUser.lastName}</strong> ({createdUser.email}) has been
            created as <strong>{createdUser.role}</strong>. Share this temporary password with them through
            your organization's approved process — it will not be shown again.
          </Typography>
          <div className="flex items-center gap-2 p-3 rounded-card border border-gray-200 bg-slate-gray">
            <Typography variant="body1" className="font-mono flex-1 select-all">
              {createdUser.tempPassword}
            </Typography>
            <Tooltip title="Copy to clipboard">
              <IconButton onClick={handleCopyPassword} size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <Typography variant="caption" color="text.secondary">
            The user will be required to set a permanent password on their first login.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button variant="contained" color="primary" onClick={handleFullClose}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleFullClose} fullWidth maxWidth="sm">
      <DialogTitle>Create User</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="flex flex-col gap-4 pt-2">
          <TextField
            label="First Name"
            fullWidth
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            fullWidth
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Role"
            select
            fullWidth
            defaultValue=""
            {...register('roleId')}
            error={!!errors.roleId}
            helperText={errors.roleId?.message}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="caption" color="text.secondary">
            A secure temporary password will be generated automatically. The user must change it on first
            login.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleFullClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}