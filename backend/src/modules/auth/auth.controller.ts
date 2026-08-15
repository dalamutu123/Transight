import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { authService } from './auth.service';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body, req.ip);
    return sendSuccess(res, result, 'Login successful');
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    return sendSuccess(res, null, 'Logged out successfully');
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getCurrentUser(req.user!.id);
    return sendSuccess(res, user);
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body);
    return sendSuccess(res, null, 'Password changed successfully');
  }),
};