import { Module } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../common/constants/provider-tokens.constant';
import { UserPrismaRepository } from '../../infrastructure/repositories/user-prisma.repository';
import { LoginUseCase } from '../../application/auth/use-cases/login.usecase';
import { GetProfileUseCase } from '../../application/auth/use-cases/get-profile.usecase';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: PROVIDER_TOKENS.USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    LoginUseCase,
    GetProfileUseCase,
  ],
  exports: [PROVIDER_TOKENS.USER_REPOSITORY],
})
export class AuthModule {}
