import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '@/services/transactions.service';
import type { TransactionSearchFilters } from '@/types/transaction';

export function useTransactions(filters: Partial<TransactionSearchFilters>) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsService.search(filters),
    placeholderData: (previousData) => previousData, // keep old rows visible while refetching, avoids layout flicker
  });
}