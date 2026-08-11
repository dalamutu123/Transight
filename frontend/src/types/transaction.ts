export interface Transaction {
  id: string;
  reference: string;
  transactionDate: string;
  amount: string;
  currency: string;
  customerAccount: string;
  transactionType: string;
  responseCode: string;
  responseDescription: string | null;
  bank: { id: string; code: string; name: string };
  status: { id: string; name: string };
  createdAt: string;
}

export interface TransactionSearchFilters {
  page: number;
  limit: number;
  reference?: string;
  status?: string;
  responseCode?: string;
  bankCode?: string;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy: 'transactionDate' | 'amount' | 'reference' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}