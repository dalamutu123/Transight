import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { auditService } from './audit.service';
import type {
  AuditLogQuery,
  AdminAuditDirectoryQuery,
  AdminUserAuditQuery,
  AdminAllAuditQuery,
} from './audit.validation';

export const auditController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { items, pagination } = await auditService.list(req.validatedQuery as unknown as AuditLogQuery);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),

  // Administrator Audit Logs (Doc 11 §22)

  getAdminDirectory: asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.validatedQuery as unknown as AdminAuditDirectoryQuery;
    const users = await auditService.getAdminDirectory(search);
    return sendSuccess(res, users);
  }),

  getAdminUserHistory: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.validatedParams as { userId: string };
    const query = req.validatedQuery as unknown as AdminUserAuditQuery;
    const { items, pagination } = await auditService.getUserAuditHistory(userId, query);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),

  getAdminAllLogs: asyncHandler(async (req: Request, res: Response) => {
    const filters = req.validatedQuery as unknown as AdminAllAuditQuery;
    const { items, pagination } = await auditService.getAllForAdmin(filters);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),

  getActions: asyncHandler(async (_req: Request, res: Response) => {
    const actions = await auditService.getDistinctActions();
    return sendSuccess(res, actions);
  }),
};