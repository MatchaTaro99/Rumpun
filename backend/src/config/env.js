import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://rumpun:rumpun_local_password@localhost:5432/rumpun',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  sessionSecret: process.env.SESSION_SECRET ?? 'change-me',
  defaultSessionIdleMinutes: Number(process.env.DEFAULT_SESSION_IDLE_MINUTES ?? 30),
  defaultSessionMaxHours: Number(process.env.DEFAULT_SESSION_MAX_HOURS ?? 12),
  appName: process.env.APP_NAME ?? 'Rumpun',
  emailFrom: process.env.EMAIL_FROM ?? 'Rumpun <noreply@rumpun.local>',
  emailMode: process.env.EMAIL_MODE ?? 'console',
  smtpUrl: process.env.SMTP_URL ?? '',
  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  smtpSecure: String(process.env.SMTP_SECURE ?? 'false') === 'true',
  storageProvider: process.env.STORAGE_PROVIDER ?? 'local',
  storageBucket: process.env.STORAGE_BUCKET ?? 'rumpun-dev',
  storageEndpoint: process.env.STORAGE_ENDPOINT ?? 'http://localhost:9000',
};
