import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import {
  DosenRepositoryPort,
  DosenWithBimbingan,
} from '../../ports/dosen.repository.port';

@Injectable()
export class GetMahasiswaByDosenUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(dosenId: number): Promise<DosenWithBimbingan> {
    const cacheKey = CacheKeys.DOSEN_MAHASISWA(dosenId);
    const cached = await this.cache.get<DosenWithBimbingan>(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.dosenRepository.findWithMahasiswaBimbingan(dosenId);
    if (!data) {
      throw new NotFoundException('Dosen tidak ditemukan');
    }

    await this.cache.set(cacheKey, data);
    return data;
  }
}
