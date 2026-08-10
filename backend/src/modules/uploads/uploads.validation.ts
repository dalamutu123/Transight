import { z } from 'zod';

// Expected CSV columns, per the project brief:
// transaction reference, transaction date, amount, currency, customer account,
// bank code, transaction type, response code, response description, transaction status
export const csvRowSchema = z.object({
  reference: z.string().trim().min(1, 'Transaction reference is required'),
  transactionDate: z.coerce.date({ error: 'Invalid transaction date' }),
  amount: z.coerce.number({ error: 'Invalid amount' }).positive('Amount must be positive'),
  currency: z.string().trim().min(3).max(3, 'Currency must be a 3-letter code'),
  customerAccount: z.string().trim().min(1, 'Customer account is required'),
  bankCode: z.string().trim().min(1, 'Bank code is required'),
  transactionType: z.string().trim().min(1, 'Transaction type is required'),
  responseCode: z.string().trim().min(1, 'Response code is required'),
  responseDescription: z.string().trim().optional().default(''),
  status: z.string().trim().min(1, 'Transaction status is required'),
});

export type CsvRow = z.infer<typeof csvRowSchema>;

export const uploadHistoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type UploadHistoryQuery = z.infer<typeof uploadHistoryQuerySchema>;

export const uploadIdParamSchema = z.object({
  id: z.string().uuid('Invalid upload id'),
});