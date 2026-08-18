import { Dialog, DialogTitle, DialogContent, IconButton, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@tanstack/react-query';
import { uploadsService } from '@/services/uploads.service';
import { UploadResultSummary } from './UploadResultSummary';

interface Props {
  uploadId: string | null;
  onClose: () => void;
}

export function UploadDetailsDialog({ uploadId, onClose }: Props) {
  const { data: upload, isLoading: uploadLoading } = useQuery({
    queryKey: ['upload', uploadId],
    queryFn: () => uploadsService.getById(uploadId!),
    enabled: !!uploadId,
  });

  const { data: rejected, isLoading: rejectedLoading } = useQuery({
    queryKey: ['upload-rejected', uploadId],
    queryFn: () => uploadsService.getRejected(uploadId!),
    enabled: !!uploadId,
  });

  const isLoading = uploadLoading || rejectedLoading;

  return (
    <Dialog open={!!uploadId} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="flex items-center justify-between">
        Upload Details
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="pt-2 pb-6">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton variant="rounded" height={100} />
            <Skeleton variant="rounded" height={200} />
          </div>
        ) : upload ? (
          <UploadResultSummary
            result={{
              upload: {
                id: upload.id,
                filename: upload.filename,
                status: upload.status,
                createdAt: upload.createdAt,
              },
              summary: {
                totalRecords: upload.totalRecords,
                successfulRecords: upload.successfulRecords,
                rejectedRecords: upload.rejectedRecords,
              },
              rejected: rejected ?? [],
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}