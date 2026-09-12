import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const createCorsConfig = (configService: ConfigService): CorsOptions => ({
  origin: configService
    .get<string>('FRONTEND_URL', '')
    .split(',')
    .map((url) => url.trim()),
  credentials: true,
});
