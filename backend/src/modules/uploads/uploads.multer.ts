import multer from 'multer';
import { AppError } from '@utils/AppError';

const storage = multer.memoryStorage();

export const csvUpload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    const isCsv =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.toLowerCase().endsWith('.csv');

    if (!isCsv) {
      return cb(new Error('INVALID_FILE_TYPE'));
    }
    cb(null, true);
  },
}).single('file');

export function handleMulterError(err: unknown): never {
  if (err instanceof Error && err.message === 'INVALID_FILE_TYPE') {
    throw AppError.badRequest('Only CSV files are supported');
  }
  if (err instanceof multer.MulterError) {
    throw AppError.badRequest(`File upload error: ${err.message}`);
  }
  throw AppError.badRequest('Failed to process uploaded file');
}