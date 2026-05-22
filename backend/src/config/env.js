import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://rumpun:rumpun_local_password@localhost:5432/rumpun',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  sessionSecret: process.env.SESSION_SECRET ?? 'change-me',
  storageProvider: process.env.STORAGE_PROVIDER ?? 'local',
  storageBucket: process.env.STORAGE_BUCKET ?? 'rumpun-dev',
  storageEndpoint: process.env.STORAGE_ENDPOINT ?? 'http://localhost:9000',
};

