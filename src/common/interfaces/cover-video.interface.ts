export interface CoverVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  memberId: string | null;
  publishedAt: string;
  durationSec: number;
  thumbnailUrl: string;
}

export interface CoverList {
  updatedAt: string | null;
  items: CoverVideo[];
}
