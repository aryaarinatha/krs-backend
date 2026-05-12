import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateMahasiswaUseCase } from '../../application/mahasiswa/use-cases/create-mahasiswa.usecase';
import { GetAllMahasiswaUseCase } from '../../application/mahasiswa/use-cases/get-all-mahasiswa.usecase';
import { GetDetailMahasiswaUseCase } from '../../application/mahasiswa/use-cases/get-detail-mahasiswa.usecase';
import { UpdateMahasiswaUseCase } from '../../application/mahasiswa/use-cases/update-mahasiswa.usecase';
import { DeleteMahasiswaUseCase } from '../../application/mahasiswa/use-cases/delete-mahasiswa.usecase';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';

@Controller('mahasiswa')
@UseGuards(SessionAuthGuard, RolesGuard)
export class MahasiswaController {
  constructor(
    private readonly createMahasiswaUseCase: CreateMahasiswaUseCase,
    private readonly getAllMahasiswaUseCase: GetAllMahasiswaUseCase,
    private readonly getDetailMahasiswaUseCase: GetDetailMahasiswaUseCase,
    private readonly updateMahasiswaUseCase: UpdateMahasiswaUseCase,
    private readonly deleteMahasiswaUseCase: DeleteMahasiswaUseCase,
  ) {}

  @Get()
  @Roles(Role.TATA_USAHA, Role.DOSEN, Role.MAHASISWA)
  async findAll() {
    const data = await this.getAllMahasiswaUseCase.execute();
    return ResponseHelper.success('Data mahasiswa berhasil diambil', data);
  }

  @Get(':id')
  @Roles(Role.TATA_USAHA, Role.DOSEN, Role.MAHASISWA)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.getDetailMahasiswaUseCase.execute(id);
    return ResponseHelper.success('Detail mahasiswa berhasil diambil', data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.TATA_USAHA)
  async create(@Body() body: CreateMahasiswaDto) {
    const data = await this.createMahasiswaUseCase.execute(body);
    return ResponseHelper.success('Data mahasiswa berhasil dibuat', data);
  }

  @Patch(':id')
  @Roles(Role.TATA_USAHA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMahasiswaDto,
  ) {
    const data = await this.updateMahasiswaUseCase.execute(id, body);
    return ResponseHelper.success('Data mahasiswa berhasil diperbarui', data);
  }

  @Delete(':id')
  @Roles(Role.TATA_USAHA)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteMahasiswaUseCase.execute(id);
    return ResponseHelper.success('Data mahasiswa berhasil dihapus');
  }
}
