import type { ServiceRecord, Song } from '@/types';

export type Timeframe = 'month' | 'year' | 'two-years' | 'five-years' | 'all';
export type TopLimit = 5 | 10 | 20 | 'all';

export const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'two-years', label: '2 Years' },
  { value: 'five-years', label: '5 Years' },
  { value: 'all', label: 'All Time' },
];

export const LIMIT_OPTIONS: { value: TopLimit; label: string }[] = [
  { value: 5, label: 'Top 5' },
  { value: 10, label: 'Top 10' },
  { value: 20, label: 'Top 20' },
  { value: 'all', label: 'All Songs' },
];

const TIMEFRAME_MONTHS: Record<Exclude<Timeframe, 'all'>, number> = {
  month: 1,
  year: 12,
  'two-years': 24,
  'five-years': 60,
};

export interface SongPlayStat {
  songId: string;
  title: string;
  plays: number;
}

function shiftMonths(date: Date, months: number): Date {
  const shifted = new Date(date);
  shifted.setMonth(shifted.getMonth() + months);
  return shifted;
}

export function getSongPlayStats(
  history: ServiceRecord[],
  songs: Song[],
  timeframe: Timeframe,
  limit: TopLimit,
): SongPlayStat[] {
  const since = timeframe === 'all' ? null : shiftMonths(new Date(), -TIMEFRAME_MONTHS[timeframe]);
  const counts = new Map<string, number>();

  for (const record of history) {
    if (since && new Date(record.date) < since) continue;
    for (const id of record.songIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  const stats: SongPlayStat[] = [];
  for (const song of songs) {
    const plays = counts.get(song.id) ?? 0;
    if (plays > 0) stats.push({ songId: song.id, title: song.title, plays });
  }
  stats.sort((a, b) => b.plays - a.plays || a.title.localeCompare(b.title));

  return limit === 'all' ? stats : stats.slice(0, limit);
}

export function formatPlays(count: number): string {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  const word = lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'раза' : 'раз';
  return `${count} ${word}`;
}
