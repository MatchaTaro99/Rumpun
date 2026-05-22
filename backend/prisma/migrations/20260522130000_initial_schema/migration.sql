-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "LivingStatus" AS ENUM ('ALIVE', 'DECEASED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ParentChildRelationKind" AS ENUM ('BIOLOGICAL', 'ADOPTIVE', 'STEP', 'GUARDIAN');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'INVITE', 'ACCEPT_INVITE', 'LOGIN', 'LOGOUT', 'CONFIGURE');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "rootMemberId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_members" (
    "id" TEXT NOT NULL,
    "branchId" TEXT,
    "fullName" TEXT NOT NULL,
    "nickname" TEXT,
    "gender" "Gender" NOT NULL,
    "birthPlace" TEXT,
    "birthDate" TIMESTAMP(3),
    "livingStatus" "LivingStatus" NOT NULL DEFAULT 'ALIVE',
    "deathDate" TIMESTAMP(3),
    "deathPlace" TEXT,
    "deathCause" TEXT,
    "burialPlace" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_member_sensitive_data" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "contactEmailCiphertext" BYTEA,
    "contactPhoneCiphertext" BYTEA,
    "occupationCiphertext" BYTEA,
    "residenceCiphertext" BYTEA,
    "biographyCiphertext" BYTEA,
    "encryptionVersion" INTEGER NOT NULL DEFAULT 1,
    "algorithm" TEXT NOT NULL DEFAULT 'placeholder',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_member_sensitive_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_child_relations" (
    "id" TEXT NOT NULL,
    "branchId" TEXT,
    "parentMemberId" TEXT NOT NULL,
    "childMemberId" TEXT NOT NULL,
    "relationKind" "ParentChildRelationKind" NOT NULL DEFAULT 'BIOLOGICAL',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parent_child_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spouse_relations" (
    "id" TEXT NOT NULL,
    "branchId" TEXT,
    "pairKey" TEXT NOT NULL,
    "partnerOneId" TEXT NOT NULL,
    "partnerTwoId" TEXT NOT NULL,
    "marriedAt" TIMESTAMP(3),
    "separatedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spouse_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "branchId" TEXT,
    "roleId" TEXT NOT NULL,
    "memberId" TEXT,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_configs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "idleTimeoutMinutes" INTEGER NOT NULL DEFAULT 30,
    "maxSessionHours" INTEGER NOT NULL DEFAULT 12,
    "largeTextMode" BOOLEAN NOT NULL DEFAULT false,
    "highContrastMode" BOOLEAN NOT NULL DEFAULT false,
    "reducedMotionMode" BOOLEAN NOT NULL DEFAULT false,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'id',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "familyUpdates" BOOLEAN NOT NULL DEFAULT true,
    "birthdayReminders" BOOLEAN NOT NULL DEFAULT true,
    "relationRequests" BOOLEAN NOT NULL DEFAULT true,
    "invitationAlerts" BOOLEAN NOT NULL DEFAULT true,
    "digestEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "branchId" TEXT,
    "roleId" TEXT NOT NULL,
    "sentByUserId" TEXT,
    "inviteeEmail" TEXT NOT NULL,
    "inviteToken" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "acceptedByUserId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "branchId" TEXT,
    "actorUserId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "beforeSnapshot" JSONB,
    "afterSnapshot" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "family_branches_code_key" ON "family_branches"("code");

-- CreateIndex
CREATE UNIQUE INDEX "family_branches_rootMemberId_key" ON "family_branches"("rootMemberId");

-- CreateIndex
CREATE INDEX "family_members_branchId_idx" ON "family_members"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "family_member_sensitive_data_memberId_key" ON "family_member_sensitive_data"("memberId");

-- CreateIndex
CREATE INDEX "parent_child_relations_branchId_idx" ON "parent_child_relations"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "parent_child_relations_parentMemberId_childMemberId_key" ON "parent_child_relations"("parentMemberId", "childMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "spouse_relations_pairKey_key" ON "spouse_relations"("pairKey");

-- CreateIndex
CREATE INDEX "spouse_relations_branchId_idx" ON "spouse_relations"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "spouse_relations_partnerOneId_partnerTwoId_key" ON "spouse_relations"("partnerOneId", "partnerTwoId");

-- CreateIndex
CREATE UNIQUE INDEX "users_memberId_key" ON "users"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_branchId_idx" ON "users"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "session_configs_userId_key" ON "session_configs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_inviteToken_key" ON "invitations"("inviteToken");

-- CreateIndex
CREATE INDEX "invitations_branchId_idx" ON "invitations"("branchId");

-- CreateIndex
CREATE INDEX "audit_logs_branchId_idx" ON "audit_logs"("branchId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "family_branches" ADD CONSTRAINT "family_branches_rootMemberId_fkey" FOREIGN KEY ("rootMemberId") REFERENCES "family_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "family_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member_sensitive_data" ADD CONSTRAINT "family_member_sensitive_data_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child_relations" ADD CONSTRAINT "parent_child_relations_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "family_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child_relations" ADD CONSTRAINT "parent_child_relations_parentMemberId_fkey" FOREIGN KEY ("parentMemberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_child_relations" ADD CONSTRAINT "parent_child_relations_childMemberId_fkey" FOREIGN KEY ("childMemberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_relations" ADD CONSTRAINT "spouse_relations_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "family_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_relations" ADD CONSTRAINT "spouse_relations_partnerOneId_fkey" FOREIGN KEY ("partnerOneId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_relations" ADD CONSTRAINT "spouse_relations_partnerTwoId_fkey" FOREIGN KEY ("partnerTwoId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "family_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_configs" ADD CONSTRAINT "session_configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "family_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "family_branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

