import { Router } from 'express';
import { env } from '../../config/env.js';
import { INVITATION_DELIVERY_MODES, ROLE_CODES } from '../../lib/constants.js';
import { HttpError } from '../../lib/errors.js';
import { prisma } from '../../lib/prisma.js';
import { buildFrontendUrl, createInvitationCode, randomToken } from '../../lib/tokens.js';
import { sendMail } from '../../lib/email.js';
import { authenticateRequest, requireAdminAccess, requireRoles } from '../middleware/auth.js';

export const adminRouter = Router();

function requireString(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${fieldName} wajib diisi.`);
  }

  return value.trim();
}

function normalizeEmail(email) {
  if (typeof email !== 'string' || !email.trim()) {
    return '*';
  }

  return email.trim().toLowerCase();
}

function normalizeDeliveryMode(value) {
  if (value === INVITATION_DELIVERY_MODES.CODE || value === INVITATION_DELIVERY_MODES.LINK) {
    return value;
  }

  return INVITATION_DELIVERY_MODES.LINK;
}

function normalizeInviteCode(value, fallbackPrefix) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim().toUpperCase().replace(/\s+/g, '-');
  }

  return createInvitationCode(fallbackPrefix);
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

adminRouter.use(authenticateRequest);
adminRouter.use(requireAdminAccess);

adminRouter.get('/session-policy', async (request, response) => {
  response.json({
    session: request.auth.user.sessionConfig,
    user: request.auth.user,
  });
});

adminRouter.get('/invitations', requireRoles([ROLE_CODES.SUPER_ADMIN, ROLE_CODES.BRANCH_ADMIN]), async (request, response) => {
  const invitations = await prisma.invitation.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      branch: true,
      role: true,
      sentByUser: true,
      acceptedByUser: true,
    },
  });

  response.json({
    invitations: invitations.map(toInvitationResponse),
  });
});

adminRouter.post('/invitations', requireRoles([ROLE_CODES.SUPER_ADMIN]), async (request, response) => {
  const roleCode = requireString(request.body?.roleCode, 'Kode role');
  const role = await prisma.role.findUnique({
    where: { code: roleCode },
  });

  if (!role) {
    throw new HttpError(404, 'Role tidak ditemukan.', 'role_not_found');
  }

  const deliveryMode = normalizeDeliveryMode(request.body?.deliveryMode);
  const inviteeEmail = normalizeEmail(request.body?.inviteeEmail);
  const branchId = typeof request.body?.branchId === 'string' && request.body.branchId.trim()
    ? request.body.branchId.trim()
    : request.auth.user.branchId ?? null;
  const inviteCode = normalizeInviteCode(request.body?.inviteCode, role.code);
  const inviteToken = randomToken(24);
  const expiresInDays = Number(request.body?.expiresInDays ?? 7);
  const expiresAt = new Date(Date.now() + Math.max(1, expiresInDays) * 24 * 60 * 60 * 1000);
  const note = typeof request.body?.note === 'string' && request.body.note.trim()
    ? request.body.note.trim()
    : null;

  const existingInvitation = await prisma.invitation.findUnique({
    where: { inviteCode },
  });

  if (existingInvitation) {
    throw new HttpError(409, 'Kode undangan sudah digunakan.', 'invite_code_taken');
  }

  if (branchId) {
    const branch = await prisma.familyBranch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new HttpError(404, 'Cabang keluarga tidak ditemukan.', 'branch_not_found');
    }
  }

  const invitation = await prisma.invitation.create({
    data: {
      branchId,
      roleId: role.id,
      sentByUserId: request.auth.user.id,
      inviteeEmail,
      inviteCode,
      inviteToken,
      deliveryMode,
      status: 'PENDING',
      expiresAt,
      note,
    },
    include: {
      branch: true,
      role: true,
      sentByUser: true,
      acceptedByUser: true,
    },
  });

  const inviteUrl = toInvitationResponse(invitation).inviteUrl;
  let emailSent = false;

  if (inviteeEmail !== '*') {
    await sendMail({
      to: inviteeEmail,
      subject: `${env.appName} - Undangan anggota baru`,
      text: [
        `Halo,`,
        '',
        `Anda menerima undangan sebagai ${role.name} di ${env.appName}.`,
        `Gunakan tautan berikut untuk melanjutkan: ${inviteUrl}`,
        `Kode undangan: ${inviteCode}`,
        '',
        'Jika undangan ini tidak relevan, Anda dapat mengabaikannya.',
      ].join('\n'),
    });

    emailSent = true;
  }

  response.status(201).json({
    message: 'Undangan berhasil dibuat.',
    emailSent,
    invitation: toInvitationResponse(invitation),
  });
});

adminRouter.get('/dashboard', requireRoles([ROLE_CODES.SUPER_ADMIN, ROLE_CODES.BRANCH_ADMIN]), async (_request, response) => {
  response.json({
    message: 'Halaman admin aman diakses.',
  });
});
