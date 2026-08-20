import { useState } from 'react';
import { Paper, Typography, TextField, MenuItem, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { reportsService, type ReportGenerateResult } from '@/services/reports.service';

const STATUSES = ['Successful', 'Failed', 'Pending', 'Processing'];

interface Props {
  onGenerated: (result: ReportGenerateResult) => void;
}

export function ReportGeneratorForm({ onGenerated }: Props) {
  const queryClient = useQueryClient();
  const [format, setFormat] = useState<'CSV' | 'EXCEL'>('CSV');
  const [status, setStatus] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [responseCode, setResponseCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await reportsService.generate(format, {
        status: status || undefined,
        bankCode: bankCode || undefined,
        responseCode: responseCode || undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      toast.success('Report generated');
      queryClient.invalidateQueries({ queryKey: ['reports-history'] });
      queryClient.invalidateQueries({ queryKey: ['report-generators'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onGenerated(result);
    } catch {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Paper elevation={0} className="card-hover p-5 rounded-card border border-gray-200">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        Generate Report
      </Typography>

      <div className="flex flex-col gap-4">
        <ToggleButtonGroup value={format} exclusive onChange={(_, val) => val && setFormat(val)} size="small">
          <ToggleButton value="CSV">CSV</ToggleButton>
          <ToggleButton value="EXCEL">Excel</ToggleButton>
        </ToggleButtonGroup>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <TextField label="Status" size="small" select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
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
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="self-start"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </Paper>
  );
}