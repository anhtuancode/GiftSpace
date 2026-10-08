import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { AllExceptionsFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // 1. Kích hoạt Interceptor (Chuẩn hóa Success)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 2. Kích hoạt Exception Filter (Chuẩn hóa Error)
  app.useGlobalFilters(new AllExceptionsFilter());

  // 3. API prefix (vd: http://localhost:8000/api/v1/...)
  const globalPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(globalPrefix);

  // 4. CORS cho Frontend Next.js
  const clientUrl = configService.get<string>('CLIENT_URL', 'http://localhost:3000');
  app.enableCors({
    origin: clientUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 5. Validation Pipe toàn cục (lọc data DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT', 8000);
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();