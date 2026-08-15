import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';
import { authorize } from '@middleware/authorize';
import { validate } from '@middleware/validate';
import { auditLogQuerySchema } from './audit.validation';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User'),
  validate({ query: auditLogQuerySchema }),
  auditController.list
);

export default router;