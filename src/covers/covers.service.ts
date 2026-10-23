import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoverList, CoverVideo } from '../common/interfaces';
import {
  COVER_CHANNELS,
  COVER_TITLE_PATTERN,
  COVERS_CACHE_TTL_MS,
  COVERS_MAX_PAGES_PER_CHANNEL,
  YOUTUBE_API_BASE,
} from '../common/constants';

interface ChannelsResponse {
  items?: { contentDetails: { relatedPlaylists: { uploads: string } } }[];
}

interface PlaylistItemsResponse {
  nextPageToken?: string;
  items?: { snippet: { title: string; resourceId: { videoId: string } } }[];
}

interface VideosResponse {
  items?: {
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: Record<string, { url: string } | undefined>;
    };
    contentDetails: { duration: string };
    status: { embeddable: boolean; privacyStatus: string };
  }[];
}

const parseDuration = (iso: string): number => {
  const m = iso.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const [, d, h, min, s] = m.map((v) => Number(v ?? 0));
  return d * 86400 + h * 3600 + min * 60 + s;
};

@Injectable()
export class CoversService {
  private readonly logger = new Logger(CoversService.name);
  private cache: CoverList = { updatedAt: null, items: [] };
  private expiresAt = 0;
  private refreshing: Promise<void> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async getCovers(): Promise<CoverList> {
    if (Date.now() >= this.expiresAt) {
      this.refreshing ??= this.refresh().finally(() => {
        this.refreshing = null;
      });
      if (!this.cache.updatedAt) await this.refreshing;
    }
    return this.cache;
  }

  private async refresh(): Promise<void> {
    const key = this.configService.get<string>('YOUTUBE_API_KEY');
    if (!key) {
      this.logger.warn(
        'YOUTUBE_API_KEY 가 없어 커버곡 목록을 갱신하지 않습니다.',
      );
      this.expiresAt = Date.now() + COVERS_CACHE_TTL_MS;
      return;
    }

    try {
      const perChannel = await Promise.all(
        COVER_CHANNELS.map(async ({ handle, memberId }) => {
          const ids = await this.fetchCoverIds(key, handle);
          return this.fetchVideos(key, ids, memberId);
        }),
      );
      const items = perChannel
        .flat()
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

      this.cache = { updatedAt: new Date().toISOString(), items };
      this.expiresAt = Date.now() + COVERS_CACHE_TTL_MS;
    } catch (err) {
      this.logger.error('커버곡 목록 갱신 중 오류', err);
      this.expiresAt = Date.now() + 10 * 60 * 1000;
    }
  }

  private async get<T>(
    path: string,
    params: Record<string, string>,
  ): Promise<T> {
    const url = `${YOUTUBE_API_BASE}/${path}?${new URLSearchParams(params)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API ${path} HTTP ${res.status}`);
    return (await res.json()) as T;
  }

  private async fetchCoverIds(key: string, handle: string): Promise<string[]> {
    const channels = await this.get<ChannelsResponse>('channels', {
      part: 'contentDetails',
      forHandle: handle,
      key,
    });
    const uploads =
      channels.items?.[0]?.contentDetails.relatedPlaylists.uploads;
    if (!uploads) {
      this.logger.warn(`채널을 찾을 수 없습니다: ${handle}`);
      return [];
    }

    const ids: string[] = [];
    let pageToken: string | undefined;
    for (let page = 0; page < COVERS_MAX_PAGES_PER_CHANNEL; page++) {
      const list = await this.get<PlaylistItemsResponse>('playlistItems', {
        part: 'snippet',
        playlistId: uploads,
        maxResults: '50',
        ...(pageToken ? { pageToken } : {}),
        key,
      });
      for (const item of list.items ?? []) {
        if (COVER_TITLE_PATTERN.test(item.snippet.title))
          ids.push(item.snippet.resourceId.videoId);
      }
      pageToken = list.nextPageToken;
      if (!pageToken) break;
    }
    return ids;
  }

  private async fetchVideos(
    key: string,
    ids: string[],
    memberId: string | null,
  ): Promise<CoverVideo[]> {
    const videos: CoverVideo[] = [];
    for (let i = 0; i < ids.length; i += 50) {
      const res = await this.get<VideosResponse>('videos', {
        part: 'snippet,contentDetails,status',
        id: ids.slice(i, i + 50).join(','),
        key,
      });
      for (const v of res.items ?? []) {
        if (!v.status.embeddable || v.status.privacyStatus !== 'public')
          continue;
        const thumbs = v.snippet.thumbnails;
        videos.push({
          videoId: v.id,
          title: v.snippet.title,
          channelTitle: v.snippet.channelTitle,
          memberId,
          publishedAt: v.snippet.publishedAt,
          durationSec: parseDuration(v.contentDetails.duration),
          thumbnailUrl:
            (thumbs.high ?? thumbs.medium ?? thumbs.default)?.url ?? '',
        });
      }
    }
    return videos;
  }
}
