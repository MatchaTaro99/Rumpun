import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { healthRouter } from './api/routes/health.js';
import { authRouter } from './api/routes/auth.js';
import { adminRouter } from './api/routes/admin.js';
import { authenticateRequest, requireAdminAccess } from './api/middleware/auth.js';
import { isHttpError } from './lib/errors.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.frontendUrl,
    }),
  );
  app.use(express.json());

  app.get('/', (_request, response) => {
    response.json({
      name: 'Rumpun API',
      status: 'running',
    });
  });

  app.use('/api', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);

  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      environment: env.nodeEnv,
    });
  });

  app.get('/admin', authenticateRequest, requireAdminAccess, (_request, response) => {
    response.json({
      status: 'ok',
      page: 'admin',
    });
  });

  app.use((_request, response) => {
    response.status(404).json({
      error: 'Not found',
    });
  });

  app.use((error, _request, response, _next) => {
    void _next;
    const statusCode = isHttpError(error) ? error.statusCode : error.statusCode ?? 500;
    const message = error.message ?? 'Internal server error';

    if (statusCode >= 500) {
      console.error(error);
    }

    response.status(statusCode).json({
      error: message,
      code: error.code ?? 'internal_error',
    });
  });

  return app;
}
