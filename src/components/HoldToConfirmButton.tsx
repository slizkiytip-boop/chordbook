import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { BUTTON_BASE } from '@/lib/ui';

const HOLD_MS = 2000;

interface HoldToConfirmButtonProps {
  label: string;
  disabled?: boolean;
  onConfirm: () => void;
}

export default function HoldToConfirmButton({ label, disabled = false, onConfirm }: HoldToConfirmButtonProps) {
  const [holding, setHolding] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const cancel = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setHolding(false);
  };

  const start = () => {
    if (disabled || timerRef.current !== null) return;
    setHolding(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      onConfirm();
    }, HOLD_MS);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
      event.preventDefault();
      start();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') cancel();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={cancel}
      className={`${BUTTON_BASE} relative w-full select-none touch-none overflow-hidden bg-[var(--accent)] font-semibold text-zinc-950 shadow-md hover:brightness-110`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 bg-zinc-950/25 ease-linear"
        style={{
          width: holding ? '100%' : '0%',
          transitionProperty: 'width',
          transitionDuration: holding ? `${HOLD_MS}ms` : '200ms',
        }}
      />
      <span className="relative">{label}</span>
    </button>
  );
}
