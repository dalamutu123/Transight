import { useState } from 'react';
import { TextField, MenuItem, Button, Paper } from '@mui/material';
import type { Role } from '@/services/users.service';
import type { AdminAllUploadsFilters as Filters } from '@/services/adminUploads.service';

interface Props {
  roles: Role[];
  onApply: (filters: Partial<Filters>) => void;
}

const STATUSES = ['Processing', 'Completed', 'Failed'];

export function AllUploadsFilters({ roles, onApply }: Props) {
  const [filename, setFilename] = useState('');
  const [roleId, setRoleId] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    onApply({
      filename: filename || undefined,
      roleId: roleId || undefined,
      status: status || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    });
  };

  const handleClear = () => {
    setFilename('');
    setRoleId('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    onApply({});
  };

  return (
    <Paper elevation={0} className="card-hover p-4 rounded-card border border-gray-200">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <TextField
          label="Filename"
          size="small"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <TextField label="Role" size="small" select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          {roles.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Status" size="small" select value={status} onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
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