import { Module } from '@nestjs/common';
import { CoversService } from './covers.service';
import { CoversController } from './covers.controller';

@Module({
  providers: [CoversService],
  controllers: [CoversController],
})
export class CoversModule {}
