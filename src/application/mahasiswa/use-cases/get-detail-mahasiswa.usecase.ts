import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import {
  MahasiswaRepositoryPort,
  MahasiswaWithDosenPa,
} from '../../ports/mahasiswa.repository.port';

@Injectable()
export class GetDetailMahasiswaUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.MAHASISWA_REPOSITORY)
    private readonly mahasiswaRepository: MahasiswaRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(id: number): Promise<MahasiswaWithDosenPa> {
    const cacheKey = CacheKeys.MAHASISWA_DETAIL(id);
    const cached = await this.cache.get<MahasiswaWithDosenPa>(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.mahasiswaRepository.findDetailWithDosenPa(id);
    if (!data) {
      throw new NotFoundException('Mahasiswa tidak ditemukan');
    }

    await this.cache.set(cacheKey, data);
    return data;
  }
}
