import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Moon, Palette, Sun } from 'lucide-react';
import { ACCENTS, ICON_BUTTON } from '@/lib/ui';
import type { AccentKey, ThemeMode } from '@/types';

interface AppearanceMenuProps {
  theme: ThemeMode;
  accent: AccentKey;
  onThemeChange: (theme: ThemeMode) => void;
  onAccentChange: (accent: AccentKey) => void;
}

interface MenuPlacement {
  top: number;
  right: number;
  host: Element;
}

export default function AppearanceMenu({ theme, accent, onThemeChange, onAccentChange }: AppearanceMenuProps) {
  const [placement, setPlacement] = useState<MenuPlacement | null>(null);
  const paletteButtonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === 'dark';

  const togglePalette = () => {
    if (placement) {
      setPlacement(null);
      return;
    }
    const button = paletteButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setPlacement({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
      host: button.closest('.dark') ?? document.body,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={ICON_BUTTON}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <button
        ref={paletteButtonRef}
        type="button"
        onClick={togglePalette}
        aria-expanded={placement !== null}
        aria-label="Chord highlight color settings"
        className={ICON_BUTTON}
      >
        <Palette className="h-4 w-4" />
      </button>

      {placement &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setPlacement(null)} />
            <div
              role="menu"
              aria-label="Chord highlight"
              style={{ top: placement.top, right: placement.right }}
              className="fixed z-[100] w-64 rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-900 shadow-xl dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Chord highlight
              </p>
              <div className="flex flex-col gap-1">
                {(Object.keys(ACCENTS) as AccentKey[]).map((key) => {
                  const selected = key === accent;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="menuitemradio"
                      aria-checked={selected}
                      onClick={() => onAccentChange(key)}
                      className="flex items-center justify-between gap-3 whitespace-nowrap rounded-xl px-2 py-2 text-sm text-zinc-800 transition hover:bg-zinc-900/5 dark:text-zinc-100 dark:hover:bg-white/10"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="h-5 w-5 shrink-0 rounded-full ring-2 ring-white/60"
                          style={{ backgroundColor: ACCENTS[key].hex }}
                        />
                        {ACCENTS[key].label}
                      </span>
                      {selected && <Check className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-300" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>,
          placement.host,
        )}
    </div>
  );
}
