import { describe, it, expect, vi } from 'vitest';
import { requirePasswordChangeComplete } from '../requirePasswordChange';
import { AppError } from '@utils/AppError';

describe('requirePasswordChangeComplete middleware', () => {
  it('blocks the request with a 403 when mustChangePassword is true', () => {
    const req: any = { user: { mustChangePassword: true } };
    const next = vi.fn();
    requirePasswordChangeComplete(req, {} as any, next);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
    expect(err.details).toMatchObject({ code: 'PASSWORD_CHANGE_REQUIRED' });
  });

  it('allows the request through when mustChangePassword is false', () => {
    const req: any = { user: { mustChangePassword: false } };
    const next = vi.fn();
    requirePasswordChangeComplete(req, {} as any, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('allows the request through when req.user is undefined', () => {
    const req: any = {};
    const next = vi.fn();
    requirePasswordChangeComplete(req, {} as any, next);
    expect(next).toHaveBeenCalledWith();
  });
});