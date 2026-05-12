import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.usecase';
import { GetAllUserUseCase } from '../../application/user/use-cases/get-all-user.usecase';
import { GetDetailUserUseCase } from '../../application/user/use-cases/get-detail-user.usecase';
import { UpdateUserUseCase } from '../../application/user/use-cases/update-user.usecase';
import { DeleteUserUseCase } from '../../application/user/use-cases/delete-user.usecase';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetAllUserUseCase,
    GetDetailUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UserModule {}
