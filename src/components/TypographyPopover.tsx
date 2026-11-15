import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, SlidersHorizontal } from 'lucide-react';
import { CHORD_SCALE, CHORD_STYLES, FONT_FAMILIES, LYRICS_SIZE } from '@/lib/typography';
import { BUTTON_ACTIVE, BUTTON_BASE, BUTTON_IDLE } from '@/lib/ui';
import type { ChordStyle, FontFamilyKey, Typography } from '@/types';

interface TypographyPopoverProps {
  typography: Typography;
  onChange: (patch: Partial<Typography>) => void;
}

interface Placement {
  top: number;
  left: number;
  host: Element;
}

interface StepperProps {
  label: string;
  valueLabel: string;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface PillGroupProps<T extends string> {
  label: string;
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: (option: PillOption<T>) => string;
}

const POPOVER_WIDTH = 288;
const VIEWPORT_MARGIN = 16;

function measurePlacement(button: HTMLButtonElement): Placement {
  const rect = button.getBoundingClientRect();
  const maxLeft = window.innerWidth - POPOVER_WIDTH - VIEWPORT_MARGIN;
  return {
    top: rect.bottom + 8,
    left: Math.max(VIEWPORT_MARGIN, Math.min(rect.left, maxLeft)),
    host: button.closest('.dark') ?? document.body,
  };
}

function Stepper({ label, valueLabel, canDecrease, canIncrease, onDecrease, onIncrease }: StepperProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{valueLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={onDecrease}
          disabled={!canDecrease}
          className={`${BUTTON_BASE} ${BUTTON_IDLE} h-8 w-8 px-0`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={onIncrease}
          disabled={!canIncrease}
          className={`${BUTTON_BASE} ${BUTTON_IDLE} h-8 w-8 px-0`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function PillGroup<T extends string>({ label, options, value, onChange, className }: PillGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 active:scale-95 ${
                selected
                  ? 'border-transparent bg-[var(--accent)] font-semibold text-zinc-950 shadow-sm'
                  : 'border-zinc-200 font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-900/[0.04] dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10'
              } ${className?.(option) ?? ''}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const FONT_OPTIONS = (Object.keys(FONT_FAMILIES) as FontFamilyKey[]).map((value) => ({
  value,
  label: FONT_FAMILIES[value].label,
}));

const CHORD_STYLE_OPTIONS = (Object.keys(CHORD_STYLES) as ChordStyle[]).map((value) => ({
  value,
  label: CHORD_STYLES[value].label,
}));

export default function TypographyPopover({ typography, onChange }: TypographyPopoverProps) {
  const [placement, setPlacement] = useState<Placement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const open = placement !== null;

  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      if (triggerRef.current) setPlacement(measurePlacement(triggerRef.current));
    };
    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !popoverRef.current?.contains(target)) setPlacement(null);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPlacement(null);
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    document.addEventListener('mousedown', handlePointer);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      document.removeEventListener('mousedown', handlePointer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const togglePopover = () => {
    if (open) {
      setPlacement(null);
      return;
    }
    if (triggerRef.current) setPlacement(measurePlacement(triggerRef.current));
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={togglePopover}
        aria-expanded={open}
        aria-label="Typography settings"
        className={`${BUTTON_BASE} ${open ? BUTTON_ACTIVE : BUTTON_IDLE} h-10 px-3.5`}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="font-serif text-base font-semibold">Aa</span>
      </button>

      {placement &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Typography settings"
            style={{ top: placement.top, left: placement.left, width: POPOVER_WIDTH }}
            className="fixed z-[100] flex animate-fade-in flex-col gap-5 rounded-2xl border border-zinc-200 bg-white/95 p-5 text-zinc-900 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95 dark:text-zinc-100"
          >
            <Stepper
              label="Lyrics Size"
              valueLabel={`${typography.fontSize}px`}
              canDecrease={typography.fontSize > LYRICS_SIZE.min}
              canIncrease={typography.fontSize < LYRICS_SIZE.max}
              onDecrease={() => onChange({ fontSize: typography.fontSize - LYRICS_SIZE.step })}
              onIncrease={() => onChange({ fontSize: typography.fontSize + LYRICS_SIZE.step })}
            />
            <Stepper
              label="Chords Size"
              valueLabel={`${typography.chordScale}%`}
              canDecrease={typography.chordScale > CHORD_SCALE.min}
              canIncrease={typography.chordScale < CHORD_SCALE.max}
              onDecrease={() => onChange({ chordScale: typography.chordScale - CHORD_SCALE.step })}
              onIncrease={() => onChange({ chordScale: typography.chordScale + CHORD_SCALE.step })}
            />

            <div className="h-px bg-zinc-200 dark:bg-white/10" />

            <PillGroup
              label="Font Family"
              options={FONT_OPTIONS}
              value={typography.fontFamily}
              onChange={(fontFamily) => onChange({ fontFamily })}
              className={(option) => FONT_FAMILIES[option.value].className}
            />
            <PillGroup
              label="Chord Style"
              options={CHORD_STYLE_OPTIONS}
              value={typography.chordStyle}
              onChange={(chordStyle) => onChange({ chordStyle })}
            />
          </div>,
          placement.host,
        )}
    </>
  );
}
