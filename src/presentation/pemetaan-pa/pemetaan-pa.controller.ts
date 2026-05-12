import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { GetPemetaanPaUseCase } from '../../application/pemetaan-pa/use-cases/get-pemetaan-pa.usecase';
import { GetMahasiswaByDosenUseCase } from '../../application/pemetaan-pa/use-cases/get-mahasiswa-by-dosen.usecase';
import { UpdateDosenPaUseCase } from '../../application/pemetaan-pa/use-cases/update-dosen-pa.usecase';
import { UpdatePemetaanPaDto } from './dto/update-pemetaan-pa.dto';

@Controller('pemetaan-pa')
@UseGuards(SessionAuthGuard, RolesGuard)
export class PemetaanPaController {
  constructor(
    private readonly getPemetaanPaUseCase: GetPemetaanPaUseCase,
    private readonly getMahasiswaByDosenUseCase: GetMahasiswaByDosenUseCase,
    private readonly updateDosenPaUseCase: UpdateDosenPaUseCase,
  ) {}

  @Get()
  @Roles(Role.TATA_USAHA, Role.DOSEN, Role.MAHASISWA)
  async findAll() {
    const data = await this.getPemetaanPaUseCase.execute();
    return ResponseHelper.success(
      'Data pemetaan dosen PA berhasil diambil',
      data,
    );
  }

  @Get('dosen/:dosenId')
  @Roles(Role.TATA_USAHA, Role.DOSEN, Role.MAHASISWA)
  async findByDosen(@Param('dosenId', ParseIntPipe) dosenId: number) {
    const data = await this.getMahasiswaByDosenUseCase.execute(dosenId);
    return ResponseHelper.success(
      'Mahasiswa bimbingan berhasil diambil',
      data,
    );
  }

  @Patch('mahasiswa/:mahasiswaId')
  @Roles(Role.TATA_USAHA)
  async updateDosenPa(
    @Param('mahasiswaId', ParseIntPipe) mahasiswaId: number,
    @Body() body: UpdatePemetaanPaDto,
  ) {
    const result = await this.updateDosenPaUseCase.execute(
      mahasiswaId,
      body.dosenPaId,
    );

    const message = result.tidakBerubah
      ? 'Dosen PA tidak berubah'
      : 'Dosen pembimbing akademik berhasil diperbarui';

    return ResponseHelper.success(message, result.mahasiswa);
  }
}
