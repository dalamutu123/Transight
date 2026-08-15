import { Router } from 'express';
import { rolesController } from './roles.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';

const router = Router();

router.get('/', authenticate, requirePasswordChangeComplete, rolesController.list);

export default router;