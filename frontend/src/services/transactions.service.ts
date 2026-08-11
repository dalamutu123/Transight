import { api } from './api';
import type { Transaction, TransactionSearchFilters, Pagination } from '@/types/transaction';

export const transactionsService = {
  search: (filters: Partial<TransactionSearchFilters>) =>
    api
      .get<{ success: boolean; data: Transaction[]; pagination: Pagination }>('/transactions', {
        params: filters,
      })
      .then((res) => ({ items: res.data.data, pagination: res.data.pagination })),

  getById: (id: string) =>
    api.get<{ success: boolean; data: Transaction }>(`/transactions/${id}`).then((res) => res.data.data),
};