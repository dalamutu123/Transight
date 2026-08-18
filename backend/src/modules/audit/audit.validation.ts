import { z } from 'zod';

export const auditLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;

// ---------------------------------------------------------------------------
// Administrator Audit Logs (Doc 11 §22)
// ---------------------------------------------------------------------------

export const adminAuditDirectoryQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export type AdminAuditDirectoryQuery = z.infer<typeof adminAuditDirectoryQuerySchema>;

export const adminUserAuditQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  action: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type AdminUserAuditQuery = z.infer<typeof adminUserAuditQuerySchema>;

export const adminAuditUserIdParamSchema = z.object({
  userId: z.string().uuid('Invalid user id'),
});

export const adminAllAuditQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  userId: z.string().uuid().optional(),
  roleId: z.string().uuid().optional(),
  action: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type AdminAllAuditQuery = z.infer<typeof adminAllAuditQuerySchema>;