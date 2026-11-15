import { RotateCcw } from 'lucide-react';
import { BUTTON_BASE, BUTTON_IDLE, INPUT_BASE } from '@/lib/ui';

const CAPO_OPTIONS = [0, 1, 2, 3, 4, 5, 6];
const TRANSPOSE_STEPS = [
  { delta: -2, label: '-2', hint: 'Down a full tone' },
  { delta: -1, label: '-1', hint: 'Down a semitone' },
  { delta: 1, label: '+1', hint: 'Up a semitone' },
  { delta: 2, label: '+2', hint: 'Up a full tone' },
];

interface PlaybackToolbarProps {
  transpose: number;
  onTransposeStep: (delta: number) => void;
  onTransposeReset: () => void;
  capo: number;
  onCapoChange: (capo: number) => void;
  originalKey: string;
  playKey: string;
}

export default function PlaybackToolbar({
  transpose,
  onTransposeStep,
  onTransposeReset,
  capo,
  onCapoChange,
  originalKey,
  playKey,
}: PlaybackToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Transpose {transpose > 0 ? `+${transpose}` : transpose} st
          </span>
          <div className="flex items-center gap-1.5">
            {TRANSPOSE_STEPS.slice(0, 2).map((step) => (
              <button
                key={step.label}
                type="button"
                title={step.hint}
                aria-label={step.hint}
                onClick={() => onTransposeStep(step.delta)}
                className={`${BUTTON_BASE} ${BUTTON_IDLE} min-w-12 px-3 font-mono`}
              >
                {step.label}
              </button>
            ))}
            <button
              type="button"
              title="Back to original key"
              aria-label="Reset transpose"
              onClick={onTransposeReset}
              disabled={transpose === 0}
              className={`${BUTTON_BASE} ${BUTTON_IDLE}`}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            {TRANSPOSE_STEPS.slice(2).map((step) => (
              <button
                key={step.label}
                type="button"
                title={step.hint}
                aria-label={step.hint}
                onClick={() => onTransposeStep(step.delta)}
                className={`${BUTTON_BASE} ${BUTTON_IDLE} min-w-12 px-3 font-mono`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Capo Position
          </span>
          <select
            value={capo}
            onChange={(event) => onCapoChange(Number(event.target.value))}
            className={`${INPUT_BASE} min-w-36 py-2 font-medium`}
          >
            {CAPO_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 0 ? 'No Capo' : `+${option}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-zinc-200 bg-zinc-900/[0.03] px-3.5 py-2.5 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200">
        <span>
          Original Key: <strong className="font-semibold text-zinc-950 dark:text-white">{originalKey}</strong>
        </span>
        <span className="text-zinc-400">|</span>
        <span>
          Play Chords: <strong className="font-semibold text-[var(--accent)]">{playKey}</strong> shapes with{' '}
          {capo === 0 ? 'No Capo' : `Capo on at fret ${capo}`}
        </span>
      </p>
    </div>
  );
}
