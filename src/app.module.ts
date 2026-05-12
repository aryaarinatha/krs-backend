import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AuthInfrastructureModule } from './infrastructure/auth/auth-infrastructure.module';
import { AuthModule } from './presentation/auth/auth.module';
import { UserModule } from './presentation/user/user.module';
import { DosenModule } from './presentation/dosen/dosen.module';
import { MahasiswaModule } from './presentation/mahasiswa/mahasiswa.module';
import { PemetaanPaModule } from './presentation/pemetaan-pa/pemetaan-pa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthInfrastructureModule,
    AuthModule,
    UserModule,
    DosenModule,
    MahasiswaModule,
    PemetaanPaModule,
  ],
})
export class AppModule {}
