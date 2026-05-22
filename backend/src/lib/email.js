import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transportPromise;

function createTransport() {
  if (env.emailMode === 'console') {
    return null;
  }

  if (env.smtpUrl) {
    return nodemailer.createTransport(env.smtpUrl);
  }

  if (env.smtpHost) {
    return nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: env.smtpUser
        ? {
            user: env.smtpUser,
            pass: env.smtpPass,
          }
        : undefined,
    });
  }

  return null;
}

async function getTransport() {
  if (transportPromise === undefined) {
    transportPromise = Promise.resolve(createTransport());
  }

  return transportPromise;
}

export async function sendMail(message) {
  const transport = await getTransport();

  if (!transport) {
    console.info(`[mail:${message.to}] ${message.subject}`);
    if (message.text) {
      console.info(message.text);
    }

    return { mode: 'console' };
  }

  return transport.sendMail({
    from: env.emailFrom,
    ...message,
  });
}

