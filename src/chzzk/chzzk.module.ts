import { Module } from '@nestjs/common';
import { ChzzkService } from './chzzk.service';
import { ChzzkController } from './chzzk.controller';

@Module({
  providers: [ChzzkService],
  controllers: [ChzzkController]
})
export class ChzzkModule {}
