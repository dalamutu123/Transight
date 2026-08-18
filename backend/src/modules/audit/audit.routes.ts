import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';
import { authorize } from '@middleware/authorize';
import { validate } from '@middleware/validate';
import {
  auditLogQuerySchema,
  adminAuditDirectoryQuerySchema,
  adminUserAuditQuerySchema,
  adminAuditUserIdParamSchema,
  adminAllAuditQuerySchema,
} from './audit.validation';

const router = Router();

// Administrator Audit Logs (Doc 11 §22) — registered before '/' catch-alls
// where relevant, and all admin-only.

router.get(
  '/admin/directory',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ query: adminAuditDirectoryQuerySchema }),
  auditController.getAdminDirectory
);

router.get(
  '/admin/actions',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  auditController.getActions
);

router.get(
  '/admin/all',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ query: adminAllAuditQuerySchema }),
  auditController.getAdminAllLogs
);

router.get(
  '/admin/users/:userId',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ params: adminAuditUserIdParamSchema, query: adminUserAuditQuerySchema }),
  auditController.getAdminUserHistory
);

router.get(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator', 'Operations User'),
  validate({ query: auditLogQuerySchema }),
  auditController.list
);

export default router;