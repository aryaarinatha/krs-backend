import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { Role } from '../../../common/enums/role.enum';
import { HasherPort } from '../../ports/hasher.port';
import { UserRepositoryPort } from '../../ports/user.repository.port';

export interface CreateUserInput {
  username: string;
  password: string;
  namaLengkap: string;
  role: Role;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PROVIDER_TOKENS.HASHER_PORT)
    private readonly hasher: HasherPort,
  ) {}

  async execute(data: CreateUserInput) {
    const existing = await this.userRepository.findByUsername(data.username);
    if (existing) {
      throw new ConflictException('Username sudah digunakan');
    }

    const hashed = await this.hasher.hash(data.password);

    const user = await this.userRepository.create({
      username: data.username,
      password: hashed,
      namaLengkap: data.namaLengkap,
      role: data.role,
    });

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
