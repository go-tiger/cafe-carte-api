import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ChzzkService } from './chzzk.service';

@ApiTags('chzzk')
@Controller('chzzk')
export class ChzzkController {
  constructor(private readonly chzzkService: ChzzkService) {}

  @Get(':channelId')
  @ApiOperation({ summary: '치지직 채널 상태 조회' })
  @ApiParam({ name: 'channelId', description: '치지직 채널 ID' })
  @ApiOkResponse({ description: '채널 상태 조회 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 채널 ID' })
  async getChannelStatus(@Param('channelId') channelId: string) {
    const status = await this.chzzkService.getChannelStatus(channelId);
    if (!status) throw new NotFoundException('채널 정보를 찾을 수 없습니다.');
    return status;
  }
}
