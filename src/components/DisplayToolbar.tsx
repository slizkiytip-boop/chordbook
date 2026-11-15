import { Pause, Play } from 'lucide-react';
import { BUTTON_ACTIVE, BUTTON_BASE, BUTTON_IDLE } from '@/lib/ui';
import ToggleSwitch from '@/components/ToggleSwitch';
import TypographyPopover from '@/components/TypographyPopover';
import type { Typography } from '@/types';

interface DisplayToolbarProps {
  typography: Typography;
  onTypographyChange: (patch: Partial<Typography>) => void;
  autoScrolling: boolean;
  onToggleAutoScroll: () => void;
  scrollSpeed: number;
  onScrollSpeedChange: (speed: number) => void;
  showChords: boolean;
  showLyrics: boolean;
  onToggleChords: () => void;
  onToggleLyrics: () => void;
}

export default function DisplayToolbar({
  typography,
  onTypographyChange,
  autoScrolling,
  onToggleAutoScroll,
  scrollSpeed,
  onScrollSpeedChange,
  showChords,
  showLyrics,
  onToggleChords,
  onToggleLyrics,
}: DisplayToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <TypographyPopover typography={typography} onChange={onTypographyChange} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onToggleAutoScroll}
          aria-pressed={autoScrolling}
          className={`${BUTTON_BASE} h-10 ${autoScrolling ? BUTTON_ACTIVE : BUTTON_IDLE}`}
        >
          {autoScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          Auto-Scroll
        </button>
        <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Speed
          <input
            type="range"
            min={10}
            max={150}
            step={5}
            value={scrollSpeed}
            onChange={(event) => onScrollSpeedChange(Number(event.target.value))}
            aria-label="Auto-scroll speed"
            className="w-28 accent-[var(--accent)]"
          />
          <span className="w-12 font-mono text-zinc-600 dark:text-zinc-300">{scrollSpeed} px/s</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <ToggleSwitch
          label="Show Chords"
          checked={showChords}
          onChange={onToggleChords}
          disabled={showChords && !showLyrics}
        />
        <ToggleSwitch
          label="Show Lyrics"
          checked={showLyrics}
          onChange={onToggleLyrics}
          disabled={showLyrics && !showChords}
        />
      </div>
    </div>
  );
}
