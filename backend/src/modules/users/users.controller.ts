import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { usersService } from './users.service';
import type { UserListQuery } from './users.validation';

export const usersController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.create(req.body, req.user!.id);
    return sendSuccess(res, user, 'User created', 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.validatedQuery as unknown as UserListQuery;
    const { items, pagination } = await usersService.list(page, limit);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validatedParams as { id: string };
    const user = await usersService.update(id, req.body, req.user!.id);
    return sendSuccess(res, user, 'User updated');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validatedParams as { id: string };
    await usersService.remove(id, req.user!.id);
    return sendSuccess(res, null, 'User deleted');
  }),
};