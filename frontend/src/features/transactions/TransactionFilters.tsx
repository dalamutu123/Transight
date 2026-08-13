import { useState } from 'react';
import { TextField, MenuItem, Button, Paper } from '@mui/material';
import type { TransactionSearchFilters } from '@/types/transaction';

interface Props {
  onApply: (filters: Partial<TransactionSearchFilters>) => void;
}

const STATUSES = ['Successful', 'Failed', 'Pending', 'Processing'];

export function TransactionFilters({ onApply }: Props) {
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [responseCode, setResponseCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const handleApply = () => {
    onApply({
      reference: reference || undefined,
      status: status || undefined,
      bankCode: bankCode || undefined,
      responseCode: responseCode || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });
  };

  const handleClear = () => {
    setReference('');
    setStatus('');
    setBankCode('');
    setResponseCode('');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    onApply({});
  };

  return (
    <Paper elevation={0} className="card-hover p-4 rounded-card border border-gray-200">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <TextField
          label="Reference"
          size="small"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        <TextField
          label="Status"
          size="small"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Bank Code"
          size="small"
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
        />
        <TextField
          label="Response Code"
          size="small"
          value={responseCode}
          onChange={(e) => setResponseCode(e.target.value)}
        />
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
        <TextField
          label="Min Amount"
          type="number"
          size="small"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
        <TextField
          label="Max Amount"
          type="number"
          size="small"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
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