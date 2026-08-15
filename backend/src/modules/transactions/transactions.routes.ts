import { Router } from 'express';
import { transactionsController } from './transactions.controller';
import { authenticate } from '@middleware/authenticate';
import { requirePasswordChangeComplete } from '@middleware/requirePasswordChange';
import { validate } from '@middleware/validate';
import { transactionSearchSchema, transactionIdParamSchema } from './transactions.validation';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePasswordChangeComplete,
  validate({ query: transactionSearchSchema }),
  transactionsController.search
);

router.get(
  '/search',
  authenticate,
  requirePasswordChangeComplete,
  validate({ query: transactionSearchSchema }),
  transactionsController.search
);

router.get(
  '/:id',
  authenticate,
  requirePasswordChangeComplete,
  validate({ params: transactionIdParamSchema }),
  transactionsController.getById
);

export default router;