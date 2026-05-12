import { Injectable } from '@nestjs/common';
import { DosenEntity } from '../../domain/dosen/entities/dosen.entity';
import {
  CreateDosenData,
  DosenListItem,
  DosenRepositoryPort,
  DosenWithBimbingan,
  UpdateDosenData,
} from '../../application/ports/dosen.repository.port';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DosenPrismaRepository implements DosenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(row: any): DosenEntity {
    return new DosenEntity({
      id: row.id,
      nidn: row.nidn,
      namaDosen: row.namaDosen,
      email: row.email,
      noHp: row.noHp,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findAll(): Promise<DosenListItem[]> {
    const rows = await this.prisma.dosen.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: { select: { mahasiswaBimbingan: true } },
      },
    });

    return rows.map((r) => ({
      ...this.toEntity(r),
      jumlahMahasiswaBimbingan: r._count.mahasiswaBimbingan,
    }));
  }

  async findById(id: number): Promise<DosenEntity | null> {
    const row = await this.prisma.dosen.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findByNidn(nidn: string): Promise<DosenEntity | null> {
    const row = await this.prisma.dosen.findUnique({ where: { nidn } });
    return row ? this.toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<DosenEntity | null> {
    const row = await this.prisma.dosen.findUnique({ where: { email } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreateDosenData): Promise<DosenEntity> {
    const row = await this.prisma.dosen.create({
      data: {
        nidn: data.nidn,
        namaDosen: data.namaDosen,
        email: data.email,
        noHp: data.noHp ?? null,
      },
    });
    return this.toEntity(row);
  }

  async update(id: number, data: UpdateDosenData): Promise<DosenEntity> {
    const row = await this.prisma.dosen.update({
      where: { id },
      data: {
        ...(data.nidn !== undefined && { nidn: data.nidn }),
        ...(data.namaDosen !== undefined && { namaDosen: data.namaDosen }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.noHp !== undefined && { noHp: data.noHp }),
      },
    });
    return this.toEntity(row);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.dosen.delete({ where: { id } });
  }

  async countMahasiswaBimbingan(dosenId: number): Promise<number> {
    return this.prisma.mahasiswa.count({ where: { dosenPaId: dosenId } });
  }

  async findWithMahasiswaBimbingan(
    id: number,
  ): Promise<DosenWithBimbingan | null> {
    const row = await this.prisma.dosen.findUnique({
      where: { id },
      include: {
        mahasiswaBimbingan: {
          orderBy: { nim: 'asc' },
          select: {
            id: true,
            nim: true,
            namaMahasiswa: true,
            prodi: true,
            angkatan: true,
          },
        },
      },
    });

    if (!row) return null;

    return {
      ...this.toEntity(row),
      mahasiswaBimbingan: row.mahasiswaBimbingan,
    };
  }

  async findAllWithMahasiswaBimbingan(): Promise<DosenWithBimbingan[]> {
    const rows = await this.prisma.dosen.findMany({
      orderBy: { id: 'asc' },
      include: {
        mahasiswaBimbingan: {
          orderBy: { nim: 'asc' },
          select: {
            id: true,
            nim: true,
            namaMahasiswa: true,
            prodi: true,
            angkatan: true,
          },
        },
      },
    });

    return rows.map((r) => ({
      ...this.toEntity(r),
      mahasiswaBimbingan: r.mahasiswaBimbingan,
    }));
  }
}
