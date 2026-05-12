import { Injectable } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { UserEntity } from '../../domain/user/entities/user.entity';
import {
  CreateUserData,
  UpdateUserData,
  UserRepositoryPort,
} from '../../application/ports/user.repository.port';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(row: any): UserEntity {
    return new UserEntity({
      id: row.id,
      username: row.username,
      password: row.password,
      namaLengkap: row.namaLengkap,
      role: row.role as Role,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    const rows = await this.prisma.user.findMany({ orderBy: { id: 'asc' } });
    return rows.map((r) => this.toEntity(r));
  }

  async findById(id: number): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { username } });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const row = await this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        namaLengkap: data.namaLengkap,
        role: data.role,
      },
    });
    return this.toEntity(row);
  }

  async update(id: number, data: UpdateUserData): Promise<UserEntity> {
    const row = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.username !== undefined && { username: data.username }),
        ...(data.password !== undefined && { password: data.password }),
        ...(data.namaLengkap !== undefined && {
          namaLengkap: data.namaLengkap,
        }),
        ...(data.role !== undefined && { role: data.role }),
      },
    });
    return this.toEntity(row);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
