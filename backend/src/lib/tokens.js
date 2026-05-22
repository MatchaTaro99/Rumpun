import crypto from 'node:crypto';

export function randomToken(byteLength = 32) {
  return crypto.randomBytes(byteLength).toString('hex');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createInvitationCode(prefix = 'RMP') {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export function createSessionJti() {
  return crypto.randomUUID();
}

export function buildFrontendUrl(pathname, baseUrl) {
  return new URL(pathname, baseUrl).toString();
}

