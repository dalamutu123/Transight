import { Request, Response } from 'express';
import { asyncHandler } from '@utils/asyncHandler';
import { sendSuccess } from '@utils/apiResponse';
import { reportsService } from './reports.service';
import type { ReportHistoryQuery } from './reports.validation';

export const reportsController = {
  generate: asyncHandler(async (req: Request, res: Response) => {
    const { buffer, contentType, filename } = await reportsService.generate(req.body, req.user!.id);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(201).send(buffer);
  }),

  getHistory: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.validatedQuery as unknown as ReportHistoryQuery;
    const { items, pagination } = await reportsService.getHistory(page, limit);
    return sendSuccess(res, items, undefined, 200, pagination);
  }),
};