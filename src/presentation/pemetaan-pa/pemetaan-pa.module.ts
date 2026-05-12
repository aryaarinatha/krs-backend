import { Module } from '@nestjs/common';
import { DosenModule } from '../dosen/dosen.module';
import { MahasiswaModule } from '../mahasiswa/mahasiswa.module';
import { GetPemetaanPaUseCase } from '../../application/pemetaan-pa/use-cases/get-pemetaan-pa.usecase';
import { GetMahasiswaByDosenUseCase } from '../../application/pemetaan-pa/use-cases/get-mahasiswa-by-dosen.usecase';
import { UpdateDosenPaUseCase } from '../../application/pemetaan-pa/use-cases/update-dosen-pa.usecase';
import { PemetaanPaController } from './pemetaan-pa.controller';

@Module({
  imports: [DosenModule, MahasiswaModule],
  controllers: [PemetaanPaController],
  providers: [
    GetPemetaanPaUseCase,
    GetMahasiswaByDosenUseCase,
    UpdateDosenPaUseCase,
  ],
})
export class PemetaanPaModule {}
