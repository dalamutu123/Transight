import { Typography } from '@mui/material';
import { ReportGeneratorForm } from '@/features/reports/ReportGeneratorForm';
import { ReportHistory } from '@/features/reports/ReportHistory';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate filtered operational reports in CSV or Excel format
        </Typography>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ReportGeneratorForm />
        <ReportHistory />
      </div>
    </div>
  );
}