import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import {
  DosenRepositoryPort,
  DosenWithBimbingan,
} from '../../ports/dosen.repository.port';

@Injectable()
export class GetDetailDosenUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(id: number): Promise<DosenWithBimbingan> {
    const cacheKey = CacheKeys.DOSEN_DETAIL(id);
    const cached = await this.cache.get<DosenWithBimbingan>(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.dosenRepository.findWithMahasiswaBimbingan(id);
    if (!data) {
      throw new NotFoundException('Dosen tidak ditemukan');
    }

    await this.cache.set(cacheKey, data);
    return data;
  }
}
