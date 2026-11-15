import { ListMusic, Music2, Plus, Search, X } from 'lucide-react';
import SetlistPanel from '@/components/SetlistPanel';
import { BUTTON_BASE, ICON_BUTTON, INPUT_BASE } from '@/lib/ui';
import type { Song } from '@/types';

interface SidebarProps {
  songs: Song[];
  visibleSongs: Song[];
  selectedId: string;
  setlistIds: string[];
  setlistSongs: Song[];
  playCounts: Record<string, number>;
  query: string;
  genre: string;
  artist: string;
  genres: string[];
  artists: string[];
  onQueryChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onSelect: (id: string) => void;
  onToggleSetlist: (id: string) => void;
  onLogService: () => void;
  onAddSong: () => void;
  onClose: () => void;
}

export default function Sidebar({
  songs,
  visibleSongs,
  selectedId,
  setlistIds,
  setlistSongs,
  playCounts,
  query,
  genre,
  artist,
  genres,
  artists,
  onQueryChange,
  onGenreChange,
  onArtistChange,
  onSelect,
  onToggleSetlist,
  onLogService,
  onAddSong,
  onClose,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-zinc-950 shadow-md">
            <Music2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold leading-[1.2] tracking-tight text-zinc-900 dark:text-zinc-50">ChordBook</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{songs.length} songs in your set</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close song list" className={`${ICON_BUTTON} lg:hidden`}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <SetlistPanel songs={setlistSongs} onLogService={onLogService} />

      <button
        type="button"
        onClick={onAddSong}
        className={`${BUTTON_BASE} w-full bg-[var(--accent)] font-semibold text-zinc-950 shadow-md hover:brightness-110`}
      >
        <Plus className="h-4 w-4" />
        Add New Song
      </button>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search title, artist or genre"
            aria-label="Search songs"
            className={`${INPUT_BASE} pl-9`}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Genre / Style
            <select
              value={genre}
              onChange={(event) => onGenreChange(event.target.value)}
              className={`${INPUT_BASE} py-2 text-xs`}
            >
              <option value="">All genres</option>
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Artist
            <select
              value={artist}
              onChange={(event) => onArtistChange(event.target.value)}
              className={`${INPUT_BASE} py-2 text-xs`}
            >
              <option value="">All artists</option>
              {artists.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
        <ListMusic className="h-3.5 w-3.5" />
        All songs ({visibleSongs.length})
      </div>

      <nav className="-mx-1 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-1 pb-2" aria-label="Songs">
        {visibleSongs.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            No songs match these filters.
          </p>
        )}
        {visibleSongs.map((song) => {
          const isActive = song.id === selectedId;
          const isChecked = setlistIds.includes(song.id);
          const plays = playCounts[song.id] ?? 0;
          return (
            <div
              key={song.id}
              className={`group relative flex items-center rounded-xl pr-2 transition-all duration-200 ${
                isActive
                  ? 'bg-zinc-900/[0.06] shadow-sm dark:bg-white/10'
                  : 'hover:bg-zinc-900/[0.04] dark:hover:bg-white/5'
              }`}
            >
              <span
                className={`absolute inset-y-2.5 left-0 w-1 rounded-full bg-[var(--accent)] transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleSetlist(song.id)}
                  aria-label={`Add ${song.title} to current setlist`}
                  className="h-4 w-4 cursor-pointer rounded accent-[var(--accent)]"
                />
              </label>
              <button
                type="button"
                onClick={() => onSelect(song.id)}
                aria-current={isActive ? 'true' : undefined}
                className="flex min-w-0 flex-1 flex-col gap-0.5 py-3 pr-1.5 text-left"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{song.title}</span>
                  {plays > 0 && (
                    <span className="shrink-0 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{plays}x played</span>
                  )}
                </span>
                <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {song.artist} · {song.genre} · {song.bpm} BPM
                </span>
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
