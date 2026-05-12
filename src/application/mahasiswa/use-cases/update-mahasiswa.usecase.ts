import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import { DosenRepositoryPort } from '../../ports/dosen.repository.port';
import {
  MahasiswaRepositoryPort,
  UpdateMahasiswaData,
} from '../../ports/mahasiswa.repository.port';

@Injectable()
export class UpdateMahasiswaUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.MAHASISWA_REPOSITORY)
    private readonly mahasiswaRepository: MahasiswaRepositoryPort,
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(id: number, data: UpdateMahasiswaData) {
    const existing = await this.mahasiswaRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Mahasiswa tidak ditemukan');
    }

    if (data.nim && data.nim !== existing.nim) {
      const dup = await this.mahasiswaRepository.findByNim(data.nim);
      if (dup && dup.id !== id) {
        throw new ConflictException('NIM sudah digunakan');
      }
    }

    if (data.dosenPaId && data.dosenPaId !== existing.dosenPaId) {
      const dosen = await this.dosenRepository.findById(data.dosenPaId);
      if (!dosen) {
        throw new BadRequestException(
          'Dosen pembimbing akademik tidak ditemukan',
        );
      }
    }

    const updated = await this.mahasiswaRepository.update(id, data);

    const oldDosenPaId = existing.dosenPaId;
    const newDosenPaId = data.dosenPaId ?? existing.dosenPaId;

    await Promise.all([
      this.cache.del(CacheKeys.MAHASISWA_ALL),
      this.cache.del(CacheKeys.MAHASISWA_DETAIL(id)),
      this.cache.del(CacheKeys.DOSEN_MAHASISWA(oldDosenPaId)),
      this.cache.del(CacheKeys.DOSEN_MAHASISWA(newDosenPaId)),
      this.cache.del(CacheKeys.DOSEN_DETAIL(oldDosenPaId)),
      this.cache.del(CacheKeys.DOSEN_DETAIL(newDosenPaId)),
      this.cache.del(CacheKeys.DOSEN_ALL),
      this.cache.del(CacheKeys.PEMETAAN_PA_ALL),
    ]);

    return updated;
  }
}
