import { useMemo, useState } from 'react';
import { Gauge, Music2 } from 'lucide-react';
import DisplayToolbar from '@/components/DisplayToolbar';
import LyricsPanel from '@/components/LyricsPanel';
import PlaybackToolbar from '@/components/PlaybackToolbar';
import VideoHub from '@/components/VideoHub';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { prefersFlats, transposeChord } from '@/lib/chords';
import { parseLyrics } from '@/lib/lyrics';
import { GLASS_CARD } from '@/lib/ui';
import type { Song, Typography } from '@/types';

interface SongPanelProps {
  song: Song;
  typography: Typography;
  showChords: boolean;
  showLyrics: boolean;
  onTypographyChange: (patch: Partial<Typography>) => void;
  onToggleChords: () => void;
  onToggleLyrics: () => void;
  onSaveLyrics: (lyrics: string) => void;
}

export default function SongPanel({
  song,
  typography,
  showChords,
  showLyrics,
  onTypographyChange,
  onToggleChords,
  onToggleLyrics,
  onSaveLyrics,
}: SongPanelProps) {
  const [transpose, setTranspose] = useState(0);
  const [capo, setCapo] = useState(0);
  const [videoHidden, setVideoHidden] = useState(false);
  const [autoScrolling, setAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(35);

  useAutoScroll(autoScrolling, scrollSpeed, () => setAutoScrolling(false));

  const lines = useMemo(() => parseLyrics(song.lyrics), [song.lyrics]);

  const soundingKey = transposeChord(song.key, transpose, prefersFlats(song.key));
  const shift = transpose - capo;
  const playKey = transposeChord(song.key, shift, prefersFlats(soundingKey));
  const flats = prefersFlats(playKey);
  const displayChord = (chord: string) => transposeChord(chord, shift, flats);

  return (
    <div className="min-w-0 flex-1">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-5 sm:px-6 lg:py-8">
        <header className={`${GLASS_CARD} p-5 sm:p-7`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Now playing
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-[1.2] tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            {song.title}
          </h1>
          <p className="mt-1.5 text-base text-zinc-600 dark:text-zinc-400">{song.artist}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:text-zinc-300">
              <Music2 className="h-3.5 w-3.5" />
              {song.genre}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:text-zinc-300">
              <Gauge className="h-3.5 w-3.5" />
              {song.bpm} BPM
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 font-mono text-xs font-bold text-zinc-950">
              Key {soundingKey || 'Not set'}
            </span>
          </div>
        </header>

        <VideoHub
          videos={song.videos}
          hidden={videoHidden}
          onToggleHidden={() => setVideoHidden((value) => !value)}
        />

        <div className={`${GLASS_CARD} flex flex-col gap-5 bg-white/95 p-4 sm:p-5 dark:bg-zinc-900/95`}>
          <PlaybackToolbar
            transpose={transpose}
            onTransposeStep={(delta) => setTranspose((value) => value + delta)}
            onTransposeReset={() => setTranspose(0)}
            capo={capo}
            onCapoChange={setCapo}
            originalKey={soundingKey || 'Not set'}
            playKey={playKey || 'Not set'}
          />
          <div className="h-px bg-zinc-200 dark:bg-white/10" />
          <DisplayToolbar
            typography={typography}
            onTypographyChange={onTypographyChange}
            autoScrolling={autoScrolling}
            onToggleAutoScroll={() => setAutoScrolling((value) => !value)}
            scrollSpeed={scrollSpeed}
            onScrollSpeedChange={setScrollSpeed}
            showChords={showChords}
            showLyrics={showLyrics}
            onToggleChords={onToggleChords}
            onToggleLyrics={onToggleLyrics}
          />
        </div>

        <LyricsPanel
          lyrics={song.lyrics}
          lines={lines}
          typography={typography}
          showChords={showChords}
          showLyrics={showLyrics}
          displayChord={displayChord}
          onSave={onSaveLyrics}
        />
      </div>
    </div>
  );
}
