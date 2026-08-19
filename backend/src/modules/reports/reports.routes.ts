import { Router } from 'express';
import { reportsController } from './reports.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';
import { authorize } from '@middleware/authorize';
import { validate } from '@middleware/validate';
import { generateReportSchema, reportHistoryQuerySchema, reportIdParamSchema } from './reports.validation';

const router = Router();

// Per Doc 11 §6/§13/§23: Report Viewer can view/preview/download reports but
// cannot generate them — generation is Administrator/Operations User only.
router.post(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User'),
  validate({ body: generateReportSchema }),
  reportsController.generate
);

router.get(
  '/generators',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User', 'Report Viewer'),
  reportsController.getGenerators
);

router.get(
  '/:id/preview',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User', 'Report Viewer'),
  validate({ params: reportIdParamSchema }),
  reportsController.getPreview
);

router.get(
  '/:id/download',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User', 'Report Viewer'),
  validate({ params: reportIdParamSchema }),
  reportsController.download
);

router.get(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User', 'Report Viewer'),
  validate({ query: reportHistoryQuerySchema }),
  reportsController.getHistory
);

export default router;