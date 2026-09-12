import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChzzkModule } from '../chzzk/chzzk.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ChzzkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
