import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { HttpError } from '../../lib/errors.js';
import { prisma } from '../../lib/prisma.js';
import { ROLE_CODES } from '../../lib/constants.js';
import { createSessionJti } from '../../lib/tokens.js';

const SESSION_ISSUER = 'rumpun-api';
const SESSION_AUDIENCE = 'rumpun-app';
const authSecret = `${env.jwtSecret}:${env.sessionSecret}`;

function parseBearerToken(request) {
  const header = request.get('authorization');

  if (!header) {
    throw new HttpError(401, 'Token akses diperlukan.', 'missing_token');
  }

  const match = /^Bearer\s+(.+)$/i.exec(header.trim());

  if (!match) {
    throw new HttpError(401, 'Format token akses tidak valid.', 'invalid_token_format');
  }

  return match[1];
}

async function loadSessionContext(jti) {
  return prisma.authSession.findUnique({
    where: { jti },
    include: {
      user: {
        include: {
          role: true,
          branch: true,
          member: true,
          sessionConfig: true,
        },
      },
    },
  });
}

function sessionExpired(session, now = new Date()) {
  return session.revokedAt || session.expiresAt <= now;
}

function idleTimeoutExceeded(session, now = new Date()) {
  const idleLimitMinutes = session.idleTimeoutMinutes ?? env.defaultSessionIdleMinutes;
  const elapsedMs = now.getTime() - new Date(session.lastUsedAt).getTime();
  return elapsedMs > idleLimitMinutes * 60 * 1000;
}

function buildAuthPayload(user, session, token) {
  return {
    token,
    sessionId: session.id,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      isActive: user.isActive,
      role: {
        id: user.role.id,
        code: user.role.code,
        name: user.role.name,
      },
      branchId: user.branchId,
      branch: user.branch
        ? {
            id: user.branch.id,
            name: user.branch.name,
            code: user.branch.code,
          }
        : null,
      memberId: user.memberId,
      sessionConfig: user.sessionConfig
        ? {
            idleTimeoutMinutes: user.sessionConfig.idleTimeoutMinutes,
            maxSessionHours: user.sessionConfig.maxSessionHours,
            largeTextMode: user.sessionConfig.largeTextMode,
            highContrastMode: user.sessionConfig.highContrastMode,
            reducedMotionMode: user.sessionConfig.reducedMotionMode,
            preferredLanguage: user.sessionConfig.preferredLanguage,
          }
        : null,
    },
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
      lastUsedAt: session.lastUsedAt,
      idleTimeoutMinutes: session.idleTimeoutMinutes,
    },
  };
}

export async function createLoginSession(user, request, sessionConfig = null) {
  const idleTimeoutMinutes =
    sessionConfig?.idleTimeoutMinutes ?? env.defaultSessionIdleMinutes;
  const maxSessionHours = sessionConfig?.maxSessionHours ?? env.defaultSessionMaxHours;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + maxSessionHours * 60 * 60 * 1000);
  const jti = createSessionJti();

  const session = await prisma.authSession.create({
    data: {
      userId: user.id,
      jti,
      idleTimeoutMinutes,
      expiresAt,
      lastUsedAt: now,
      ipAddress: request.ip ?? null,
      userAgent: request.get('user-agent') ?? null,
    },
  });

  const token = jwt.sign(
    {
      sub: user.id,
      jti,
      role: user.role.code,
      branchId: user.branchId ?? null,
    },
    authSecret,
    {
      audience: SESSION_AUDIENCE,
      expiresIn: maxSessionHours * 60 * 60,
      issuer: SESSION_ISSUER,
    },
  );

  return { session, token, expiresAt };
}

export async function revokeSessionByJti(jti) {
  await prisma.authSession.updateMany({
    where: {
      jti,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeAllSessionsForUser(userId) {
  await prisma.authSession.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function authenticateRequest(request, _response, next) {
  try {
    const token = parseBearerToken(request);
    const payload = jwt.verify(token, authSecret, {
      audience: SESSION_AUDIENCE,
      issuer: SESSION_ISSUER,
    });

    if (typeof payload?.jti !== 'string' || typeof payload?.sub !== 'string') {
      throw new HttpError(401, 'Token akses tidak valid.', 'invalid_token');
    }

    const session = await loadSessionContext(payload.jti);

    if (!session || session.userId !== payload.sub) {
      throw new HttpError(401, 'Sesi tidak ditemukan.', 'session_not_found');
    }

    const now = new Date();

    if (session.user.isActive !== true) {
      throw new HttpError(403, 'Akun sudah dinonaktifkan.', 'account_inactive');
    }

    if (sessionExpired(session, now)) {
      await revokeSessionByJti(session.jti);
      throw new HttpError(401, 'Sesi sudah kedaluwarsa.', 'session_expired');
    }

    if (idleTimeoutExceeded(session, now)) {
      await revokeSessionByJti(session.jti);
      throw new HttpError(401, 'Sesi melewati batas waktu diam.', 'session_idle_timeout');
    }

    await prisma.authSession.update({
      where: { id: session.id },
      data: {
        lastUsedAt: now,
        ipAddress: request.ip ?? session.ipAddress,
        userAgent: request.get('user-agent') ?? session.userAgent,
      },
    });

    request.auth = buildAuthPayload(session.user, session, token);
    next();
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
      return;
    }

    if (
      error?.name === 'JsonWebTokenError' ||
      error?.name === 'TokenExpiredError' ||
      error?.name === 'NotBeforeError'
    ) {
      next(new HttpError(401, 'Token akses tidak valid.', 'invalid_token'));
      return;
    }

    next(error);
  }
}

export function optionalAuth(request, _response, next) {
  const header = request.get('authorization');

  if (!header) {
    request.auth = null;
    next();
    return;
  }

  authenticateRequest(request, _response, next);
}

export function requireRoles(allowedRoles) {
  return (request, _response, next) => {
    if (!request.auth) {
      next(new HttpError(401, 'Masuk terlebih dahulu.', 'authentication_required'));
      return;
    }

    const roleCode = request.auth.user?.role?.code;

    if (!allowedRoles.includes(roleCode)) {
      next(new HttpError(403, 'Anda tidak memiliki izin untuk mengakses halaman ini.', 'forbidden'));
      return;
    }

    next();
  };
}

export const requireAdminAccess = requireRoles([
  ROLE_CODES.SUPER_ADMIN,
  ROLE_CODES.BRANCH_ADMIN,
]);
