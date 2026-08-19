import { useState } from 'react';
import { TextField, MenuItem, Button, Paper } from '@mui/material';
import type { Generator } from '@/services/reports.service';

interface Props {
  generators: Generator[];
  onApply: (userId?: string) => void;
}

export function ReportViewerFilters({ generators, onApply }: Props) {
  const [userId, setUserId] = useState('');

  return (
    <Paper elevation={0} className="card-hover p-4 rounded-card border border-gray-200">
      <div className="flex items-center gap-3 flex-wrap">
        <TextField
          label="Filter by user"
          size="small"
          select
          value={userId}
          onChange={(e) => {
            const val = e.target.value;
            setUserId(val);
            onApply(val || undefined);
          }}
          sx={{ minWidth: 240 }}
        >
          <MenuItem value="">All users</MenuItem>
          {generators.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.firstName} {g.lastName}
            </MenuItem>
          ))}
        </TextField>
        {userId && (
          <Button
            size="small"
            onClick={() => {
              setUserId('');
              onApply(undefined);
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </Paper>
  );
}