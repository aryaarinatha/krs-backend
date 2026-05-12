# Backend Sistem KRS (NestJS + Prisma + MySQL + Redis)

Backend menggunakan NestJS dengan pendekatan Clean Architecture ringan:

- **Domain** : entity murni (tidak bergantung pada framework).
- **Application** : use case + port (repository & cache interface).
- **Infrastructure** : Prisma, Redis, dan implementasi repository.
- **Presentation** : Controller, DTO, dan NestJS Module.

## Prasyarat

- Node.js 18+
- MySQL 8+
- Docker (untuk Redis)

## Jalankan Redis (Docker)

```bash
docker run --name redis-krs -p 6379:6379 -d redis
docker ps
```

Mengelola container Redis:

```bash
docker stop redis-krs
docker start redis-krs
docker rm -f redis-krs
```

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Sesuaikan `DATABASE_URL` di `.env`. Buat database `db_krs` di MySQL.

## Prisma

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

## Menjalankan

```bash
npm run start:dev
```

Backend tersedia di `http://localhost:3000`.

## Endpoint

### Dosen
- `GET /dosen`
- `GET /dosen/:id`
- `POST /dosen`
- `PATCH /dosen/:id`
- `DELETE /dosen/:id`

### Mahasiswa
- `GET /mahasiswa`
- `GET /mahasiswa/:id`
- `POST /mahasiswa`
- `PATCH /mahasiswa/:id`
- `DELETE /mahasiswa/:id`

### Pemetaan PA
- `GET /pemetaan-pa`
- `GET /pemetaan-pa/dosen/:dosenId`
- `PATCH /pemetaan-pa/mahasiswa/:mahasiswaId`
