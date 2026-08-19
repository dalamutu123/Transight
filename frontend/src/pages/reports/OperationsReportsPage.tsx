import { useState } from 'react';
import { Typography } from '@mui/material';
import { ReportGeneratorForm } from '@/features/reports/ReportGeneratorForm';
import { ReportHistory } from '@/features/reports/ReportHistory';
import { ReportPreviewDialog } from '@/features/reports/ReportPreviewDialog';
import type { ReportGenerateResult } from '@/services/reports.service';

export default function OperationsReportsPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewReportId, setPreviewReportId] = useState<string | null>(null);
  const [previewInitialData, setPreviewInitialData] = useState<ReportGenerateResult | undefined>(undefined);

  const handleGenerated = (result: ReportGenerateResult) => {
    setPreviewInitialData(result);
    setPreviewReportId(result.report.id);
    setPreviewOpen(true);
  };

  const handleSelectFromHistory = (id: string) => {
    setPreviewInitialData(undefined);
    setPreviewReportId(id);
    setPreviewOpen(true);
  };

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
        <ReportGeneratorForm onGenerated={handleGenerated} />
        <ReportHistory onSelect={handleSelectFromHistory} />
      </div>

      <ReportPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        reportId={previewReportId}
        initialData={previewInitialData}
      />
    </div>
  );
}