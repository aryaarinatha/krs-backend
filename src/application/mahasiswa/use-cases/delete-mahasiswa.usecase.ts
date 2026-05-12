import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import { MahasiswaRepositoryPort } from '../../ports/mahasiswa.repository.port';

@Injectable()
export class DeleteMahasiswaUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.MAHASISWA_REPOSITORY)
    private readonly mahasiswaRepository: MahasiswaRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(id: number) {
    const existing = await this.mahasiswaRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Mahasiswa tidak ditemukan');
    }

    await this.mahasiswaRepository.delete(id);

    await Promise.all([
      this.cache.del(CacheKeys.MAHASISWA_ALL),
      this.cache.del(CacheKeys.MAHASISWA_DETAIL(id)),
      this.cache.del(CacheKeys.DOSEN_MAHASISWA(existing.dosenPaId)),
      this.cache.del(CacheKeys.DOSEN_DETAIL(existing.dosenPaId)),
      this.cache.del(CacheKeys.DOSEN_ALL),
      this.cache.del(CacheKeys.PEMETAAN_PA_ALL),
    ]);
  }
}
