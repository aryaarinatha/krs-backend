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
import { MahasiswaRepositoryPort } from '../../ports/mahasiswa.repository.port';

@Injectable()
export class UpdateDosenPaUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.MAHASISWA_REPOSITORY)
    private readonly mahasiswaRepository: MahasiswaRepositoryPort,
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(mahasiswaId: number, newDosenPaId: number) {
    const mahasiswa = await this.mahasiswaRepository.findById(mahasiswaId);
    if (!mahasiswa) {
      throw new NotFoundException('Mahasiswa tidak ditemukan');
    }

    const dosenBaru = await this.dosenRepository.findById(newDosenPaId);
    if (!dosenBaru) {
      throw new BadRequestException(
        'Dosen pembimbing akademik tidak ditemukan',
      );
    }

    const oldDosenPaId = mahasiswa.dosenPaId;
    const tidakBerubah = oldDosenPaId === newDosenPaId;

    const updated = tidakBerubah
      ? mahasiswa
      : await this.mahasiswaRepository.update(mahasiswaId, {
          dosenPaId: newDosenPaId,
        });

    await Promise.all([
      this.cache.del(CacheKeys.MAHASISWA_ALL),
      this.cache.del(CacheKeys.MAHASISWA_DETAIL(mahasiswaId)),
      this.cache.del(CacheKeys.DOSEN_MAHASISWA(oldDosenPaId)),
      this.cache.del(CacheKeys.DOSEN_MAHASISWA(newDosenPaId)),
      this.cache.del(CacheKeys.DOSEN_DETAIL(oldDosenPaId)),
      this.cache.del(CacheKeys.DOSEN_DETAIL(newDosenPaId)),
      this.cache.del(CacheKeys.DOSEN_ALL),
      this.cache.del(CacheKeys.PEMETAAN_PA_ALL),
    ]);

    return {
      mahasiswa: updated,
      tidakBerubah,
    };
  }
}
