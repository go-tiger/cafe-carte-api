export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
export const COVERS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
export const COVERS_MAX_PAGES_PER_CHANNEL = 4;

export const COVER_CHANNELS: { handle: string; memberId: string | null }[] = [
  { handle: '@TWILLITSTUDIOofficial', memberId: null },
  { handle: '@mocoparfe', memberId: 'mocoparfe' },
  { handle: '@hanseorin_rin', memberId: 'hanseorin' },
  { handle: '@dangkey_key', memberId: 'dangkey' },
  { handle: '@Uuhee', memberId: 'uuhee' },
  { handle: '@aerusolstice', memberId: 'aerusolstice' },
];

export const COVER_TITLE_PATTERN = /cover|커버|불러\s?(보았|봤)/i;
