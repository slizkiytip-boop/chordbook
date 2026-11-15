import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Plus, X } from 'lucide-react';
import { BUTTON_BASE, BUTTON_IDLE, INPUT_BASE, ICON_BUTTON } from '@/lib/ui';
import { isChordToken } from '@/lib/chords';
import { detectKey } from '@/lib/lyrics';
import { resolveMedia } from '@/lib/media';
import { createSongId } from '@/lib/songs';
import type { Song } from '@/types';

interface AddSongModalProps {
  onClose: () => void;
  onSave: (song: Song) => void;
}

interface SongDraft {
  title: string;
  artist: string;
  genre: string;
  bpm: string;
  key: string;
  original: string;
  tutorial: string;
  live: string;
  custom: string;
  lyrics: string;
}

type DraftField = keyof SongDraft;

const EMPTY_DRAFT: SongDraft = {
  title: '',
  artist: '',
  genre: '',
  bpm: '',
  key: '',
  original: '',
  tutorial: '',
  live: '',
  custom: '',
  lyrics: '',
};

const VIDEO_FIELDS: { field: DraftField; label: string; placeholder: string }[] = [
  { field: 'original', label: 'Original Track', placeholder: 'https://www.youtube.com/watch?v=...' },
  { field: 'tutorial', label: 'Guitar Tutorial', placeholder: 'https://www.youtube.com/watch?v=...' },
  { field: 'live', label: 'Live/Cover', placeholder: 'https://www.youtube.com/watch?v=...' },
  { field: 'custom', label: 'Custom Video', placeholder: 'https://example.com/video.mp4' },
];

function validate(draft: SongDraft): Partial<Record<DraftField, string>> {
  const errors: Partial<Record<DraftField, string>> = {};
  const bpm = Number(draft.bpm);

  if (!draft.title.trim()) errors.title = 'Enter a song title.';
  if (!draft.artist.trim()) errors.artist = 'Enter the artist name.';
  if (!draft.genre.trim()) errors.genre = 'Enter a genre or style.';
  if (!draft.bpm.trim() || !Number.isInteger(bpm) || bpm < 30 || bpm > 300) {
    errors.bpm = 'Enter a whole BPM between 30 and 300.';
  }
  if (draft.key.trim() && !isChordToken(draft.key)) errors.key = 'Use a chord name such as G or Am.';
  for (const { field } of VIDEO_FIELDS) {
    const value = draft[field];
    if (value.trim() && !resolveMedia(value)) errors[field] = 'Use a full https:// link.';
  }
  if (!draft.lyrics.trim()) errors.lyrics = 'Paste the lyrics, with chords in brackets like [Am].';

  return errors;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</span>}
    </label>
  );
}

export default function AddSongModal({ onClose, onSave }: AddSongModalProps) {
  const [draft, setDraft] = useState<SongDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Partial<Record<DraftField, string>>>({});

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const updateField = (field: DraftField, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      id: createSongId(),
      title: draft.title.trim(),
      artist: draft.artist.trim(),
      genre: draft.genre.trim(),
      bpm: Number(draft.bpm),
      key: draft.key.trim() || detectKey(draft.lyrics),
      lyrics: draft.lyrics.replace(/\s+$/, ''),
      videos: {
        original: draft.original.trim(),
        tutorial: draft.tutorial.trim(),
        live: draft.live.trim(),
        custom: draft.custom.trim(),
      },
    });
  };

  const inputClass = (field: DraftField) =>
    `${INPUT_BASE} ${errors[field] ? 'border-rose-400 dark:border-rose-400' : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/60 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-song-title"
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-3xl border border-zinc-200 bg-white shadow-2xl sm:rounded-2xl dark:border-white/10 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6 dark:border-white/10">
          <div>
            <h2 id="add-song-title" className="text-lg font-semibold text-zinc-950 dark:text-white">
              Add New Song
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Saved to this session's song list.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className={ICON_BUTTON}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Song Title" error={errors.title}>
                <input className={inputClass('title')} value={draft.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Song title" />
              </Field>
              <Field label="Artist" error={errors.artist}>
                <input className={inputClass('artist')} value={draft.artist} onChange={(e) => updateField('artist', e.target.value)} placeholder="Harbor Lights" />
              </Field>
              <Field label="Genre / Style" error={errors.genre}>
                <input className={inputClass('genre')} value={draft.genre} onChange={(e) => updateField('genre', e.target.value)} placeholder="Folk" />
              </Field>
              <Field label="BPM" error={errors.bpm}>
                <input
                  className={inputClass('bpm')}
                  inputMode="numeric"
                  value={draft.bpm}
                  onChange={(e) => updateField('bpm', e.target.value)}
                  placeholder="96"
                />
              </Field>
              <Field label="Original Key (optional)" error={errors.key}>
                <input className={inputClass('key')} value={draft.key} onChange={(e) => updateField('key', e.target.value)} placeholder="Detected from lyrics if empty" />
              </Field>
            </div>

            <fieldset className="mt-6 flex flex-col gap-4 border-t border-zinc-200 pt-5 dark:border-white/10">
              <legend className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Video Links</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {VIDEO_FIELDS.map(({ field, label, placeholder }) => (
                  <Field key={field} label={label} error={errors[field]}>
                    <input
                      className={inputClass(field)}
                      value={draft[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder={placeholder}
                    />
                  </Field>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 flex flex-col gap-2 border-t border-zinc-200 pt-5 dark:border-white/10">
              <Field label="Lyrics and Chords" error={errors.lyrics}>
                <textarea
                  rows={12}
                  value={draft.lyrics}
                  onChange={(e) => updateField('lyrics', e.target.value)}
                  placeholder={'[Verse 1]\n[Am]Paste your lyric line [G]with chords\n[F]Each line can [C]hold chords'}
                  className={`${inputClass('lyrics')} resize-y font-mono leading-relaxed`}
                />
              </Field>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Put chords in brackets, like [Am] or [G], right before the word they fall on. Use [Chorus] or [Bridge] for section labels.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-200 px-5 py-4 sm:px-6 dark:border-white/10">
            <button type="button" onClick={onClose} className={`${BUTTON_BASE} ${BUTTON_IDLE}`}>
              Cancel
            </button>
            <button type="submit" className={`${BUTTON_BASE} bg-[var(--accent)] font-semibold text-zinc-950 shadow-md hover:brightness-110`}>
              <Plus className="h-4 w-4" />
              Save Song
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
