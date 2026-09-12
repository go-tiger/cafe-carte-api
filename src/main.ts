import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { createCorsConfig } from './common/configs/cors.config';
import { setupSwagger } from './common/configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors(createCorsConfig(configService));

  setupSwagger(app);

  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
