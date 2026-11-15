import { useState } from 'react';
import { Check } from 'lucide-react';
import ChordSheet from '@/components/ChordSheet';
import LyricsEditor from '@/components/LyricsEditor';
import ToggleSwitch from '@/components/ToggleSwitch';
import { BUTTON_BASE, GLASS_CARD } from '@/lib/ui';
import type { LyricLine, Typography } from '@/types';

interface LyricsPanelProps {
  lyrics: string;
  lines: LyricLine[];
  typography: Typography;
  showChords: boolean;
  showLyrics: boolean;
  displayChord: (chord: string) => string;
  onSave: (lyrics: string) => void;
}

export default function LyricsPanel({
  lyrics,
  lines,
  typography,
  showChords,
  showLyrics,
  displayChord,
  onSave,
}: LyricsPanelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(lyrics);

  const startEditing = () => {
    setDraft(lyrics);
    setEditing(true);
  };

  const saveChanges = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <section className={`${GLASS_CARD} p-5 sm:p-8`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Lyrics &amp; Chords
        </p>
        <div className="flex items-center gap-4">
          {editing && (
            <button
              type="button"
              onClick={saveChanges}
              disabled={!draft.trim()}
              className={`${BUTTON_BASE} bg-[var(--accent)] font-semibold text-zinc-950 shadow-md hover:brightness-110`}
            >
              <Check className="h-4 w-4" />
              Save Changes
            </button>
          )}
          <ToggleSwitch
            label="Edit Mode"
            checked={editing}
            onChange={() => (editing ? setEditing(false) : startEditing())}
          />
        </div>
      </div>

      <div key={editing ? 'editor' : 'view'} className="animate-fade-in">
        {editing ? (
          <div className="flex flex-col gap-4">
            <LyricsEditor value={draft} onChange={setDraft} fontSize={typography.fontSize} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Put chords in brackets, like [Am], right before the word they fall on. Turning Edit Mode off discards unsaved changes.
            </p>
          </div>
        ) : (
          <ChordSheet
            lines={lines}
            typography={typography}
            showChords={showChords}
            showLyrics={showLyrics}
            displayChord={displayChord}
          />
        )}
      </div>
    </section>
  );
}
