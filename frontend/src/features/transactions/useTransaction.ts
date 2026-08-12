import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '@/services/transactions.service';

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionsService.getById(id!),
    enabled: !!id,
  });
}