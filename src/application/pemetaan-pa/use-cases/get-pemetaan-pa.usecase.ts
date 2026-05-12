import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import { DosenRepositoryPort } from '../../ports/dosen.repository.port';

export interface PemetaanPaItem {
  id: number;
  nidn: string;
  namaDosen: string;
  email: string;
  noHp?: string | null;
  jumlahMahasiswaBimbingan: number;
  mahasiswaBimbingan: Array<{
    id: number;
    nim: string;
    namaMahasiswa: string;
    prodi: string;
    angkatan: number;
  }>;
}

@Injectable()
export class GetPemetaanPaUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(): Promise<PemetaanPaItem[]> {
    const cacheKey = CacheKeys.PEMETAAN_PA_ALL;
    const cached = await this.cache.get<PemetaanPaItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const dosenList = await this.dosenRepository.findAllWithMahasiswaBimbingan();
    const result: PemetaanPaItem[] = dosenList.map((d) => ({
      id: d.id,
      nidn: d.nidn,
      namaDosen: d.namaDosen,
      email: d.email,
      noHp: d.noHp ?? null,
      jumlahMahasiswaBimbingan: d.mahasiswaBimbingan.length,
      mahasiswaBimbingan: d.mahasiswaBimbingan,
    }));

    await this.cache.set(cacheKey, result);
    return result;
  }
}
