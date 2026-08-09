import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '@middleware/authenticate';
import { authorize } from '@middleware/authorize';
import { validate } from '@middleware/validate';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  userListQuerySchema,
} from './users.validation';

const router = Router();

router.get('/', authenticate, authorize('Administrator'), validate({ query: userListQuerySchema }), usersController.list);

router.post(
  '/',
  authenticate,
  authorize('Administrator'),
  validate({ body: createUserSchema }),
  usersController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('Administrator'),
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  usersController.update
);

export default router;