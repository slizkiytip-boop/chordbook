import type { AccentKey } from '@/types';

export const ACCENTS: Record<AccentKey, { label: string; hex: string }> = {
  neon: { label: 'Neon Green', hex: '#39ff14' },
  blue: { label: 'Electric Blue', hex: '#2fb8ff' },
  amber: { label: 'Amber', hex: '#ffb020' },
};

export const GLASS_CARD =
  'rounded-2xl border border-zinc-200 bg-white/80 shadow-lg shadow-zinc-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/30';

export const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-40';

export const BUTTON_IDLE =
  'border border-zinc-200 bg-white/70 text-zinc-700 hover:border-zinc-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10';

export const BUTTON_ACTIVE = 'border border-transparent bg-[var(--accent)] font-semibold text-zinc-950 shadow-md';

export const INPUT_BASE =
  'w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-[var(--accent)] dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-500';

export const ICON_BUTTON =
  'inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100';
