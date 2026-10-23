import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoversService } from './covers.service';

@ApiTags('covers')
@Controller('covers')
export class CoversController {
  constructor(private readonly coversService: CoversService) {}

  @Get()
  @ApiOperation({ summary: '공식, 멤버 채널의 커버곡 영상 목록 (최신순)' })
  @ApiOkResponse({ description: '커버곡 목록 조회 성공' })
  getCovers() {
    return this.coversService.getCovers();
  }
}
