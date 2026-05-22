import { Router } from 'express';
import { env } from '../../config/env.js';
import { comparePassword, hashPassword, validatePassword } from '../../lib/password.js';
import { prisma } from '../../lib/prisma.js';
import { buildFrontendUrl, hashToken, randomToken } from '../../lib/tokens.js';
import { sendMail } from '../../lib/email.js';
import { HttpError } from '../../lib/errors.js';
import { INVITATION_DELIVERY_MODES } from '../../lib/constants.js';
import {
  authenticateRequest,
  createLoginSession,
  revokeAllSessionsForUser,
  revokeSessionByJti,
} from '../middleware/auth.js';

export const authRouter = Router();

function normalizeEmail(email) {
  if (typeof email !== 'string') {
    throw new HttpError(400, 'Email wajib diisi.');
  }

  const value = email.trim().toLowerCase();

  if (!value) {
    throw new HttpError(400, 'Email wajib diisi.');
  }

  return value;
}

function normalizeInviteKey(inviteKey) {
  if (typeof inviteKey !== 'string' || !inviteKey.trim()) {
    throw new HttpError(400, 'Kode undangan wajib diisi.');
  }

  return inviteKey.trim();
}

function requireString(value, fieldName, minLength = 1) {
  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw new HttpError(400, `${fieldName} wajib diisi.`);
  }

  return value.trim();
}

function toUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    isActive: user.isActive,
    branchId: user.branchId,
    memberId: user.memberId,
    role: {
      id: user.role.id,
      code: user.role.code,
      name: user.role.name,
    },
    branch: user.branch
      ? {
          id: user.branch.id,
          code: user.branch.code,
          name: user.branch.name,
        }
      : null,
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
  };
}

function toInvitationResponse(invitation) {
  return {
    id: invitation.id,
    branchId: invitation.branchId,
    roleCode: invitation.role.code,
    roleName: invitation.role.name,
    inviteeEmail: invitation.inviteeEmail,
    inviteCode: invitation.inviteCode,
    inviteToken: invitation.inviteToken,
    deliveryMode: invitation.deliveryMode,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    acceptedAt: invitation.acceptedAt,
    note: invitation.note,
    inviteUrl: invitation.deliveryMode === INVITATION_DELIVERY_MODES.LINK
      ? buildFrontendUrl(`/join?inviteToken=${invitation.inviteToken}`, env.frontendUrl)
      : buildFrontendUrl(`/join?inviteCode=${invitation.inviteCode}`, env.frontendUrl),
  };
}

async function ensureSessionConfig(userId) {
  return prisma.sessionConfig.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      idleTimeoutMinutes: env.defaultSessionIdleMinutes,
      maxSessionHours: env.defaultSessionMaxHours,
      largeTextMode: false,
      highContrastMode: false,
      reducedMotionMode: false,
      preferredLanguage: 'id',
    },
  });
}

async function getInvitationByKey(inviteKey) {
  return prisma.invitation.findFirst({
    where: {
      OR: [
        { inviteCode: inviteKey },
        { inviteToken: inviteKey },
      ],
    },
    include: {
      branch: true,
      role: true,
      sentByUser: true,
      acceptedByUser: true,
    },
  });
}

authRouter.post('/login', async (request, response) => {
  const email = normalizeEmail(request.body?.email);
  const password = requireString(request.body?.password, 'Password', 8);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      branch: true,
      member: true,
      sessionConfig: true,
    },
  });

  if (!user || !user.isActive) {
    throw new HttpError(401, 'Email atau password salah.', 'invalid_credentials');
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, 'Email atau password salah.', 'invalid_credentials');
  }

  const sessionConfig = user.sessionConfig ?? (await ensureSessionConfig(user.id));
  const { session, token, expiresAt } = await createLoginSession(user, request, sessionConfig);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  response.json({
    message: 'Login berhasil.',
    token,
    expiresAt,
    user: toUserResponse({
      ...user,
      sessionConfig,
    }),
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
      lastUsedAt: session.lastUsedAt,
      idleTimeoutMinutes: session.idleTimeoutMinutes,
    },
  });
});

authRouter.post('/logout', authenticateRequest, async (request, response) => {
  await revokeSessionByJti(request.auth.sessionId);

  response.json({
    message: 'Logout berhasil.',
  });
});

authRouter.get('/me', authenticateRequest, async (request, response) => {
  response.json({
    user: request.auth.user,
    session: request.auth.session,
  });
});

authRouter.get('/invitations/:inviteKey', async (request, response) => {
  const inviteKey = normalizeInviteKey(request.params.inviteKey);
  const invitation = await getInvitationByKey(inviteKey);

  if (!invitation) {
    throw new HttpError(404, 'Undangan tidak ditemukan.', 'invitation_not_found');
  }

  response.json({
    invitation: toInvitationResponse(invitation),
  });
});

