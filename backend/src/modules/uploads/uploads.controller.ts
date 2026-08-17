import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { uploadsService } from './uploads.service';
import { AppError } from '@utils/AppError';
import type { UploadHistoryQuery, AdminUploadDirectoryQuery, AdminUserUploadsQuery, AdminAllUploadsQuery } from './uploads.validation';

export const uploadsController = {
  uploadCsv: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw AppError.badRequest('A CSV file is required');
    }
    const result = await uploadsService.processCsv(req.file, req.user!.id);
    return sendSuccess(res, result, 'File processed', 201);
  }),

  getHistory: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.validatedQuery as unknown as UploadHistoryQuery;
    const { items, pagination } = await uploadsService.getHistory(page, limit);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validatedParams as { id: string };
    const upload = await uploadsService.getById(id);
    return sendSuccess(res, upload);
  }),

  getRejected: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validatedParams as { id: string };
    const rejected = await uploadsService.getRejectedRecords(id);
    return sendSuccess(res, rejected);
  }),

  // Administrator Upload History (Doc 11 §21)

  getAdminDirectory: asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.validatedQuery as unknown as AdminUploadDirectoryQuery;
    const users = await uploadsService.getAdminDirectory(search);
    return sendSuccess(res, users);
  }),

  getAdminUserHistory: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.validatedParams as { userId: string };
    const { page, limit } = req.validatedQuery as unknown as AdminUserUploadsQuery;
    const { items, pagination } = await uploadsService.getUserUploadHistory(userId, page, limit);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),

  getAdminAllUploads: asyncHandler(async (req: Request, res: Response) => {
    const filters = req.validatedQuery as unknown as AdminAllUploadsQuery;
    const { items, pagination } = await uploadsService.getAllForAdmin(filters);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),
};