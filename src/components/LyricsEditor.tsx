import { useLayoutEffect, useRef } from 'react';

interface LyricsEditorProps {
  value: string;
  onChange: (value: string) => void;
  fontSize: number;
}

export default function LyricsEditor({ value, onChange, fontSize }: LyricsEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, fontSize]);

  return (
    <textarea
      ref={ref}
      aria-label="Lyrics and chords"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      style={{ fontSize: `${fontSize}px` }}
      className="block w-full resize-none overflow-hidden bg-transparent p-0 font-medium leading-[1.5] text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
    />
  );
}
