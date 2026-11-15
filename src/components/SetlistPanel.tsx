import { ListMusic } from 'lucide-react';
import HoldToConfirmButton from '@/components/HoldToConfirmButton';
import { GLASS_CARD } from '@/lib/ui';
import type { Song } from '@/types';

interface SetlistPanelProps {
  songs: Song[];
  onLogService: () => void;
}

export default function SetlistPanel({ songs, onLogService }: SetlistPanelProps) {
  return (
    <section className={`${GLASS_CARD} flex shrink-0 flex-col gap-3 p-3.5`} aria-label="Current setlist">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          <ListMusic className="h-3.5 w-3.5" />
          Current Setlist
        </div>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{songs.length} selected</span>
      </div>

      {songs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 px-3 py-4 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          Tick songs below to build this week's setlist.
        </p>
      ) : (
        <ol className="flex max-h-48 flex-col gap-1 overflow-y-auto">
          {songs.map((song, index) => (
            <li key={song.id} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-zinc-200 text-[11px] font-semibold text-[var(--accent)] dark:border-white/10">
                {index + 1}
              </span>
              <span className="truncate text-sm text-zinc-800 dark:text-zinc-100">{song.title}</span>
            </li>
          ))}
        </ol>
      )}

      <HoldToConfirmButton
        label="Log Service as Completed"
        disabled={songs.length === 0}
        onConfirm={onLogService}
      />
      <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
        Hold the button for 2 seconds to save this setlist to history.
      </p>
    </section>
  );
}
