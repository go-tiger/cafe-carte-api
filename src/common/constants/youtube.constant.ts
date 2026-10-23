export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
export const COVERS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
export const COVERS_MAX_PAGES_PER_CHANNEL = 20;
export const COVER_SHORT_MAX_SEC = 60;
export const COVER_MAX_SEC = 20 * 60;
// 카페 카르테 첫 데뷔(모코 파르페). 그 전 영상은 서모코 시절이라 제외
export const COVERS_SINCE = '2026-01-06T00:00:00+09:00';

export interface CoverChannel {
  handle: string;
  memberId: string | null;
  extraTitlePattern?: RegExp;
}

export const COVER_CHANNELS: CoverChannel[] = [
  { handle: '@TWILLITSTUDIOofficial', memberId: null },
  { handle: '@mocoparfe', memberId: 'mocoparfe' },
  { handle: '@hanseorin_rin', memberId: 'hanseorin' },
  { handle: '@dangkey_key', memberId: 'dangkey' },
  { handle: '@Uuhee', memberId: 'uuhee' },
  {
    handle: '@aerusolstice',
    memberId: 'aerusolstice',
    extraTitlePattern:
      /[＜<][^＞>]+[＞>][^(（]*[(（][^)）]+[)）]|노래가 제일 잘됨/,
  },
];

export const COVER_TITLE_PATTERN = /cover|커버|歌ってみた|불러\s?(보았|봤)/i;

export const COVER_DESCRIPTION_PATTERN =
  /#(커버곡|커버송|커버|coversong|cover|歌ってみた|우타이테)(?=[\s#＃]|$)/i;

export const OFFICIAL_MEMBER_KEYWORDS: { pattern: RegExp; memberId: string }[] =
  [
    { pattern: /모코\s?파르페/, memberId: 'mocoparfe' },
    { pattern: /한서린/, memberId: 'hanseorin' },
    { pattern: /댕키/, memberId: 'dangkey' },
    { pattern: /유우희/, memberId: 'uuhee' },
    { pattern: /에루\s?솔스티스/, memberId: 'aerusolstice' },
  ];
