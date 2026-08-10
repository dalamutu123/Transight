import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { transactionsService } from './transactions.service';
import type { TransactionSearchQuery } from './transactions.validation';

export const transactionsController = {
  search: asyncHandler(async (req: Request, res: Response) => {
    const { items, pagination } = await transactionsService.search(
      req.validatedQuery as unknown as TransactionSearchQuery
    );
    return sendSuccess(res, items, undefined, 200, pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validatedParams as { id: string };
    const transaction = await transactionsService.getById(id);
    return sendSuccess(res, transaction);
  }),
};