import { useEffect, useMemo, useState } from 'react';
import { BarChart3, X } from 'lucide-react';
import StatsChart from '@/components/StatsChart';
import {
  LIMIT_OPTIONS,
  TIMEFRAME_OPTIONS,
  getSongPlayStats,
  type TopLimit,
  type Timeframe,
} from '@/lib/statistics';
import { ICON_BUTTON } from '@/lib/ui';
import type { ServiceRecord, Song } from '@/types';

interface StatisticsModalProps {
  serviceHistory: ServiceRecord[];
  songs: Song[];
  onClose: () => void;
}

interface TabGroupProps<T extends string | number> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function TabGroup<T extends string | number>({ label, options, value, onChange }: TabGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{label}</span>
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-1 rounded-xl bg-zinc-900/5 p-1 dark:bg-white/5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                selected
                  ? 'bg-white text-zinc-950 shadow-sm dark:bg-white/15 dark:text-white'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StatisticsModal({ serviceHistory, songs, onClose }: StatisticsModalProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('year');
  const [limit, setLimit] = useState<TopLimit>(10);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const stats = useMemo(
    () => getSongPlayStats(serviceHistory, songs, timeframe, limit),
    [serviceHistory, songs, timeframe, limit],
  );

  let content;
  if (serviceHistory.length === 0) {
    content = (
      <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        No services logged yet. Complete a setlist to see stats!
      </p>
    );
  } else if (stats.length === 0) {
    content = (
      <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        No songs were played in this timeframe.
      </p>
    );
  } else {
    content = <StatsChart stats={stats} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="statistics-title"
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-2xl dark:border-white/10 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-zinc-950 shadow-md">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 id="statistics-title" className="text-lg font-semibold text-zinc-950 dark:text-white">
                Worship Statistics
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Most played songs from completed services.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close statistics" className={ICON_BUTTON}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4">
            <TabGroup label="Timeframe" options={TIMEFRAME_OPTIONS} value={timeframe} onChange={setTimeframe} />
            <TabGroup label="Show" options={LIMIT_OPTIONS} value={limit} onChange={setLimit} />
          </div>
          {content}
        </div>
      </div>
    </div>
  );
}
