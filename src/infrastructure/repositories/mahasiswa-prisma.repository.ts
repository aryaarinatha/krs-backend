import { Injectable } from '@nestjs/common';
import { MahasiswaEntity } from '../../domain/mahasiswa/entities/mahasiswa.entity';
import {
  CreateMahasiswaData,
  MahasiswaRepositoryPort,
  MahasiswaWithDosenPa,
  UpdateMahasiswaData,
} from '../../application/ports/mahasiswa.repository.port';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MahasiswaPrismaRepository implements MahasiswaRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(row: any): MahasiswaEntity {
    return new MahasiswaEntity({
      id: row.id,
      nim: row.nim,
      namaMahasiswa: row.namaMahasiswa,
      prodi: row.prodi,
      angkatan: row.angkatan,
      dosenPaId: row.dosenPaId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toEntityWithDosenPa(row: any): MahasiswaWithDosenPa {
    return {
      ...this.toEntity(row),
      dosenPa: {
        id: row.dosenPa.id,
        nidn: row.dosenPa.nidn,
        namaDosen: row.dosenPa.namaDosen,
        email: row.dosenPa.email,
        noHp: row.dosenPa.noHp,
      },
    };
  }

  async findAll(): Promise<MahasiswaWithDosenPa[]> {
    return this.findAllWithDosenPa();
  }

  async findById(id: number): Promise<MahasiswaEntity | null> {
    const row = await this.prisma.mahasiswa.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findByNim(nim: string): Promise<MahasiswaEntity | null> {
    const row = await this.prisma.mahasiswa.findUnique({ where: { nim } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreateMahasiswaData): Promise<MahasiswaEntity> {
    const row = await this.prisma.mahasiswa.create({
      data: {
        nim: data.nim,
        namaMahasiswa: data.namaMahasiswa,
        prodi: data.prodi,
        angkatan: data.angkatan,
        dosenPaId: data.dosenPaId,
      },
    });
    return this.toEntity(row);
  }

  async update(
    id: number,
    data: UpdateMahasiswaData,
  ): Promise<MahasiswaEntity> {
    const row = await this.prisma.mahasiswa.update({
      where: { id },
      data: {
        ...(data.nim !== undefined && { nim: data.nim }),
        ...(data.namaMahasiswa !== undefined && {
          namaMahasiswa: data.namaMahasiswa,
        }),
        ...(data.prodi !== undefined && { prodi: data.prodi }),
        ...(data.angkatan !== undefined && { angkatan: data.angkatan }),
        ...(data.dosenPaId !== undefined && { dosenPaId: data.dosenPaId }),
      },
    });
    return this.toEntity(row);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.mahasiswa.delete({ where: { id } });
  }

  async findByDosenPaId(dosenId: number): Promise<MahasiswaEntity[]> {
    const rows = await this.prisma.mahasiswa.findMany({
      where: { dosenPaId: dosenId },
      orderBy: { nim: 'asc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findAllWithDosenPa(): Promise<MahasiswaWithDosenPa[]> {
    const rows = await this.prisma.mahasiswa.findMany({
      orderBy: { id: 'asc' },
      include: {
        dosenPa: {
          select: {
            id: true,
            nidn: true,
            namaDosen: true,
            email: true,
            noHp: true,
          },
        },
      },
    });
    return rows.map((r) => this.toEntityWithDosenPa(r));
  }

  async findDetailWithDosenPa(
    id: number,
  ): Promise<MahasiswaWithDosenPa | null> {
    const row = await this.prisma.mahasiswa.findUnique({
      where: { id },
      include: {
        dosenPa: {
          select: {
            id: true,
            nidn: true,
            namaDosen: true,
            email: true,
            noHp: true,
          },
        },
      },
    });
    return row ? this.toEntityWithDosenPa(row) : null;
  }
}
