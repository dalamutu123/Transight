import { Router } from 'express';
import { rolesController } from './roles.controller';
import { authenticate } from '@middleware/authenticate';

const router = Router();

router.get('/', authenticate, rolesController.list);

export default router;