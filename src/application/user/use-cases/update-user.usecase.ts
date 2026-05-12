import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { Role } from '../../../common/enums/role.enum';
import { HasherPort } from '../../ports/hasher.port';
import { UserRepositoryPort } from '../../ports/user.repository.port';

export interface UpdateUserInput {
  username?: string;
  password?: string;
  namaLengkap?: string;
  role?: Role;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PROVIDER_TOKENS.HASHER_PORT)
    private readonly hasher: HasherPort,
  ) {}

  async execute(id: number, data: UpdateUserInput) {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (data.username && data.username !== existing.username) {
      const dup = await this.userRepository.findByUsername(data.username);
      if (dup && dup.id !== id) {
        throw new ConflictException('Username sudah digunakan');
      }
    }

    const payload: UpdateUserInput = {
      ...(data.username !== undefined && { username: data.username }),
      ...(data.namaLengkap !== undefined && { namaLengkap: data.namaLengkap }),
      ...(data.role !== undefined && { role: data.role }),
    };

    if (data.password) {
      payload.password = await this.hasher.hash(data.password);
    }

    const user = await this.userRepository.update(id, payload);

    return {
      id: user.id,
      username: user.username,
      namaLengkap: user.namaLengkap,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
