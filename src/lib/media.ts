export type MediaSource =
  | { kind: 'youtube'; embedUrl: string }
  | { kind: 'file'; mediaType: 'video' | 'audio'; url: string }
  | { kind: 'iframe'; url: string };

const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogv|mov|m4v)$/i;
const AUDIO_FILE_PATTERN = /\.(mp3|m4a|wav|ogg|aac|flac)$/i;
const YOUTUBE_ID_PATTERN = /^[\w-]{6,}$/;

function getYouTubeId(url: URL): string | null {
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  let id: string | null = null;

  if (host === 'youtu.be') {
    id = url.pathname.slice(1).split('/')[0];
  } else if (host === 'youtube.com' || host === 'music.youtube.com') {
    if (url.pathname === '/watch') {
      id = url.searchParams.get('v');
    } else {
      const [, section, value] = url.pathname.split('/');
      if (['embed', 'shorts', 'live'].includes(section)) id = value ?? null;
    }
  }

  return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
}

export function resolveMedia(input: string): MediaSource | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    return { kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${youtubeId}` };
  }
  if (VIDEO_FILE_PATTERN.test(url.pathname)) {
    return { kind: 'file', mediaType: 'video', url: url.toString() };
  }
  if (AUDIO_FILE_PATTERN.test(url.pathname)) {
    return { kind: 'file', mediaType: 'audio', url: url.toString() };
  }
  return { kind: 'iframe', url: url.toString() };
}
