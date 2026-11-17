import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Guitar, Music2, SlidersHorizontal, X } from 'lucide-react';
import ChordSheet from '@/components/ChordSheet';
import TabEditor from '@/components/TabEditor';
import TypographyPopover from '@/components/TypographyPopover';
import { prefersFlats, transposeChord } from '@/lib/chords';
import { parseLyrics } from '@/lib/lyrics';
import { usePersistentState } from '@/hooks/usePersistentState';
import { FONT_FAMILIES, LYRICS_SIZE, CHORD_SCALE } from '@/lib/typography';
import type { Song, StageViewMode, Typography } from '@/types';

interface StageModeProps {
  songs: Song[];
  startIndex: number;
  teamKeys: Record<string, number>;
  typography: Typography;
  onTypographyChange: (patch: Partial<Typography>) => void;
  onExit: () => void;
}

const VIEW_OPTIONS: { value: StageViewMode; label: string }[] = [
  { value: 'full', label: 'Текст + Аккорды' },
  { value: 'chords', label: 'Только аккорды' },
  { value: 'lyrics', label: 'Только текст' },
];

export default function StageMode({
  songs,
  startIndex,
  teamKeys,
  typography,
  onTypographyChange,
  onExit,
}: StageModeProps) {
  const [index, setIndex] = useState(startIndex);
  const [view, setView] = usePersistentState<StageViewMode>('chordbook:stage-view', 'full');
  const [tabOpen, setTabOpen] = useState(false);

  const song = songs[index];
  const lines = useMemo(() => parseLyrics(song.lyrics), [song.lyrics]);

  const savedTeamKey = teamKeys[song.id];
  const transpose = savedTeamKey ?? 0;
  const soundingKey = transposeChord(song.key, transpose, prefersFlats(song.key));
  const isOnTeamKey = savedTeamKey !== undefined;
  const displayChord = (chord: string) => transposeChord(chord, transpose, prefersFlats(soundingKey));

  const showChords = view !== 'lyrics';
  const showLyrics = view !== 'chords';

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(songs.length - 1, i + 1));
  const nextSong = index < songs.length - 1 ? songs[index + 1] : null;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-white/10 px-2.5 py-1 font-mono text-sm font-bold text-[var(--accent)]">
            {index + 1} / {songs.length}
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-white sm:text-lg">{song.title}</span>
            <span className="text-xs text-zinc-400">{song.artist}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-0.5 font-mono text-xs font-bold text-zinc-950">
            Key {soundingKey || 'N/A'}
          </span>
          {isOnTeamKey && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-400/15 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-300">
              ★ {soundingKey}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
            {song.bpm} BPM
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 3-way view switcher */}
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-0.5">
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setView(opt.value)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  view === opt.value
                    ? 'bg-[var(--accent)] text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <TypographyPopover typography={typography} onChange={onTypographyChange} />

          <button
            type="button"
            onClick={() => setTabOpen((v) => !v)}
            aria-pressed={tabOpen}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-all duration-200 active:scale-95 ${
              tabOpen
                ? 'bg-sky-500 font-semibold text-white'
                : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            <Guitar className="h-4 w-4" />
            <span className="hidden sm:inline">🎸 TAB</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-red-500/80 px-3 text-sm font-semibold text-white transition hover:bg-red-500 active:scale-95"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
          {tabOpen && (
            <div className="mb-5">
              <TabEditor songId={song.id} songTitle={song.title} bpm={song.bpm} />
            </div>
          )}
          <div
            className={`${FONT_FAMILIES[typography.fontFamily].className} font-medium`}
            style={{ fontSize: `${typography.fontSize}px` }}
          >
            <ChordSheet
              lines={lines}
              typography={typography}
              showChords={showChords}
              showLyrics={showLyrics}
              displayChord={displayChord}
            />
          </div>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-zinc-900/90 px-4 py-3 backdrop-blur-xl">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/15 active:scale-95 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
          Назад
        </button>

        <div className="flex min-w-0 flex-col items-center gap-0.5">
          {nextSong ? (
            <>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500">Следующая</span>
              <span className="truncate text-sm font-medium text-zinc-300">{nextSong.title}</span>
            </>
          ) : (
            <span className="text-sm text-zinc-500">Это последняя песня</span>
          )}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={index === songs.length - 1}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-base font-bold text-zinc-950 transition hover:brightness-110 active:scale-95 disabled:opacity-30"
        >
          Далее
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
