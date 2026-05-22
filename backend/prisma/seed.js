import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required for Prisma seed.');
}

const prisma = new PrismaClient();

const encrypt = (value) => Buffer.from(`enc:${value}`, 'utf8');
const makePairKey = (firstId, secondId) =>
  [firstId, secondId].sort().join('::');

async function main() {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.spouseRelation.deleteMany(),
    prisma.parentChildRelation.deleteMany(),
    prisma.familyMemberSensitiveData.deleteMany(),
    prisma.sessionConfig.deleteMany(),
    prisma.notificationPreference.deleteMany(),
    prisma.invitation.deleteMany(),
    prisma.user.deleteMany(),
    prisma.familyMember.deleteMany(),
    prisma.familyBranch.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  const roles = await prisma.$transaction([
    prisma.role.create({
      data: {
        code: 'ADMIN',
        name: 'Administrator',
        description: 'Mengelola data keluarga, anggota, dan akses sistem.',
      },
    }),
    prisma.role.create({
      data: {
        code: 'EDITOR',
        name: 'Editor Keluarga',
        description: 'Bisa menambah dan memperbarui data anggota.',
      },
    }),
    prisma.role.create({
      data: {
        code: 'VIEWER',
        name: 'Pembaca',
        description: 'Hanya melihat data keluarga dan pohon silsilah.',
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

  const admin = await prisma.user.create({
    data: {
      branchId: branch.id,
      roleId: roles[0].id,
      memberId: father.id,
      email: 'admin@rumpun.local',
      displayName: 'Admin Rumpun',
      passwordHash: '$2b$10$placeholder.hash.for.seed.only',
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
          channels: ['IN_APP', 'EMAIL'],
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
      roleId: roles[1].id,
      memberId: mother.id,
      email: 'editor@rumpun.local',
      displayName: 'Editor Rumpun',
      passwordHash: '$2b$10$placeholder.hash.for.seed.only',
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
          channels: ['IN_APP'],
          familyUpdates: true,
          birthdayReminders: true,
          relationRequests: true,
          invitationAlerts: false,
          digestEnabled: true,
        },
      },
    },
  });

  await prisma.invitation.create({
    data: {
      branchId: branch.id,
      roleId: roles[2].id,
      sentByUserId: admin.id,
      inviteeEmail: 'keluarga-baru@example.com',
      inviteToken: 'invite-token-rumpun-001',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      note: 'Undangan akses baca untuk anggota keluarga baru.',
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        branchId: branch.id,
        actorUserId: admin.id,
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
        actorUserId: admin.id,
        action: 'CREATE',
        entityType: 'FamilyMember',
        entityId: father.id,
        summary: 'Anggota generasi kedua ditambahkan.',
        afterSnapshot: {
          fullName: father.fullName,
          generation: 2,
        },
      },
    ],
  });

  console.log('Seed completed:', {
    branch: branch.name,
    roles: roles.length,
    members: 6,
    users: 2,
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
