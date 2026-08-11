import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { DRAWER_WIDTH } from './Sidebar';

export function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : '';

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        backgroundColor: '#FFFFFF',
        color: '#1F2937',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <Toolbar className="flex justify-end gap-3">
        <Box className="flex items-center gap-2">
          <Typography variant="body2" color="text.secondary">
            {user?.firstName} {user?.lastName} · {user?.role}
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: '#540D6E', width: 36, height: 36, fontSize: 14 }}>{initials}</Avatar>
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}