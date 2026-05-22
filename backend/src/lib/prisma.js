import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__rumpunPrisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (!globalForPrisma.__rumpunPrisma) {
  globalForPrisma.__rumpunPrisma = prisma;
}

