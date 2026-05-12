import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import { DosenRepositoryPort } from '../../ports/dosen.repository.port';
import {
  CreateMahasiswaData,
  MahasiswaRepositoryPort,
} from '../../ports/mahasiswa.repository.port';

@Injectable()
export class CreateMahasiswaUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.MAHASISWA_REPOSITORY)
    private readonly mahasiswaRepository: MahasiswaRepositoryPort,
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(data: CreateMahasiswaData) {
    const existingNim = await this.mahasiswaRepository.findByNim(data.nim);
    if (existingNim) {
      throw new ConflictException('NIM sudah digunakan');
    }

    const dosen = await this.dosenRepository.findById(data.dosenPaId);
    if (!dosen) {
      throw new BadRequestException(
        'Dosen pembimbing akademik tidak ditemukan',
      );
    }

    const created = await this.mahasiswaRepository.create(data);

    await Promise.all([
      this.cache.del(CacheKeys.MAHASISWA_ALL),
      this.cache.del(CacheKeys.DOSEN_MAHASISWA(data.dosenPaId)),
      this.cache.del(CacheKeys.DOSEN_DETAIL(data.dosenPaId)),
      this.cache.del(CacheKeys.DOSEN_ALL),
      this.cache.del(CacheKeys.PEMETAAN_PA_ALL),
    ]);

    return created;
  }
}
