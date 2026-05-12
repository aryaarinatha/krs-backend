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
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.usecase';
import { GetAllUserUseCase } from '../../application/user/use-cases/get-all-user.usecase';
import { GetDetailUserUseCase } from '../../application/user/use-cases/get-detail-user.usecase';
import { UpdateUserUseCase } from '../../application/user/use-cases/update-user.usecase';
import { DeleteUserUseCase } from '../../application/user/use-cases/delete-user.usecase';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(Role.TATA_USAHA)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUserUseCase: GetAllUserUseCase,
    private readonly getDetailUserUseCase: GetDetailUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  async findAll() {
    const data = await this.getAllUserUseCase.execute();
    return ResponseHelper.success('Data user berhasil diambil', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.getDetailUserUseCase.execute(id);
    return ResponseHelper.success('Detail user berhasil diambil', data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUserDto) {
    const data = await this.createUserUseCase.execute(body);
    return ResponseHelper.success('Data user berhasil dibuat', data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    const data = await this.updateUserUseCase.execute(id, body);
    return ResponseHelper.success('Data user berhasil diperbarui', data);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() current: AuthenticatedUser,
  ) {
    await this.deleteUserUseCase.execute(id, current.id);
    return ResponseHelper.success('Data user berhasil dihapus');
  }
}
