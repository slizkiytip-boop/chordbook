import type { Song } from '@/types';

export interface SongFilters {
  query: string;
  genre: string;
  artist: string;
}

export function filterSongs(songs: Song[], { query, genre, artist }: SongFilters): Song[] {
  const needle = query.trim().toLowerCase();
  return songs.filter((song) => {
    if (genre && song.genre !== genre) return false;
    if (artist && song.artist !== artist) return false;
    if (!needle) return true;
    return [song.title, song.artist, song.genre].some((value) => value.toLowerCase().includes(needle));
  });
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function createSongId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
