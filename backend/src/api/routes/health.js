import { Router } from 'express';
import { env } from '../../config/env.js';

export const healthRouter = Router();

healthRouter.get('/health', (_request, response) => {
  response.json({
    message: 'API is healthy',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

