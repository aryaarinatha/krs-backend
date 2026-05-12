import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { UserRepositoryPort } from '../../ports/user.repository.port';

@Injectable()
export class GetDetailUserUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
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
