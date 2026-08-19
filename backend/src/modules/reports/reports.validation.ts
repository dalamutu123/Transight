import { z } from 'zod';

export const generateReportSchema = z.object({
  format: z.enum(['CSV', 'EXCEL']),
  filters: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.string().optional(),
    bankCode: z.string().optional(),
    responseCode: z.string().optional(),
  }),
});

export type GenerateReportInput = z.infer<typeof generateReportSchema>;

export const reportHistoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  userId: z.string().uuid().optional(),
});

export type ReportHistoryQuery = z.infer<typeof reportHistoryQuerySchema>;

export const reportIdParamSchema = z.object({
  id: z.string().uuid('Invalid report id'),
});

export type ReportIdParam = z.infer<typeof reportIdParamSchema>;