import { Paper, Typography, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAddOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import HistoryIcon from '@mui/icons-material/HistoryOutlined';
import { useNavigate } from 'react-router-dom';

export function AdminQuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Manage Users', icon: <GroupIcon />, path: '/administration' },
    { label: 'View Upload History', icon: <FolderOutlinedIcon />, path: '/administration/upload-history' },
    { label: 'View Audit Logs', icon: <HistoryIcon />, path: '/audit-logs' },
  ];

  return (
    <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        Quick Actions
      </Typography>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <Button
            key={action.path}
            variant="outlined"
            color="primary"
            startIcon={action.icon}
            onClick={() => navigate(action.path)}
          >
            {action.label}
          </Button>
        ))}
        <Button variant="contained" color="primary" startIcon={<PersonAddIcon />} onClick={() => navigate('/administration')}>
          Create User
        </Button>
      </div>
    </Paper>
  );
}