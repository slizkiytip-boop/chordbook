import { useState } from 'react';
import { Check, Guitar, Music2, Plus, Trash2, X } from 'lucide-react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { createSongId } from '@/lib/songs';
import type { SongTab, TabMeasure, TabRiff, TabRhythm } from '@/types';

interface TabEditorProps {
  songId: string;
  songTitle: string;
  bpm: number;
}

const STRINGS = ['e', 'B', 'G', 'D', 'A', 'E'];
const RHYTHM_SYMBOLS: Record<TabRhythm, string> = {
  quarter: '♩',
  eighth: '♪',
  sixteenth: '♬',
};
const RHYTHM_LABELS: Record<TabRhythm, string> = {
  quarter: 'Quarter',
  eighth: 'Eighth',
  sixteenth: '16th',
};
const RHYTHM_OPTIONS: TabRhythm[] = ['quarter', 'eighth', 'sixteenth'];

function emptyColumn(): string[] {
  return ['', '', '', '', '', ''];
}

function emptyMeasure(): TabMeasure {
  return {
    id: createSongId(),
    columns: [emptyColumn(), emptyColumn(), emptyColumn(), emptyColumn()],
    rhythms: ['quarter', 'quarter', 'quarter', 'quarter'],
  };
}

function emptyRiff(name: string): TabRiff {
  return { id: createSongId(), name, measures: [emptyMeasure()] };
}

function emptyTab(bpm: number): SongTab {
  return { riffs: [emptyRiff('Intro Solo')], tempo: bpm || 120 };
}

