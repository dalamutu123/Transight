import { Router, Request, Response, NextFunction } from 'express';
import { uploadsController } from './uploads.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';
import { authorize } from '@middleware/authorize';
import { validate } from '@middleware/validate';
import { csvUpload, handleMulterError } from './uploads.multer';
import { uploadHistoryQuerySchema, uploadIdParamSchema } from './uploads.validation';

const router = Router();

function uploadMiddleware(req: Request, res: Response, next: NextFunction) {
  csvUpload(req, res, (err) => {
    if (err) {
      try {
        handleMulterError(err);
      } catch (appErr) {
        return next(appErr);
      }
    }
    next();
  });
}

router.post(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User'),
  uploadMiddleware,
  uploadsController.uploadCsv
);

router.get(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  validate({ query: uploadHistoryQuerySchema }),
  uploadsController.getHistory
);

router.get(
  '/:id',
  authenticate,
  requirePasswordChangeComplete,
  validate({ params: uploadIdParamSchema }),
  uploadsController.getById
);

router.get(
  '/:id/rejected',
  authenticate,
  requirePasswordChangeComplete,
  validate({ params: uploadIdParamSchema }),
  uploadsController.getRejected
);

export default router;