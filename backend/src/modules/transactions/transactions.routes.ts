import { Router } from 'express';
import { transactionsController } from './transactions.controller';
import { authenticate } from '@middleware/authenticate';
import { validate } from '@middleware/validate';
import { transactionSearchSchema, transactionIdParamSchema } from './transactions.validation';

const router = Router();

// GET /api/v1/transactions - paginated list (supports the same filters as /search)
router.get('/', authenticate, validate({ query: transactionSearchSchema }), transactionsController.search);

// GET /api/v1/transactions/search - explicit search endpoint (identical handler, kept per API spec)
router.get(
  '/search',
  authenticate,
  validate({ query: transactionSearchSchema }),
  transactionsController.search
);

// GET /api/v1/transactions/:id
router.get(
  '/:id',
  authenticate,
  validate({ params: transactionIdParamSchema }),
  transactionsController.getById
);

export default router;