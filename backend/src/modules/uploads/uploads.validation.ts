import { z } from 'zod';

// Parses DD/MM/YYYY, DD-MM-YYYY (British format), or YYYY-MM-DD (ISO, unambiguous).
// Deliberately does NOT hand the raw string to `new Date(...)`, since that assumes
// American MM/DD/YYYY for slash-separated dates — wrong for this project's data.
function parseTransactionDate(value: unknown): Date | undefined {
  if (value instanceof Date) return value;
  if (typeof value !== 'string' || !value.trim()) return undefined;

  const trimmed = value.trim();

  // ISO: YYYY-MM-DD (with optional time component)
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  // British: DD/MM/YYYY or DD-MM-YYYY
  const britishMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (britishMatch) {
    const [, day, month, year] = britishMatch;
    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);

    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) return undefined;

    const date = new Date(Date.UTC(yearNum, monthNum - 1, dayNum));
    // Guard against overflow dates like 31/04/2026 (April has 30 days),
    // which Date.UTC would otherwise silently roll into May.
    if (date.getUTCMonth() !== monthNum - 1) return undefined;

    return date;
  }

  return undefined;
}

const britishDateSchema = z.preprocess(
  parseTransactionDate,
  z.date({ error: 'Invalid transaction date' })
);

// Expected CSV columns, per the project brief:
// transaction reference, transaction date, amount, currency, customer account,
// bank code, transaction type, response code, response description, transaction status
export const csvRowSchema = z.object({
  reference: z.string().trim().min(1, 'Transaction reference is required'),
  transactionDate: britishDateSchema,
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

// ---------------------------------------------------------------------------
// Administrator Upload History (Doc 11 §21)
// ---------------------------------------------------------------------------

export const adminUploadDirectoryQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export type AdminUploadDirectoryQuery = z.infer<typeof adminUploadDirectoryQuerySchema>;

export const adminUserUploadsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type AdminUserUploadsQuery = z.infer<typeof adminUserUploadsQuerySchema>;

export const adminUserIdParamSchema = z.object({
  userId: z.string().uuid('Invalid user id'),
});

export const adminAllUploadsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  userId: z.string().uuid().optional(),
  roleId: z.string().uuid().optional(),
  status: z.string().optional(),
  filename: z.string().trim().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type AdminAllUploadsQuery = z.infer<typeof adminAllUploadsQuerySchema>;