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
- `http://localhost:5173` untuk UI frontend

## Database

- Schema Prisma berada di `backend/prisma/schema.prisma`.
- Migration awal berada di `backend/prisma/migrations/20260522130000_initial_schema/`.
- Seed data menyiapkan contoh keluarga tiga generasi untuk pengujian pohon silsilah.
