import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LiveService } from './live.service';

@ApiTags('live')
@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Get(':channelId')
  @ApiOperation({ summary: '라이브 상태 조회' })
  @ApiParam({ name: 'channelId', description: '치지직 채널 ID' })
  @ApiOkResponse({ description: '라이브 상태 조회 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 채널 ID' })
  async getChannelStatus(@Param('channelId') channelId: string) {
    const status = await this.liveService.getChannelStatus(channelId);
    if (!status) throw new NotFoundException('채널 정보를 찾을 수 없습니다.');
    return status;
  }
}
