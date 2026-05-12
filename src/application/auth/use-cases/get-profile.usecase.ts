import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { UserRepositoryPort } from '../../ports/user.repository.port';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }
    return {
      id: user.id,
      username: user.username,
      namaLengkap: user.namaLengkap,
      role: user.role,
    };
  }
}
