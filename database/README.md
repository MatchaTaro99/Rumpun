# Database

Folder ini disiapkan untuk migrasi, seed data, dan artefak skema database.

Implementasi Prisma utama saat ini ada di `backend/prisma/`.

- `migrations/` untuk perubahan skema bertahap
- `seeds/` untuk data awal lokal
- `schema/` untuk referensi model atau dump terstruktur bila dibutuhkan

Skema saat ini sudah mencakup tabel auth untuk sesi login, token reset password, undangan, dan log audit dasar.
