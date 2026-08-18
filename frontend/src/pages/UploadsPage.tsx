import { useState } from 'react';
import { Typography, LinearProgress, Alert } from '@mui/material';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { uploadsService, type UploadResult } from '@/services/uploads.service';
import { UploadDropzone } from '@/features/uploads/UploadDropzone';
import { UploadResultSummary } from '@/features/uploads/UploadResultSummary';
import { MyUploadsWidget } from '@/features/uploads/MyUploadsWidget';
import { GeneralUploadHistory } from '@/features/uploads/GeneralUploadHistory';
import { UploadDetailsDialog } from '@/features/uploads/UploadDetailsDialog';

export default function UploadsPage() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setResult(null);
    try {
      const res = await uploadsService.uploadCsv(file);
      setResult(res);
      toast.success(`Upload complete: ${res.summary.successfulRecords} of ${res.summary.totalRecords} records accepted`);
      queryClient.invalidateQueries({ queryKey: ['my-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['general-upload-history'] });
      queryClient.invalidateQueries({ queryKey: ['uploaders'] });
    } catch {
      setError('Failed to process the uploaded file. Please check the format and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Upload Transactions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a CSV file of transaction records for validation and processing
        </Typography>
      </div>

      <UploadDropzone onFileSelected={handleFileSelected} disabled={isUploading} />

      {isUploading && <LinearProgress color="secondary" />}

      {error && <Alert severity="error">{error}</Alert>}

      {result && <UploadResultSummary result={result} />}

      <MyUploadsWidget onSelectUpload={setSelectedUploadId} />

      <GeneralUploadHistory onSelectUpload={setSelectedUploadId} />

      <UploadDetailsDialog uploadId={selectedUploadId} onClose={() => setSelectedUploadId(null)} />
    </div>
  );
}