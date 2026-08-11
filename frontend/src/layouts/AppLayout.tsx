import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Sidebar, DRAWER_WIDTH } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  return (
    <Box className="flex min-h-screen bg-slate-gray">
      <Sidebar />
      <Header />
      <Box
        component="main"
        sx={{ flexGrow: 1, width: `calc(100% - ${DRAWER_WIDTH}px)` }}
        className="p-6"
      >
        <Toolbar /> {/* spacer to push content below the fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
}