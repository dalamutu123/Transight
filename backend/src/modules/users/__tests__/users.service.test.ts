import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usersService } from '../users.service';
import { usersRepository } from '../users.repository';
import { auditService } from '@modules/audit/audit.service';
import { AppError } from '@utils/AppError';

vi.mock('../users.repository', () => ({
  usersRepository: {
    findById: vi.fn(),
    softDelete: vi.fn(),
  },
}));

vi.mock('@modules/audit/audit.service', () => ({
  auditService: {
    record: vi.fn(),
  },
}));

describe('usersService.remove', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws a bad request error when a user tries to delete their own account', async () => {
    await expect(usersService.remove('user-1', 'user-1')).rejects.toThrow(AppError);
    expect(usersRepository.softDelete).not.toHaveBeenCalled();
  });

  it('throws not found when the target user does not exist', async () => {
    (usersRepository.findById as any).mockResolvedValue(null);
    await expect(usersService.remove('user-2', 'admin-1')).rejects.toThrow(AppError);
  });

  it('soft-deletes the user (preserving the row) and records a DELETE_USER audit entry', async () => {
    (usersRepository.findById as any).mockResolvedValue({
      id: 'user-2',
      email: 'jane@transight.local',
      role: { name: 'Operations User' },
    });
    (usersRepository.softDelete as any).mockResolvedValue({});

    const result = await usersService.remove('user-2', 'admin-1');

    // Confirms this is a soft delete: softDelete() is called, not a hard-delete method,
    // meaning uploads/reports/audit logs tied to this user id remain intact.
    expect(usersRepository.softDelete).toHaveBeenCalledWith('user-2');
    expect(auditService.record).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'admin-1', action: 'DELETE_USER' })
    );
    expect(result).toEqual({ success: true });
  });
});