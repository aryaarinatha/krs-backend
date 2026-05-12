import { Global, Module } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../common/constants/provider-tokens.constant';
import { BcryptHasherService } from './bcrypt-hasher.service';

@Global()
@Module({
  providers: [
    BcryptHasherService,
    {
      provide: PROVIDER_TOKENS.HASHER_PORT,
      useExisting: BcryptHasherService,
    },
  ],
  exports: [PROVIDER_TOKENS.HASHER_PORT],
})
export class AuthInfrastructureModule {}
