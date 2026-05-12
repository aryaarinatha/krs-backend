import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../../common/constants/provider-tokens.constant';
import { CacheKeys } from '../../../common/constants/cache-keys.constant';
import { CachePort } from '../../ports/cache.port';
import {
  CreateDosenData,
  DosenRepositoryPort,
} from '../../ports/dosen.repository.port';

@Injectable()
export class CreateDosenUseCase {
  constructor(
    @Inject(PROVIDER_TOKENS.DOSEN_REPOSITORY)
    private readonly dosenRepository: DosenRepositoryPort,
    @Inject(PROVIDER_TOKENS.CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async execute(data: CreateDosenData) {
    const existingNidn = await this.dosenRepository.findByNidn(data.nidn);
    if (existingNidn) {
      throw new ConflictException('NIDN sudah digunakan');
    }

    const existingEmail = await this.dosenRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new ConflictException('Email sudah digunakan');
    }

    const created = await this.dosenRepository.create(data);

    await Promise.all([
      this.cache.del(CacheKeys.DOSEN_ALL),
      this.cache.del(CacheKeys.PEMETAAN_PA_ALL),
    ]);

    return created;
  }
}
