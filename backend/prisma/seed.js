import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required for Prisma seed.');
}

const prisma = new PrismaClient();

const encrypt = (value) => Buffer.from(`enc:${value}`, 'utf8');
const hashPassword = (value) => bcrypt.hashSync(value, 10);
const makePairKey = (firstId, secondId) => [firstId, secondId].sort().join('::');

async function main() {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.authSession.deleteMany(),
    prisma.spouseRelation.deleteMany(),
    prisma.parentChildRelation.deleteMany(),
    prisma.familyMemberSensitiveData.deleteMany(),
    prisma.notificationPreference.deleteMany(),
    prisma.sessionConfig.deleteMany(),
    prisma.invitation.deleteMany(),
    prisma.user.deleteMany(),
    prisma.familyMember.deleteMany(),
    prisma.familyBranch.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  const [superAdminRole, branchAdminRole, memberRole, guestRole] = await prisma.$transaction([
    prisma.role.create({
      data: {
        code: 'SUPER_ADMIN',
        name: 'Super Admin',
        description: 'Mengelola seluruh sistem, cabang keluarga, dan undangan.',
      },
    }),
    prisma.role.create({
      data: {
        code: 'BRANCH_ADMIN',
        name: 'Admin Cabang',
        description: 'Mengelola satu cabang keluarga dan anggota di cabang tersebut.',
      },
    }),
    prisma.role.create({
      data: {
        code: 'MEMBER',
        name: 'Anggota',
        description: 'Bisa mengakses data keluarga sesuai izin cabang.',
      },
    }),
    prisma.role.create({
      data: {
        code: 'GUEST',
        name: 'Tamu',
        description: 'Akses terbatas untuk melihat informasi yang dibagikan.',
      },
    }),
  ]);

  const branch = await prisma.familyBranch.create({
    data: {
      code: 'rahman-utama',
      name: 'Keluarga Rahman',
      description: 'Contoh cabang keluarga tiga generasi untuk pengujian pohon silsilah.',
    },
  });

  const [grandfather, grandmother, father, mother, childOne, childTwo, childThree] = await prisma.$transaction([
    prisma.familyMember.create({
      data: {
        branchId: branch.id,
        fullName: 'Hadi Rahman',
        nickname: 'Hadi',
        gender: 'MALE',
        birthPlace: 'Bandung',
        birthDate: new Date('1950-04-12'),
        livingStatus: 'DECEASED',
        deathDate: new Date('2018-08-01'),
        deathPlace: 'Bandung',
        burialPlace: 'Pemakaman Cikutra',
        photoUrl: 'https://images.example.com/rumpun/hadi-rahman.jpg',
        sensitiveData: {
          create: {
            contactEmailCiphertext: encrypt('hadi.rahman@example.com'),
            contactPhoneCiphertext: encrypt('+628111111111'),
            occupationCiphertext: encrypt('Mantan Guru'),
            residenceCiphertext: encrypt('Bandung'),
            biographyCiphertext: encrypt('Tetua keluarga yang dikenal hangat dan disiplin.'),
          },
        },
      },
    }),
    prisma.familyMember.create({
      data: {
        branchId: branch.id,
        fullName: 'Murni Rahman',
        nickname: 'Murni',
        gender: 'FEMALE',
        birthPlace: 'Bandung',
        birthDate: new Date('1953-10-03'),
        livingStatus: 'DECEASED',
        deathDate: new Date('2020-02-14'),
        deathPlace: 'Bandung',
        burialPlace: 'Pemakaman Cikutra',
        photoUrl: 'https://images.example.com/rumpun/murni-rahman.jpg',
        sensitiveData: {
          create: {
            contactEmailCiphertext: encrypt('murni.rahman@example.com'),
            contactPhoneCiphertext: encrypt('+628122222222'),
            occupationCiphertext: encrypt('Ibu Rumah Tangga'),
            residenceCiphertext: encrypt('Bandung'),
            biographyCiphertext: encrypt('Menjaga tradisi keluarga dan sering jadi tempat bertanya.'),
          },
        },
      },
    }),
    prisma.familyMember.create({
      data: {
        branchId: branch.id,
        fullName: 'Budi Rahman',
        nickname: 'Budi',
        gender: 'MALE',
        birthPlace: 'Bandung',
        birthDate: new Date('1978-05-20'),
        livingStatus: 'ALIVE',
        photoUrl: 'https://images.example.com/rumpun/budi-rahman.jpg',
        sensitiveData: {
          create: {
            contactEmailCiphertext: encrypt('budi.rahman@example.com'),
            contactPhoneCiphertext: encrypt('+628133333333'),
            occupationCiphertext: encrypt('Arsitek'),
            residenceCiphertext: encrypt('Jakarta Selatan'),
            biographyCiphertext: encrypt('Generasi kedua yang menjaga dokumen keluarga.'),
          },
        },
      },
    }),
    prisma.familyMember.create({
      data: {
        branchId: branch.id,
        fullName: 'Rina Wulandari',
        nickname: 'Rina',
        gender: 'FEMALE',
        birthPlace: 'Semarang',
        birthDate: new Date('1980-11-10'),
        livingStatus: 'ALIVE',
        photoUrl: 'https://images.example.com/rumpun/rina-wulandari.jpg',
        sensitiveData: {
          create: {
            contactEmailCiphertext: encrypt('rina.wulandari@example.com'),
            contactPhoneCiphertext: encrypt('+628144444444'),
            occupationCiphertext: encrypt('Dokter'),
            residenceCiphertext: encrypt('Jakarta Selatan'),
            biographyCiphertext: encrypt('Menjadi jembatan komunikasi antar generasi.'),
          },
        },
      },
    }),
    prisma.familyMember.create({
      data: {
        branchId: branch.id,
        fullName: 'Dina Rahman',
        nickname: 'Dina',
        gender: 'FEMALE',
        birthPlace: 'Jakarta',
        birthDate: new Date('2005-02-14'),
        livingStatus: 'ALIVE',
        photoUrl: 'https://images.example.com/rumpun/dina-rahman.jpg',
        sensitiveData: {
          create: {
            contactEmailCiphertext: encrypt('dina.rahman@example.com'),
            contactPhoneCiphertext: encrypt('+628155555555'),
            occupationCiphertext: encrypt('Mahasiswa'),
            residenceCiphertext: encrypt('Jakarta Timur'),
            biographyCiphertext: encrypt('Anggota generasi ketiga yang sedang kuliah.'),
          },
        },
      },
    }),
    prisma.familyMember.create({
      data: {
        branchId: branch.id,
        fullName: 'Rafi Rahman',
        nickname: 'Rafi',
        gender: 'MALE',
        birthPlace: 'Jakarta',
        birthDate: new Date('2008-09-29'),
        livingStatus: 'ALIVE',
        photoUrl: 'https://images.example.com/rumpun/rafi-rahman.jpg',
        sensitiveData: {
          create: {
            contactEmailCiphertext: encrypt('rafi.rahman@example.com'),
            contactPhoneCiphertext: encrypt('+628166666666'),
            occupationCiphertext: encrypt('Pelajar'),
            residenceCiphertext: encrypt('Jakarta Timur'),
            biographyCiphertext: encrypt('Senang menggambar dan membantu keluarga.'),
          },
        },
      },
    }),
  ]);

  await prisma.spouseRelation.create({
    data: {
      branchId: branch.id,
      pairKey: makePairKey(grandfather.id, grandmother.id),
      partnerOneId: grandfather.id,
      partnerTwoId: grandmother.id,
      marriedAt: new Date('1973-01-20'),
      notes: 'Pasangan generasi pertama.',
    },
  });

  await prisma.spouseRelation.create({
    data: {
      branchId: branch.id,
      pairKey: makePairKey(father.id, mother.id),
      partnerOneId: father.id < mother.id ? father.id : mother.id,
      partnerTwoId: father.id < mother.id ? mother.id : father.id,
      marriedAt: new Date('2002-06-14'),
      notes: 'Pasangan generasi kedua.',
    },
  });

  await prisma.parentChildRelation.createMany({
    data: [
      { branchId: branch.id, parentMemberId: grandfather.id, childMemberId: father.id },
      { branchId: branch.id, parentMemberId: grandmother.id, childMemberId: father.id },
      { branchId: branch.id, parentMemberId: father.id, childMemberId: childOne.id },
      { branchId: branch.id, parentMemberId: father.id, childMemberId: childTwo.id },
      { branchId: branch.id, parentMemberId: mother.id, childMemberId: childOne.id },
      { branchId: branch.id, parentMemberId: mother.id, childMemberId: childTwo.id },
      { branchId: branch.id, parentMemberId: father.id, childMemberId: childThree.id },
      { branchId: branch.id, parentMemberId: mother.id, childMemberId: childThree.id },
    ],
  });

  await prisma.familyBranch.update({
    where: { id: branch.id },
    data: { rootMemberId: grandfather.id },
  });

  const superAdmin = await prisma.user.create({
    data: {
      roleId: superAdminRole.id,
      email: 'superadmin@rumpun.local',
      displayName: 'Super Admin Rumpun',
      passwordHash: hashPassword('SuperAdmin123!'),
      sessionConfig: {
        create: {
          idleTimeoutMinutes: 30,
          maxSessionHours: 12,
          largeTextMode: false,
          highContrastMode: true,
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
  });

  await prisma.user.create({
    data: {
      branchId: branch.id,
      roleId: branchAdminRole.id,
      memberId: father.id,
      email: 'admin.cabang@rumpun.local',
      displayName: 'Admin Cabang',
      passwordHash: hashPassword('AdminCabang123!'),
      sessionConfig: {
        create: {
          idleTimeoutMinutes: 30,
          maxSessionHours: 12,
          largeTextMode: true,
          highContrastMode: true,
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
          digestEnabled: true,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      branchId: branch.id,
      roleId: memberRole.id,
      memberId: childOne.id,
      email: 'anggota@rumpun.local',
      displayName: 'Anggota Keluarga',
      passwordHash: hashPassword('Anggota123!'),
      sessionConfig: {
        create: {
          idleTimeoutMinutes: 45,
          maxSessionHours: 8,
          largeTextMode: true,
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
  });

  await prisma.user.create({
    data: {
      branchId: null,
      roleId: guestRole.id,
      email: 'tamu@rumpun.local',
      displayName: 'Tamu Rumpun',
      passwordHash: hashPassword('Tamu123!'),
      sessionConfig: {
        create: {
          idleTimeoutMinutes: 15,
          maxSessionHours: 4,
          largeTextMode: false,
          highContrastMode: false,
          reducedMotionMode: false,
          preferredLanguage: 'id',
        },
      },
      notificationPref: {
        create: {
          emailEnabled: false,
          smsEnabled: false,
          pushEnabled: false,
          inAppEnabled: true,
          familyUpdates: false,
          birthdayReminders: false,
          relationRequests: false,
          invitationAlerts: true,
          digestEnabled: false,
        },
      },
    },
  });

  const inviteToMember = await prisma.invitation.create({
    data: {
      branchId: branch.id,
      roleId: memberRole.id,
      sentByUserId: superAdmin.id,
      inviteeEmail: 'anggota-baru@example.com',
      inviteCode: 'ANGGOTA-RAHMAN',
      inviteToken: 'invite-token-member-rahman',
      deliveryMode: 'LINK',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      note: 'Undangan link untuk anggota keluarga baru.',
    },
  });

  const inviteToGuest = await prisma.invitation.create({
    data: {
      branchId: branch.id,
      roleId: guestRole.id,
      sentByUserId: superAdmin.id,
      inviteeEmail: '*',
      inviteCode: 'TAMU-RAHMAN',
      inviteToken: 'invite-token-guest-rahman',
      deliveryMode: 'CODE',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      note: 'Undangan kode untuk tamu keluarga.',
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        branchId: branch.id,
        actorUserId: superAdmin.id,
        action: 'CREATE',
        entityType: 'FamilyBranch',
        entityId: branch.id,
        summary: 'Cabang keluarga Rahman dibuat.',
        afterSnapshot: {
          branch: branch.name,
          root: grandfather.fullName,
        },
      },
      {
        branchId: branch.id,
        actorUserId: superAdmin.id,
        action: 'CREATE',
        entityType: 'FamilyMember',
        entityId: father.id,
        summary: 'Anggota generasi kedua ditambahkan.',
        afterSnapshot: {
          fullName: father.fullName,
          generation: 2,
        },
      },
      {
        branchId: branch.id,
        actorUserId: superAdmin.id,
        action: 'INVITE',
        entityType: 'Invitation',
        entityId: inviteToMember.id,
        summary: 'Undangan anggota baru dibuat.',
        afterSnapshot: {
          role: memberRole.code,
          deliveryMode: 'LINK',
        },
      },
      {
        branchId: branch.id,
        actorUserId: superAdmin.id,
        action: 'INVITE',
        entityType: 'Invitation',
        entityId: inviteToGuest.id,
        summary: 'Undangan tamu keluarga dibuat.',
        afterSnapshot: {
          role: guestRole.code,
          deliveryMode: 'CODE',
        },
      },
    ],
  });

  console.log('Seed completed:', {
    branch: branch.name,
    roles: 4,
    members: 7,
    users: 4,
    accounts: {
      superAdmin: {
        email: 'superadmin@rumpun.local',
        password: 'SuperAdmin123!',
      },
      branchAdmin: {
        email: 'admin.cabang@rumpun.local',
        password: 'AdminCabang123!',
      },
      member: {
        email: 'anggota@rumpun.local',
        password: 'Anggota123!',
      },
      guest: {
        email: 'tamu@rumpun.local',
        password: 'Tamu123!',
      },
    },
  });
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
