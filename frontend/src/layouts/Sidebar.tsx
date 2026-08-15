import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFileOutlined';
import SummarizeIcon from '@mui/icons-material/SummarizeOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useAuthStore } from '@/store/authStore';
import { getNavItemsForRole, type AppRoute } from '@/config/permissions';

const DRAWER_WIDTH = 240;

const ICONS: Record<AppRoute, React.ReactNode> = {
  dashboard: <DashboardIcon />,
  transactions: <ReceiptLongIcon />,
  uploads: <UploadFileIcon />,
  reports: <SummarizeIcon />,
  uploadHistory: <FolderOutlinedIcon />,
  auditLogs: <HistoryIcon />,
  administration: <AdminPanelSettingsIcon />,
  settings: <SettingsOutlinedIcon />,
};

export function Sidebar() {
  const role = useAuthStore((s) => s.user?.role);
  const navItems = getNavItemsForRole(role);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#111344', // Midnight Blue, per brand doc
          color: '#FFFFFF',
          border: 'none',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" className="font-semibold text-white">
          Transight
        </Typography>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === '/administration'}
            sx={{
              borderRadius: '10px',
              mb: 0.5,
              color: 'rgba(255,255,255,0.75)',
              '&.active': {
                backgroundColor: '#540D6E', // Royal Purple, per brand doc
                color: '#FFFFFF',
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{ICONS[item.route]}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };