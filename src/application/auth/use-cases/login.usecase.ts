import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { Role } from '../../../common/enums/role.enum';
import { HasherPort } from '../../ports/hasher.port';
import { UserRepositoryPort } from '../../ports/user.repository.port';

export interface AuthenticatedUserData {
  id: number;
  username: string;
  namaLengkap: string;
  role: Role;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PROVIDER_TOKENS.HASHER_PORT)
    private readonly hasher: HasherPort,
  ) {}

  async execute(
    username: string,
    password: string,
  ): Promise<AuthenticatedUserData> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const valid = await this.hasher.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    return {
      id: user.id,
      username: user.username,
      namaLengkap: user.namaLengkap,
      role: user.role,
    };
  }
}
