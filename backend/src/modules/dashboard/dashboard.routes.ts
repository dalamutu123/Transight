import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '@middleware/authenticate';

const router = Router();

router.get('/', authenticate, dashboardController.getSummary);

export default router;