import { AppError } from '@utils/AppError';
import { buildPagination } from '@utils/apiResponse';
import { maskAccountNumber } from '@utils/mask';
import { transactionsRepository } from './transactions.repository';
import type { TransactionSearchQuery } from './transactions.validation';

export const transactionsService = {
  async search(filters: TransactionSearchQuery) {
    const { items, total } = await transactionsRepository.search(filters);

    return {
      items: items.map((tx) => ({ ...tx, customerAccount: maskAccountNumber(tx.customerAccount) })),
      pagination: buildPagination(filters.page, filters.limit, total),
    };
  },

  async getById(id: string) {
    const transaction = await transactionsRepository.findById(id);

    if (!transaction) {
      throw AppError.notFound('Transaction not found');
    }

    return { ...transaction, customerAccount: maskAccountNumber(transaction.customerAccount) };
  },
};