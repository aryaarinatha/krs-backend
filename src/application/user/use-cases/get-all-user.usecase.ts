import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { UserRepositoryPort } from '../../ports/user.repository.port';

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute() {
    const users = await this.userRepository.findAll();
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      namaLengkap: u.namaLengkap,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }
}