export default function TabEditor({ songId, songTitle, bpm }: TabEditorProps) {
  const storageKey = `chordbook:tab:${songId}`;
  const [tab, setTab] = usePersistentState<SongTab>(storageKey, emptyTab(bpm));
  const [editingRiffId, setEditingRiffId] = useState<string | null>(null);
  const [riffNameDraft, setRiffNameDraft] = useState('');
  const [saved, setSaved] = useState(false);

  const updateRiff = (riffId: string, updater: (riff: TabRiff) => TabRiff) => {
    setTab((current) => ({
      ...current,
      riffs: current.riffs.map((riff) => (riff.id === riffId ? updater(riff) : riff)),
    }));
  };

  const addRiff = () => {
    setTab((current) => ({
      ...current,
      riffs: [...current.riffs, emptyRiff(`Riff ${current.riffs.length + 1}`)],
    }));
  };

  const removeRiff = (riffId: string) => {
    setTab((current) => ({
      ...current,
      riffs: current.riffs.filter((riff) => riff.id !== riffId),
    }));
  };

  const addMeasure = (riffId: string) => {
    updateRiff(riffId, (riff) => ({ ...riff, measures: [...riff.measures, emptyMeasure()] }));
  };

  const removeMeasure = (riffId: string, measureIndex: number) => {
    updateRiff(riffId, (riff) => ({
      ...riff,
      measures: riff.measures.filter((_, i) => i !== measureIndex),
    }));
  };

  const setFret = (riffId: string, measureIndex: number, colIndex: number, stringIndex: number, value: string) => {
    updateRiff(riffId, (riff) => ({
      ...riff,
      measures: riff.measures.map((m, mi) =>
        mi === measureIndex
          ? {
              ...m,
              columns: m.columns.map((col, ci) =>
                ci === colIndex ? col.map((f, si) => (si === stringIndex ? value : f)) : col,
              ),
            }
          : m,
      ),
    }));
  };

  const setRhythm = (riffId: string, measureIndex: number, colIndex: number, rhythm: TabRhythm) => {
    updateRiff(riffId, (riff) => ({
      ...riff,
      measures: riff.measures.map((m, mi) =>
        mi === measureIndex
          ? { ...m, rhythms: m.rhythms.map((r, ci) => (ci === colIndex ? rhythm : r)) }
          : m,
      ),
    }));
  };

  const startRenameRiff = (riff: TabRiff) => {
    setEditingRiffId(riff.id);
    setRiffNameDraft(riff.name);
  };

  const confirmRename = () => {
    if (editingRiffId) {
      updateRiff(editingRiffId, (riff) => ({ ...riff, name: riffNameDraft.trim() || riff.name }));
    }
    setEditingRiffId(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-xl sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Guitar className="h-5 w-5 text-sky-400" />
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300">
            Guitar Tablature — {songTitle}
          </h3>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-sky-500 text-white hover:bg-sky-400'
          }`}
        >
          <Check className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Tab'}
        </button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5">
          <span className="font-mono text-lg text-amber-400">TAB</span>
          <span className="text-xs text-slate-400">clef</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5">
          <span className="text-xs font-semibold text-slate-400">4/4</span>
        </div>
        <label className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-1.5">
          <Music2 className="h-3.5 w-3.5 text-sky-400" />
          <span className="text-xs text-slate-400">♩ =</span>
          <input
            type="number"
            min={40}
            max={300}
            value={tab.tempo}
            onChange={(e) => setTab((t) => ({ ...t, tempo: Number(e.target.value) || 120 }))}
            className="w-14 bg-transparent text-center font-mono text-sm font-bold text-amber-300 outline-none"
          />
        </label>
      </div>

      <div className="flex flex-col gap-6">
        {tab.riffs.map((riff) => (
          <div key={riff.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              {editingRiffId === riff.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={riffNameDraft}
                    onChange={(e) => setRiffNameDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
                    autoFocus
                    className="rounded-lg border border-sky-500/50 bg-slate-900 px-3 py-1 text-sm font-semibold text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={confirmRename}
                    className="rounded-lg bg-sky-500 p-1.5 text-white transition hover:bg-sky-400"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startRenameRiff(riff)}
                  className="text-left text-sm font-bold text-sky-300 transition hover:text-sky-200"
                >
                  {riff.name}
                </button>
              )}
              <button
                type="button"
                onClick={() => removeRiff(riff.id)}
                aria-label="Remove riff"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/15 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {riff.measures.map((measure, mi) => (
                <div key={measure.id} className="shrink-0">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Bar {mi + 1}
                    </span>
                    {riff.measures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeasure(riff.id, mi)}
                        aria-label={`Remove bar ${mi + 1}`}
                        className="text-slate-600 transition hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <div className="rounded-lg border-l-2 border-t border-b border-r border-slate-600/60 bg-slate-900/60 px-2 py-1.5">
                    {STRINGS.map((stringName, si) => (
                      <div key={si} className="flex items-center gap-[2px]">
                        <span className="w-4 text-right font-mono text-[10px] font-bold text-slate-500">
                          {stringName}
                        </span>
                        <span className="mx-0.5 text-slate-600">|</span>
                        {measure.columns.map((col, ci) => (
                          <div key={ci} className="flex items-center">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              value={col[si]}
                              onChange={(e) => setFret(riff.id, mi, ci, si, e.target.value)}
                              placeholder="—"
                              className="h-7 w-9 border-b border-slate-700/50 bg-transparent text-center font-mono text-xs text-sky-200 outline-none transition focus:border-sky-400 focus:bg-slate-800/60"
                            />
                            {ci < measure.columns.length - 1 && (
                              <span className="text-slate-700">·</span>
                            )}
                          </div>
                        ))}
                        <span className="ml-0.5 text-slate-600">|</span>
                      </div>
                    ))}

                    <div className="mt-1.5 flex items-center gap-1 border-t border-slate-700/40 pt-1.5">
                      {measure.rhythms.map((rhythm, ci) => (
                        <div key={ci} className="flex flex-1 flex-col items-center gap-0.5">
                          <select
                            value={rhythm}
                            onChange={(e) => setRhythm(riff.id, mi, ci, e.target.value as TabRhythm)}
                            className="w-full cursor-pointer rounded border-none bg-transparent text-center font-mono text-[10px] text-amber-400 outline-none"
                            aria-label={`Rhythm for note ${ci + 1}`}
                          >
                            {RHYTHM_OPTIONS.map((opt) => (
                              <option key={opt} value={opt} className="bg-slate-800 text-slate-200">
                                {RHYTHM_SYMBOLS[opt]} {RHYTHM_LABELS[opt]}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex shrink-0 items-end">
                <button
                  type="button"
                  onClick={() => addMeasure(riff.id)}
                  className="mb-1 flex h-full min-h-[120px] items-center gap-1.5 rounded-lg border border-dashed border-slate-600 px-3 text-xs font-semibold text-slate-400 transition hover:border-sky-500 hover:text-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Bar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRiff}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-sky-500 hover:text-sky-400"
      >
        <Plus className="h-4 w-4" />
        Add Riff Block
      </button>
    </section>
  );
}
