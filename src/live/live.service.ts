import { Injectable, Logger } from '@nestjs/common';
import { ChzzkChannelStatus } from '../common/interfaces';
import {
  BROWSER_USER_AGENT,
  CACHE_TTL_MS,
  CHZZK_API_BASE,
} from '../common/constants';

interface ChzzkChannelResponse {
  code: number;
  content: {
    channelId: string;
    channelName: string;
    channelImageUrl: string | null;
    openLive: boolean;
    followerCount: number;
  } | null;
}

interface CacheEntry {
  data: ChzzkChannelStatus;
  expiresAt: number;
}

@Injectable()
export class LiveService {
  private readonly logger = new Logger(LiveService.name);
  private readonly cache = new Map<string, CacheEntry>();

  async getChannelStatus(
    channelId: string,
  ): Promise<ChzzkChannelStatus | null> {
    const cached = this.cache.get(channelId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      const res = await fetch(`${CHZZK_API_BASE}/channels/${channelId}`, {
        headers: { 'User-Agent': BROWSER_USER_AGENT },
      });

      if (!res.ok) {
        this.logger.warn(`채널 조회 실패 (${channelId}): HTTP ${res.status}`);
        return cached?.data ?? null;
      }

      const body = (await res.json()) as ChzzkChannelResponse;
      if (!body.content || body.content.channelId === null) {
        return cached?.data ?? null;
      }

      const status: ChzzkChannelStatus = {
        channelId: body.content.channelId,
        channelName: body.content.channelName,
        channelImageUrl: body.content.channelImageUrl,
        openLive: body.content.openLive,
        followerCount: body.content.followerCount,
        liveUrl: `https://chzzk.naver.com/live/${body.content.channelId}`,
      };

      this.cache.set(channelId, {
        data: status,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return status;
    } catch (err) {
      this.logger.error(`채널 조회 중 오류 (${channelId})`, err);
      return cached?.data ?? null;
    }
  }
}
