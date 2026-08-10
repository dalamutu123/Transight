import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { auditService } from './audit.service';
import type { AuditLogQuery } from './audit.validation';

export const auditController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { items, pagination } = await auditService.list(req.validatedQuery as unknown as AuditLogQuery);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),
};