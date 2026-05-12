import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { UserRepositoryPort } from '../../ports/user.repository.port';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: number, currentUserId: number) {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (existing.id === currentUserId) {
      throw new BadRequestException(
        'Anda tidak dapat menghapus akun yang sedang digunakan',
      );
    }

    await this.userRepository.delete(id);
  }
}
