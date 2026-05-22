# Arsitektur Awal

Rumpun disusun sebagai monorepo sederhana dengan tiga lapisan utama:

1. `frontend/` menyajikan UI berbasis React dan Vite.
2. `backend/` menyediakan API Express dan endpoint kesehatan.
3. `database/` menyimpan migrasi, seed, dan artefak skema untuk PostgreSQL lokal.

Frontend berbicara ke backend melalui proxy `/api` saat development, sehingga alur lokal tetap sederhana.

