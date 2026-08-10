import { z } from 'zod';

export const transactionSearchSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  reference: z.string().optional(),
  status: z.string().optional(),
  responseCode: z.string().optional(),
  bankCode: z.string().optional(),
  transactionType: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  sortBy: z
    .enum(['transactionDate', 'amount', 'reference', 'createdAt'])
    .default('transactionDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TransactionSearchQuery = z.infer<typeof transactionSearchSchema>;

export const transactionIdParamSchema = z.object({
  id: z.string().uuid('Invalid transaction id'),
});