import { Box, Toolbar } from '@mui/material';
import { Sidebar, DRAWER_WIDTH } from './Sidebar';
import { Header } from './Header';
import { PageTransition } from '@/components/PageTransition';

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
        <Toolbar />
        <PageTransition />
      </Box>
    </Box>
  );
}