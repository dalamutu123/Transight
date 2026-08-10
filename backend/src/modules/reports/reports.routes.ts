import { Router } from 'express';
import { reportsController } from './reports.controller';
import { authenticate } from '@middleware/authenticate';
import { authorize } from '@middleware/authorize';
import { validate } from '@middleware/validate';
import { generateReportSchema, reportHistoryQuerySchema } from './reports.validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('Administrator', 'Operations User', 'Report Viewer'),
  validate({ body: generateReportSchema }),
  reportsController.generate
);

router.get('/', authenticate, validate({ query: reportHistoryQuerySchema }), reportsController.getHistory);

export default router;