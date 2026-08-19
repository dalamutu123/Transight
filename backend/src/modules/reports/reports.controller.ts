import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { reportsService } from './reports.service';
import type { ReportHistoryQuery, ReportIdParam } from './reports.validation';

export const reportsController = {
  generate: asyncHandler(async (req: Request, res: Response) => {
    const result = await reportsService.generate(req.body, req.user!.id);
    return sendSuccess(res, result, 'Report generated', 201);
  }),

  getPreview: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validatedParams as unknown as ReportIdParam;
    const preview = await reportsService.getPreview(id);
    return sendSuccess(res, preview);
  }),

  download: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.validatedParams as unknown as ReportIdParam;
    const { buffer, contentType, filename } = await reportsService.download(id);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(buffer);
  }),

  getHistory: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, userId } = req.validatedQuery as unknown as ReportHistoryQuery;
    const { items, pagination } = await reportsService.getHistory(page, limit, userId);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),

  getGenerators: asyncHandler(async (_req: Request, res: Response) => {
    const generators = await reportsService.getGenerators();
    return sendSuccess(res, generators);
  }),
};