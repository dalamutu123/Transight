import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';

const router = Router();

router.get('/', authenticate, requirePasswordChangeComplete, dashboardController.getSummary);

export default router;