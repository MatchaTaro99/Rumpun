import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { healthRouter } from './api/routes/health.js';

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

  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      environment: env.nodeEnv,
    });
  });

  app.use((_request, response) => {
    response.status(404).json({
      error: 'Not found',
    });
  });

  return app;
}

