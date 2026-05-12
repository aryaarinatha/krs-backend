import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import {
  MahasiswaRepositoryPort,
  MahasiswaWithDosenPa,
} from '../../ports/mahasiswa.repository.port';

@Injectable()
export class GetAllMahasiswaUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.MAHASISWA_REPOSITORY)
    private readonly mahasiswaRepository: MahasiswaRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(): Promise<MahasiswaWithDosenPa[]> {
    const cacheKey = CacheKeys.MAHASISWA_ALL;
    const cached = await this.cache.get<MahasiswaWithDosenPa[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.mahasiswaRepository.findAllWithDosenPa();
    await this.cache.set(cacheKey, data);
    return data;
  }
}
