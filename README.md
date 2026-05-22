# Rumpun

Rumpun adalah pondasi awal untuk aplikasi silsilah keluarga digital.

## Struktur

- `frontend/` - aplikasi React dengan Vite
- `backend/` - API Node.js dengan Express
- `database/` - skema, migrasi, dan seed data
- `docs/` - dokumentasi produk dan teknis
- `docker-compose.yml` - PostgreSQL lokal

## Prasyarat

- Node.js 23+
- npm 10+
- Docker Desktop atau Docker Engine

## Setup Lokal

1. Salin file contoh environment:
   - `cp .env.example .env`
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Pasang dependensi:
   - `npm install`
3. Jalankan PostgreSQL lokal:
   - `docker compose up -d`
4. Jalankan seluruh aplikasi:
   - `npm run dev`

## Skrip

- `npm run dev` menjalankan frontend dan backend bersama.
- `npm run build` membuat build frontend.
- `npm run lint` memeriksa kualitas kode.
- `npm run format:check` memeriksa format file.
- `npm run db:generate` membuat Prisma Client dari schema database.
- `npm run db:migrate` menjalankan migrasi database lokal.
- `npm run db:seed` mengisi data contoh keluarga dan role dasar.

## Endpoint Awal

- `GET http://localhost:3001/health`
- `GET http://localhost:3001/api/health`
- `POST http://localhost:3001/api/auth/login`
- `POST http://localhost:3001/api/auth/logout`
- `GET http://localhost:3001/api/auth/me`
- `POST http://localhost:3001/api/auth/invitations/accept`
- `POST http://localhost:3001/api/auth/password-reset/request`
- `POST http://localhost:3001/api/auth/password-reset/confirm`
- `POST http://localhost:3001/api/admin/invitations`
- `GET http://localhost:3001/admin`
- `http://localhost:5173` untuk UI frontend

Catatan: endpoint yang dilindungi memakai header `Authorization: Bearer <token>`.

## Akun Contoh

- `superadmin@rumpun.local` / `SuperAdmin123!`
- `admin.cabang@rumpun.local` / `AdminCabang123!`
- `anggota@rumpun.local` / `Anggota123!`
- `tamu@rumpun.local` / `Tamu123!`

## Database

- Schema Prisma berada di `backend/prisma/schema.prisma`.
- Migration bertahap berada di `backend/prisma/migrations/`.
- Seed data menyiapkan contoh keluarga tiga generasi, role RBAC, akun login, dan undangan uji.
