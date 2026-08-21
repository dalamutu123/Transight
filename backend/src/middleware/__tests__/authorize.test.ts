import { describe, it, expect, vi } from 'vitest';
import { authorize } from '../authorize';
import { AppError } from '@utils/AppError';

function mockReqRes(user?: { role: string }) {
  const req: any = { user };
  const res: any = {};
  const next = vi.fn();
  return { req, res, next };
}

describe('authorize middleware', () => {
  it('calls next() with no error when the user has an allowed role', () => {
    const { req, res, next } = mockReqRes({ role: 'Administrator' });
    authorize('Administrator', 'Operations User')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next(AppError.forbidden) when the user role is not allowed', () => {
    const { req, res, next } = mockReqRes({ role: 'Report Viewer' });
    authorize('Administrator')(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
  });

  it('calls next(AppError.unauthorized) when req.user is missing', () => {
    const { req, res, next } = mockReqRes(undefined);
    authorize('Administrator')(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
  });
});