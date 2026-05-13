import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import RedisStore from 'connect-redis';
import session from 'express-session';
import Redis from 'ioredis';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const frontendUrl =
    config.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  const allowedOrigins = frontendUrl
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const sessionSecret =
    config.get<string>('SESSION_SECRET') || 'krs-session-secret-change-me';

  const redisClient = new Redis({
    host: config.get<string>('REDIS_HOST', 'localhost'),
    port: Number(config.get<string>('REDIS_PORT', '6379')),
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'krs-sess:',
  });

  app.use(
    session({
      store: redisStore,
      name: 'krs.sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS not allowed for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const port = Number(config.get<string>('PORT', '3000'));
  await app.listen(port);
  Logger.log(`Backend KRS berjalan di http://localhost:${port}`, 'Bootstrap');
  Logger.log(`Frontend diharapkan di ${frontendUrl}`, 'Bootstrap');
}

bootstrap();
