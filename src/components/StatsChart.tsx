import { formatPlays, type SongPlayStat } from '@/lib/statistics';

const GRID_LINES = [25, 50, 75, 100];

interface StatsChartProps {
  stats: SongPlayStat[];
}

export default function StatsChart({ stats }: StatsChartProps) {
  const maxPlays = Math.max(...stats.map((stat) => stat.plays));

  return (
    <div className="rounded-2xl border border-white/5 bg-[#1e1e24] p-5 shadow-xl shadow-black/30">
      <div className="flex flex-col gap-3">
        {stats.map((stat) => {
          const widthPercent = (stat.plays / maxPlays) * 100;
          return (
            <div key={stat.songId} className="flex items-center gap-3">
              <p className="w-28 shrink-0 truncate text-sm font-medium text-zinc-100 sm:w-44" title={stat.title}>
                {stat.title}
              </p>
              <div className="relative h-8 min-w-0 flex-1">
                <div className="absolute inset-y-0 left-0 right-[4.5rem]">
                  {GRID_LINES.map((line) => (
                    <span
                      key={line}
                      aria-hidden="true"
                      className="absolute inset-y-0 border-l border-dashed border-white/10"
                      style={{ left: `${line}%` }}
                    />
                  ))}
                  <span
                    className="absolute left-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-[#10b981]"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span
                  className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-sm font-semibold text-[#10b981]"
                  style={{ left: `calc((100% - 4.5rem) * ${widthPercent} / 100 + 0.5rem)` }}
                >
                  {formatPlays(stat.plays)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
