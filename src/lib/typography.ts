import type { ChordStyle, FontFamilyKey } from '@/types';

export const LYRICS_SIZE = { min: 14, max: 40, step: 2 };
export const CHORD_SCALE = { min: 80, max: 200, step: 10 };

export const FONT_FAMILIES: Record<FontFamilyKey, { label: string; className: string }> = {
  modern: { label: 'Modern', className: 'font-sans' },
  'studio-mono': { label: 'Studio Mono', className: 'font-mono' },
  classic: { label: 'Classic', className: 'font-serif' },
};

export const CHORD_STYLES: Record<ChordStyle, { label: string }> = {
  badges: { label: 'Badges' },
  'clean-bold': { label: 'Clean Bold' },
};
