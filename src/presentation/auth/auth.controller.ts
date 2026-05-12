import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ResponseHelper } from '../../common/helpers/response.helper';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { LoginUseCase } from '../../application/auth/use-cases/login.usecase';
import { GetProfileUseCase } from '../../application/auth/use-cases/get-profile.usecase';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Req() req: Request) {
    const user = await this.loginUseCase.execute(body.username, body.password);

    req.session.user = {
      id: user.id,
      username: user.username,
      namaLengkap: user.namaLengkap,
      role: user.role,
    };

    return ResponseHelper.success('Login berhasil', { user });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    return ResponseHelper.success('Logout berhasil');
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.getProfileUseCase.execute(user.id);
    return ResponseHelper.success('Profil berhasil diambil', data);
  }
}
