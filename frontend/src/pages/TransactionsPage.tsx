import { useState } from 'react';
import { Typography, Pagination as MuiPagination } from '@mui/material';
import { useTransactions } from '@/features/transactions/useTransactions';
import { TransactionFilters } from '@/features/transactions/TransactionFilters';
import { TransactionsTable } from '@/features/transactions/TransactionsTable';
import type { TransactionSearchFilters } from '@/types/transaction';

export default function TransactionsPage() {
  const [filters, setFilters] = useState<Partial<TransactionSearchFilters>>({
    page: 1,
    limit: 20,
    sortBy: 'transactionDate',
    sortOrder: 'desc',
  });

  const { data, isLoading, isFetching, isError } = useTransactions(filters);

  const handleApplyFilters = (newFilters: Partial<TransactionSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (_: unknown, page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h5" className="font-semibold text-charcoal">
          Transactions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Search and investigate transaction records
        </Typography>
      </div>

      <TransactionFilters onApply={handleApplyFilters} />

      {isError ? (
        <div className="text-error text-sm">Could not load transactions. Please try again.</div>
      ) : (
        <>
          <div
            className="transition-opacity duration-200"
            style={{ opacity: isFetching && !isLoading ? 0.5 : 1 }}
          >
            <TransactionsTable data={data?.items ?? []} loading={isLoading} />
          </div>
          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <MuiPagination
                count={data.pagination.totalPages}
                page={data.pagination.page}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}