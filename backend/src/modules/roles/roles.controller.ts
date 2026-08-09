import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { rolesService } from './roles.service';

export const rolesController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const roles = await rolesService.list();
    return sendSuccess(res, roles);
  }),
};