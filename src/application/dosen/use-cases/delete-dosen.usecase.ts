import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import { DosenRepositoryPort } from '../../ports/dosen.repository.port';

@Injectable()
export class DeleteDosenUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(id: number) {
    const existing = await this.dosenRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Dosen tidak ditemukan');
    }

    const jumlahBimbingan = await this.dosenRepository.countMahasiswaBimbingan(
      id,
    );
    if (jumlahBimbingan > 0) {
      throw new BadRequestException(
        'Dosen tidak dapat dihapus karena masih memiliki mahasiswa bimbingan',
      );
    }

    await this.dosenRepository.delete(id);

    await Promise.all([
      this.cache.del(CacheKeys.DOSEN_ALL),
      this.cache.del(CacheKeys.DOSEN_DETAIL(id)),
      this.cache.del(CacheKeys.DOSEN_MAHASISWA(id)),
      this.cache.del(CacheKeys.PEMETAAN_PA_ALL),
    ]);
  }
}
