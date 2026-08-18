import { Router, Request, Response, NextFunction } from 'express';
import { uploadsController } from './uploads.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';
import { authorize } from '@middleware/authorize';
import { validate } from '@middleware/validate';
import { csvUpload, handleMulterError } from './uploads.multer';
import {
  uploadHistoryQuerySchema,
  uploadIdParamSchema,
  adminUploadDirectoryQuerySchema,
  adminUserUploadsQuerySchema,
  adminUserIdParamSchema,
  adminAllUploadsQuerySchema,
} from './uploads.validation';

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

// Administrator Upload History (Doc 11 §21) — registered before '/:id'
// so 'admin' is never captured as an upload id param.

router.get(
  '/admin/directory',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ query: adminUploadDirectoryQuerySchema }),
  uploadsController.getAdminDirectory
);

router.get(
  '/admin/all',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ query: adminAllUploadsQuerySchema }),
  uploadsController.getAdminAllUploads
);

router.get(
  '/admin/users/:userId',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ params: adminUserIdParamSchema, query: adminUserUploadsQuerySchema }),
  uploadsController.getAdminUserHistory
);

// General "who has uploaded" list for the Uploads page's "filter by user"
// dropdown — lighter than the admin directory, available to Operations Users too.
router.get(
  '/uploaders',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User'),
  uploadsController.getUploaders
);

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