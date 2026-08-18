import { useState } from 'react';
import { TextField, MenuItem, Button, Paper } from '@mui/material';
import type { Role } from '@/services/users.service';
import type { AdminAllAuditFilters as Filters } from '@/services/adminAudit.service';
import { actionLabel } from '@/features/audit/actionColor';

interface Props {
  roles: Role[];
  actions: string[];
  onApply: (filters: Partial<Filters>) => void;
}

export function AllAuditFilters({ roles, actions, onApply }: Props) {
  const [roleId, setRoleId] = useState('');
  const [action, setAction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    onApply({
      roleId: roleId || undefined,
      action: action || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    });
  };

  const handleClear = () => {
    setRoleId('');
    setAction('');
    setStartDate('');
    setEndDate('');
    onApply({});
  };

  return (
    <Paper elevation={0} className="card-hover p-4 rounded-card border border-gray-200">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <TextField label="Role" size="small" select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          {roles.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Action" size="small" select value={action} onChange={(e) => setAction(e.target.value)}>
          <MenuItem value="">All actions</MenuItem>
          {actions.map((a) => (
            <MenuItem key={a} value={a}>
              {actionLabel[a] ?? a}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Start Date"
          type="date"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="contained" color="primary" onClick={handleApply}>
          Apply Filters
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </Paper>
  );
}