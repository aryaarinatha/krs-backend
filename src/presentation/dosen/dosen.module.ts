import { Module } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../common/constants/provider-tokens.constant';
import { DosenPrismaRepository } from '../../infrastructure/repositories/dosen-prisma.repository';
import { CreateDosenUseCase } from '../../application/dosen/use-cases/create-dosen.usecase';
import { GetAllDosenUseCase } from '../../application/dosen/use-cases/get-all-dosen.usecase';
import { GetDetailDosenUseCase } from '../../application/dosen/use-cases/get-detail-dosen.usecase';
import { UpdateDosenUseCase } from '../../application/dosen/use-cases/update-dosen.usecase';
import { DeleteDosenUseCase } from '../../application/dosen/use-cases/delete-dosen.usecase';
import { DosenController } from './dosen.controller';

@Module({
  controllers: [DosenController],
  providers: [
    {
      provide: PROVIDER_TOKENS.DOSEN_REPOSITORY,
      useClass: DosenPrismaRepository,
    },
    CreateDosenUseCase,
    GetAllDosenUseCase,
    GetDetailDosenUseCase,
    UpdateDosenUseCase,
    DeleteDosenUseCase,
  ],
  exports: [PROVIDER_TOKENS.DOSEN_REPOSITORY],
})
export class DosenModule {}
