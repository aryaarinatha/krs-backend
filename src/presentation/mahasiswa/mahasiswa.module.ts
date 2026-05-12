import { Module } from '@nestjs/common';
import { PROVIDER_TOKENS } from '../../common/constants/provider-tokens.constant';
import { MahasiswaPrismaRepository } from '../../infrastructure/repositories/mahasiswa-prisma.repository';
import { CreateMahasiswaUseCase } from '../../application/mahasiswa/use-cases/create-mahasiswa.usecase';
import { GetAllMahasiswaUseCase } from '../../application/mahasiswa/use-cases/get-all-mahasiswa.usecase';
import { GetDetailMahasiswaUseCase } from '../../application/mahasiswa/use-cases/get-detail-mahasiswa.usecase';
import { UpdateMahasiswaUseCase } from '../../application/mahasiswa/use-cases/update-mahasiswa.usecase';
import { DeleteMahasiswaUseCase } from '../../application/mahasiswa/use-cases/delete-mahasiswa.usecase';
import { MahasiswaController } from './mahasiswa.controller';
import { DosenModule } from '../dosen/dosen.module';

@Module({
  imports: [DosenModule],
  controllers: [MahasiswaController],
  providers: [
    {
      provide: PROVIDER_TOKENS.MAHASISWA_REPOSITORY,
      useClass: MahasiswaPrismaRepository,
    },
    CreateMahasiswaUseCase,
    GetAllMahasiswaUseCase,
    GetDetailMahasiswaUseCase,
    UpdateMahasiswaUseCase,
    DeleteMahasiswaUseCase,
  ],
  exports: [PROVIDER_TOKENS.MAHASISWA_REPOSITORY],
})
export class MahasiswaModule {}
