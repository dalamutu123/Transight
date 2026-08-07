import app from './app';
import { env } from '@config/env';
import { logger } from '@config/logger';
import { prisma } from '@config/db';

const server = app.listen(env.PORT, () => {
  logger.info(`Transight API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

async function shutdown(signal: string) {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));