authRouter.post('/invitations/accept', async (request, response) => {
  const inviteKey = normalizeInviteKey(request.body?.inviteKey);
  const email = normalizeEmail(request.body?.email);
  const password = requireString(request.body?.password, 'Password', 8);
  const displayName = requireString(request.body?.displayName, 'Nama tampil');
  const fullName = request.body?.fullName ? requireString(request.body.fullName, 'Nama lengkap') : displayName;

  const invitation = await getInvitationByKey(inviteKey);

  if (!invitation) {
    throw new HttpError(404, 'Undangan tidak ditemukan.', 'invitation_not_found');
  }

  if (invitation.status !== 'PENDING') {
    throw new HttpError(400, 'Undangan sudah tidak berlaku.', 'invitation_not_pending');
  }

  if (invitation.expiresAt <= new Date()) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'EXPIRED' },
    });

    throw new HttpError(400, 'Undangan sudah kedaluwarsa.', 'invitation_expired');
  }

  if (invitation.inviteeEmail !== '*' && invitation.inviteeEmail.toLowerCase() !== email) {
    throw new HttpError(403, 'Email tidak cocok dengan undangan.', 'invite_email_mismatch');
  }

  validatePassword(password);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new HttpError(409, 'Email sudah terdaftar.', 'email_already_registered');
  }

  const passwordHash = await hashPassword(password);

  const result = await prisma.$transaction(async (tx) => {
    const member = await tx.familyMember.create({
      data: {
        branchId: invitation.branchId,
        fullName,
        nickname: displayName,
        gender: 'UNKNOWN',
        livingStatus: 'ALIVE',
      },
    });

    const user = await tx.user.create({
      data: {
        branchId: invitation.branchId,
        roleId: invitation.roleId,
        memberId: member.id,
        email,
        displayName,
        passwordHash,
        sessionConfig: {
          create: {
            idleTimeoutMinutes: env.defaultSessionIdleMinutes,
            maxSessionHours: env.defaultSessionMaxHours,
            largeTextMode: false,
            highContrastMode: false,
            reducedMotionMode: false,
            preferredLanguage: 'id',
          },
        },
        notificationPref: {
          create: {
            emailEnabled: true,
            smsEnabled: false,
            pushEnabled: false,
            inAppEnabled: true,
            familyUpdates: true,
            birthdayReminders: true,
            relationRequests: true,
            invitationAlerts: true,
            digestEnabled: false,
          },
        },
      },
      include: {
        role: true,
        branch: true,
        sessionConfig: true,
      },
    });

    const acceptedInvitation = await tx.invitation.update({
      where: { id: invitation.id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        acceptedByUserId: user.id,
      },
      include: {
        branch: true,
        role: true,
        sentByUser: true,
        acceptedByUser: true,
      },
    });

    return {
      user,
      invitation: acceptedInvitation,
      member,
    };
  });

  const { session, token, expiresAt } = await createLoginSession(result.user, request, result.user.sessionConfig);

  response.status(201).json({
    message: 'Pendaftaran berhasil menggunakan undangan.',
    token,
    expiresAt,
    user: toUserResponse(result.user),
    invitation: toInvitationResponse(result.invitation),
    member: {
      id: result.member.id,
      fullName: result.member.fullName,
      branchId: result.member.branchId,
    },
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
      lastUsedAt: session.lastUsedAt,
      idleTimeoutMinutes: session.idleTimeoutMinutes,
    },
  });
});

authRouter.post('/password-reset/request', async (request, response) => {
  const email = normalizeEmail(request.body?.email);
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
      branch: true,
      sessionConfig: true,
    },
  });

  if (!user) {
    response.json({
      message: 'Jika akun ditemukan, instruksi reset password akan dikirim.',
    });
    return;
  }

  const rawToken = randomToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      requestedEmail: email,
      expiresAt,
    },
  });

  const resetUrl = buildFrontendUrl(`/reset-password?token=${rawToken}`, env.frontendUrl);

  await sendMail({
    to: email,
    subject: `${env.appName} - Reset password`,
    text: [
      `Halo ${user.displayName},`,
      '',
      'Kami menerima permintaan reset password untuk akun Anda.',
      `Buka tautan berikut untuk melanjutkan: ${resetUrl}`,
      '',
      'Jika Anda tidak meminta reset password, abaikan email ini.',
    ].join('\n'),
  });

  response.json({
    message: 'Jika akun ditemukan, instruksi reset password akan dikirim.',
    ...(env.nodeEnv === 'production'
      ? {}
      : {
          resetToken: rawToken,
          resetUrl,
        }),
  });
});

authRouter.post('/password-reset/confirm', async (request, response) => {
  const resetToken = requireString(request.body?.resetToken, 'Reset token');
  const password = requireString(request.body?.password, 'Password', 8);
  const tokenHash = hashToken(resetToken);

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
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

  if (!tokenRecord || tokenRecord.usedAt) {
    throw new HttpError(400, 'Token reset password tidak valid.', 'invalid_reset_token');
  }

  if (tokenRecord.expiresAt <= new Date()) {
    throw new HttpError(400, 'Token reset password sudah kedaluwarsa.', 'reset_token_expired');
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await revokeAllSessionsForUser(tokenRecord.userId);

  response.json({
    message: 'Password berhasil diperbarui.',
  });
});

authRouter.post('/invitations/preview', async (request, response) => {
  const inviteKey = normalizeInviteKey(request.body?.inviteKey);
  const invitation = await getInvitationByKey(inviteKey);

  if (!invitation) {
    throw new HttpError(404, 'Undangan tidak ditemukan.', 'invitation_not_found');
  }

  response.json({
    invitation: toInvitationResponse(invitation),
  });
});

authRouter.post('/validate-password', async (request, response) => {
  const password = requireString(request.body?.password, 'Password');
  validatePassword(password);

  response.json({
    message: 'Password valid.',
  });
});
