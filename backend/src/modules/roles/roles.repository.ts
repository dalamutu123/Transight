import { prisma } from '@config/db';

export const rolesRepository = {
  findAll() {
    return prisma.role.findMany({ orderBy: { name: 'asc' } });
  },
};