import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LiveModule } from '../live/live.module';
import { CoversModule } from '../covers/covers.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LiveModule, CoversModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
