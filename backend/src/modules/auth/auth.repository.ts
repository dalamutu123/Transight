import { prisma } from '@config/db';

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: { role: true },
    });
  },

  findUserById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { role: true },
    });
  },

  updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash, mustChangePassword: false },
    });
  },
};