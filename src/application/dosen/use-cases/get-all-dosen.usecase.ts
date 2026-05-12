import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import {
  DosenListItem,
  DosenRepositoryPort,
} from '../../ports/dosen.repository.port';

@Injectable()
export class GetAllDosenUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(): Promise<DosenListItem[]> {
    const cacheKey = CacheKeys.DOSEN_ALL;
    const cached = await this.cache.get<DosenListItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.dosenRepository.findAll();
    await this.cache.set(cacheKey, data);
    return data;
  }
}
