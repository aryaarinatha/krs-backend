import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import {
  DosenRepositoryPort,
  UpdateDosenData,
} from '../../ports/dosen.repository.port';

@Injectable()
export class UpdateDosenUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(id: number, data: UpdateDosenData) {
    const existing = await this.dosenRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Dosen tidak ditemukan');
    }

    if (data.nidn && data.nidn !== existing.nidn) {
      const dup = await this.dosenRepository.findByNidn(data.nidn);
      if (dup && dup.id !== id) {
        throw new ConflictException('NIDN sudah digunakan');
      }
    }

    if (data.email && data.email !== existing.email) {
      const dup = await this.dosenRepository.findByEmail(data.email);
      if (dup && dup.id !== id) {
        throw new ConflictException('Email sudah digunakan');
      }
    }

    const updated = await this.dosenRepository.update(id, data);

    await Promise.all([
      this.cache.del(CacheKeys.DOSEN_ALL),
      this.cache.del(CacheKeys.DOSEN_DETAIL(id)),
      this.cache.del(CacheKeys.DOSEN_MAHASISWA(id)),
      this.cache.del(CacheKeys.PEMETAAN_PA_ALL),
      this.cache.del(CacheKeys.MAHASISWA_ALL),
      this.cache.delPattern('mahasiswa:detail:*'),
    ]);

    return updated;
  }
}
