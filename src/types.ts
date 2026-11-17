export interface VideoLinks {
  original: string;
  tutorial: string;
  live: string;
  custom: string;
}

export type VideoTabId = keyof VideoLinks;

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  lyrics: string;
  videos: VideoLinks;
}

export interface Segment {
  chord: string | null;
  text: string;
}

export type LyricLine =
  | { kind: 'blank' }
  | { kind: 'section'; label: string }
  | { kind: 'chords'; chords: string[] }
  | { kind: 'lyric'; segments: Segment[] };

export type AccentKey = 'neon' | 'blue' | 'amber';

export type ThemeMode = 'dark' | 'light';

export type FontFamilyKey = 'modern' | 'studio-mono' | 'classic';

export type ChordStyle = 'badges' | 'clean-bold';

export interface Typography {
  fontSize: number;
  chordScale: number;
  fontFamily: FontFamilyKey;
  chordStyle: ChordStyle;
}

export interface ServiceRecord {
  id: string;
  date: string;
  songIds: string[];
}

export type TabRhythm = 'quarter' | 'eighth' | 'sixteenth';

export interface TabMeasure {
  id: string;
  columns: string[][];
  rhythms: TabRhythm[];
}

export interface TabRiff {
  id: string;
  name: string;
  measures: TabMeasure[];
}

export interface SongTab {
  riffs: TabRiff[];
  tempo: number;
}

export type StageViewMode = 'full' | 'chords' | 'lyrics';
