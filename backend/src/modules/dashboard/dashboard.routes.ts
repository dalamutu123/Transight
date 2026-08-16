import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';
import { authorize } from '@middleware/authorize';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Operations User'),
  dashboardController.getSummary
);

router.get(
  '/admin',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  dashboardController.getAdminSummary
);

router.get(
  '/report-viewer',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Report Viewer'),
  dashboardController.getReportViewerSummary
);

export default router;