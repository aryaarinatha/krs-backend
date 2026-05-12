import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai seeding data...');

  await prisma.mahasiswa.deleteMany();
  await prisma.dosen.deleteMany();
  await prisma.user.deleteMany();

  const hash = (plain: string) => bcrypt.hashSync(plain, 10);

  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: hash('admin123'),
        namaLengkap: 'Admin Tata Usaha',
        role: UserRole.TATA_USAHA,
      },
      {
        username: 'dosen',
        password: hash('dosen123'),
        namaLengkap: 'Akun Dosen',
        role: UserRole.DOSEN,
      },
      {
        username: 'mahasiswa',
        password: hash('mahasiswa123'),
        namaLengkap: 'Akun Mahasiswa',
        role: UserRole.MAHASISWA,
      },
    ],
  });

  const dosen1 = await prisma.dosen.create({
    data: {
      nidn: '001',
      namaDosen: 'Arya Pratama',
      email: 'arya@example.com',
      noHp: '081111111111',
    },
  });

  const dosen2 = await prisma.dosen.create({
    data: {
      nidn: '002',
      namaDosen: 'Siti Rahma',
      email: 'siti@example.com',
      noHp: '082222222222',
    },
  });

  const dosen3 = await prisma.dosen.create({
    data: {
      nidn: '003',
      namaDosen: 'Budi Santoso',
      email: 'budi@example.com',
      noHp: '083333333333',
    },
  });

  await prisma.mahasiswa.createMany({
    data: [
      {
        nim: '2305551001',
        namaMahasiswa: 'Andi Pratama',
        prodi: 'Sistem Informasi',
        angkatan: 2023,
        dosenPaId: dosen1.id,
      },
      {
        nim: '2305551002',
        namaMahasiswa: 'Bima Saputra',
        prodi: 'Sistem Informasi',
        angkatan: 2023,
        dosenPaId: dosen1.id,
      },
      {
        nim: '2305551003',
        namaMahasiswa: 'Citra Lestari',
        prodi: 'Sistem Informasi',
        angkatan: 2023,
        dosenPaId: dosen2.id,
      },
      {
        nim: '2305551004',
        namaMahasiswa: 'Dewi Anggraini',
        prodi: 'Sistem Informasi',
        angkatan: 2023,
        dosenPaId: dosen2.id,
      },
      {
        nim: '2305551005',
        namaMahasiswa: 'Eka Wijaya',
        prodi: 'Sistem Informasi',
        angkatan: 2023,
        dosenPaId: dosen3.id,
      },
    ],
  });

  console.log('Seeding selesai.');
  console.log('Akun awal:');
  console.log('- admin / admin123 (TATA_USAHA)');
  console.log('- dosen / dosen123 (DOSEN)');
  console.log('- mahasiswa / mahasiswa123 (MAHASISWA)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
