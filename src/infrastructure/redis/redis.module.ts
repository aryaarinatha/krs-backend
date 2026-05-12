import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PROVIDER_TOKENS } from '../../common/constants/provider-tokens.constant';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RedisCacheService,
    {
      provide: PROVIDER_TOKENS.CACHE_PORT,
      useExisting: RedisCacheService,
    },
  ],
  exports: [PROVIDER_TOKENS.CACHE_PORT, RedisCacheService],
})
export class RedisModule {}
