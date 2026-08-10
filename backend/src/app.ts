import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '@config/env';
import { apiRateLimiter } from '@middleware/rateLimiter';
import { errorHandler, notFoundHandler } from '@middleware/errorHandler';

import authRoutes from '@modules/auth/auth.routes';
import auditRoutes from '@modules/audit/audit.routes';
import usersRoutes from '@modules/users/users.routes';
import rolesRoutes from '@modules/roles/roles.routes';
import dashboardRoutes from '@modules/dashboard/dashboard.routes';
import transactionsRoutes from '@modules/transactions/transactions.routes';
import uploadsRoutes from '@modules/uploads/uploads.routes';
import reportsRoutes from '@modules/reports/reports.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/audit-logs`, auditRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/roles`, rolesRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/transactions`, transactionsRoutes);
app.use(`${API_PREFIX}/uploads`, uploadsRoutes);
app.use(`${API_PREFIX}/reports`, reportsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;