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

  const PORT = configService.get<number>('PORT') ?? 3000;
  await app.listen(PORT, '0.0.0.0');

  const { networkInterfaces } = await import('os');
  const nets = networkInterfaces();
  const networkIp = Object.values(nets)
    .flat()
    .find((net) => net?.family === 'IPv4' && !net.internal)?.address;

  console.log('\n🚀 Cafe Carte API');
  console.log(` - Local:   http://localhost:${PORT}`);
  console.log(` - Network: http://${networkIp}:${PORT}\n`);
}
bootstrap();
