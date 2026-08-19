import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';
import { authorize } from '@middleware/authorize';
import { validate } from '@middleware/validate';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  userListQuerySchema,
} from './users.validation';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ query: userListQuerySchema }),
  usersController.list
);

router.post(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ body: createUserSchema }),
  usersController.create
);

router.put(
  '/:id',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  usersController.update
);

router.delete(
  '/:id',
  authenticate,
  requirePasswordChangeComplete,
  authorize('Administrator'),
  validate({ params: userIdParamSchema }),
  usersController.remove
);

export default router;