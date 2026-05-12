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
import { CreateDosenUseCase } from '../../application/dosen/use-cases/create-dosen.usecase';
import { GetAllDosenUseCase } from '../../application/dosen/use-cases/get-all-dosen.usecase';
import { GetDetailDosenUseCase } from '../../application/dosen/use-cases/get-detail-dosen.usecase';
import { UpdateDosenUseCase } from '../../application/dosen/use-cases/update-dosen.usecase';
import { DeleteDosenUseCase } from '../../application/dosen/use-cases/delete-dosen.usecase';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';

@Controller('dosen')
@UseGuards(SessionAuthGuard, RolesGuard)
export class DosenController {
  constructor(
    private readonly createDosenUseCase: CreateDosenUseCase,
    private readonly getAllDosenUseCase: GetAllDosenUseCase,
    private readonly getDetailDosenUseCase: GetDetailDosenUseCase,
    private readonly updateDosenUseCase: UpdateDosenUseCase,
    private readonly deleteDosenUseCase: DeleteDosenUseCase,
  ) {}

  @Get()
  @Roles(Role.TATA_USAHA, Role.DOSEN, Role.MAHASISWA)
  async findAll() {
    const data = await this.getAllDosenUseCase.execute();
    return ResponseHelper.success('Data dosen berhasil diambil', data);
  }

  @Get(':id')
  @Roles(Role.TATA_USAHA, Role.DOSEN, Role.MAHASISWA)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.getDetailDosenUseCase.execute(id);
    return ResponseHelper.success('Detail dosen berhasil diambil', data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.TATA_USAHA)
  async create(@Body() body: CreateDosenDto) {
    const data = await this.createDosenUseCase.execute(body);
    return ResponseHelper.success('Data dosen berhasil dibuat', data);
  }

  @Patch(':id')
  @Roles(Role.TATA_USAHA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDosenDto,
  ) {
    const data = await this.updateDosenUseCase.execute(id, body);
    return ResponseHelper.success('Data dosen berhasil diperbarui', data);
  }

  @Delete(':id')
  @Roles(Role.TATA_USAHA)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteDosenUseCase.execute(id);
    return ResponseHelper.success('Data dosen berhasil dihapus');
  }
}
