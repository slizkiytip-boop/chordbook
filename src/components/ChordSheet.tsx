import type { CSSProperties } from 'react';
import { FONT_FAMILIES } from '@/lib/typography';
import type { ChordStyle, LyricLine, Typography } from '@/types';

interface ChordSheetProps {
  lines: LyricLine[];
  typography: Typography;
  showChords: boolean;
  showLyrics: boolean;
  displayChord: (chord: string) => string;
}

type ChordVariant = 'inline' | 'grid';

const CLEAN_CHORD = 'inline-flex items-center font-mono font-extrabold leading-none tracking-tight text-zinc-950 dark:text-[var(--accent)]';

const CHORD_CLASSES: Record<ChordStyle, Record<ChordVariant, string>> = {
  badges: {
    inline: 'inline-flex items-center rounded-md bg-[var(--accent)] px-[0.45em] py-[0.25em] font-mono font-bold leading-none text-[#0a0c0f]',
    grid: 'inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-[0.6em] py-[0.4em] font-mono font-bold leading-none text-[#0a0c0f] shadow-sm',
  },
  'clean-bold': { inline: CLEAN_CHORD, grid: CLEAN_CHORD },
};

const CHORD_EM: Record<ChordStyle, Record<ChordVariant, number>> = {
  badges: { inline: 0.5, grid: 0.75 },
  'clean-bold': { inline: 0.72, grid: 0.95 },
};

function ChordBadge({ children, variant, chordStyle }: { children: string; variant: ChordVariant; chordStyle: ChordStyle }) {
  return (
    <span
      className={CHORD_CLASSES[chordStyle][variant]}
      style={{ fontSize: `calc(${CHORD_EM[chordStyle][variant]}em * var(--chord-scale))` }}
    >
      {children}
    </span>
  );
}

export default function ChordSheet({ lines, typography, showChords, showLyrics, displayChord }: ChordSheetProps) {
  const { chordStyle } = typography;
  const sheetStyle = {
    fontSize: `${typography.fontSize}px`,
    '--chord-scale': typography.chordScale / 100,
  } as CSSProperties;

  return (
    <div
      className={`${FONT_FAMILIES[typography.fontFamily].className} font-medium text-zinc-800 transition-[font-size] duration-200 dark:text-zinc-100`}
      style={sheetStyle}
    >
      {lines.map((line, index) => {
        switch (line.kind) {
          case 'blank':
            return <div key={index} className="h-[0.9em]" />;

          case 'section':
            return (
              <h3
                key={index}
                className="mb-2 mt-6 border-l-2 border-[var(--accent)] pl-3 text-[0.5em] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400"
              >
                {line.label}
              </h3>
            );

          case 'chords':
            if (!showChords) return null;
            return (
              <div key={index} className="flex flex-wrap gap-[0.6em] py-[0.3em]">
                {line.chords.map((chord, chordIndex) => (
                  <ChordBadge key={chordIndex} variant="grid" chordStyle={chordStyle}>
                    {displayChord(chord)}
                  </ChordBadge>
                ))}
              </div>
            );

          case 'lyric': {
            const chordCount = line.segments.filter((segment) => segment.chord).length;
            if (!showLyrics) {
              if (!showChords || chordCount === 0) return null;
              return (
                <div key={index} className="flex flex-wrap gap-[0.6em] py-[0.3em]">
                  {line.segments.map((segment, segmentIndex) =>
                    segment.chord ? (
                      <ChordBadge key={segmentIndex} variant="grid" chordStyle={chordStyle}>
                        {displayChord(segment.chord)}
                      </ChordBadge>
                    ) : null,
                  )}
                </div>
              );
            }

            return (
              <div key={index} className="flex flex-wrap leading-[1.5]">
                {line.segments.map((segment, segmentIndex) => (
                  <span key={segmentIndex} className="flex flex-col">
                    {showChords && (
                      <span className="flex items-end" style={{ height: 'calc(1.4em * var(--chord-scale))' }}>
                        {segment.chord && (
                          <ChordBadge variant="inline" chordStyle={chordStyle}>
                            {displayChord(segment.chord)}
                          </ChordBadge>
                        )}
                      </span>
                    )}
                    <span className="whitespace-pre-wrap break-words">{segment.text || '\u00a0'}</span>
                  </span>
                ))}
              </div>
            );
          }
        }
      })}
    </div>
  );
}
