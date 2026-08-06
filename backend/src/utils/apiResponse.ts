import { Response } from 'express';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SuccessPayload<T> {
  success: true;
  message?: string;
  data: T;
  pagination?: Pagination;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  pagination?: Pagination
) {
  const payload: SuccessPayload<T> = { success: true, message, data, pagination };
  return res.status(statusCode).json(payload);
}

export function sendError(res: Response, message: string, statusCode = 500, errors?: unknown) {
  const payload: ErrorPayload = { success: false, message, errors };
  return res.status(statusCode).json(payload);
}

export function buildPagination(page: number, limit: number, total: number): Pagination {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}