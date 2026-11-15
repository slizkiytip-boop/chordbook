import { isChordToken } from '@/lib/chords';
import type { LyricLine, Segment } from '@/types';

const BRACKET_PATTERN = /\[([^\]]+)\]/g;
const SECTION_PATTERN = /^\[([^\]]+)\]$/;

function parseLine(rawLine: string): LyricLine {
  const trimmed = rawLine.trim();
  if (!trimmed) return { kind: 'blank' };

  const section = trimmed.match(SECTION_PATTERN);
  if (section && !isChordToken(section[1])) {
    return { kind: 'section', label: section[1].trim() };
  }

  const segments: Segment[] = [{ chord: null, text: '' }];
  let cursor = 0;

  for (const match of rawLine.matchAll(BRACKET_PATTERN)) {
    const index = match.index ?? 0;
    const current = segments[segments.length - 1];
    current.text += rawLine.slice(cursor, index);
    cursor = index + match[0].length;

    if (isChordToken(match[1])) {
      segments.push({ chord: match[1].trim(), text: '' });
    } else {
      current.text += match[0];
    }
  }
  segments[segments.length - 1].text += rawLine.slice(cursor);

  const hasChords = segments.some((segment) => segment.chord);
  const hasWords = segments.some((segment) => segment.text.trim());
  if (hasChords && !hasWords) {
    return {
      kind: 'chords',
      chords: segments.flatMap((segment) => (segment.chord ? [segment.chord] : [])),
    };
  }

  return { kind: 'lyric', segments };
}

export function parseLyrics(raw: string): LyricLine[] {
  return raw.split(/\r?\n/).map(parseLine);
}

export function detectKey(raw: string): string {
  for (const match of raw.matchAll(BRACKET_PATTERN)) {
    if (isChordToken(match[1])) return match[1].trim();
  }
  return '';
}
