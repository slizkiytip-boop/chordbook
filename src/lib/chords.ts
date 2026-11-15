const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
// H is the German/Russian name for B natural, so chords like Hm are valid roots.
const NATURAL_OFFSETS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11, H: 11 };
const FLAT_KEY_ROOTS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']);

const CHORD_PATTERN = /^[A-GH](?:#|b)?(?:maj|min|m|M|dim|aug|sus|add|[0-9+\-#b()])*(?:\/[A-GH](?:#|b)?)?$/;
const ROOT_PATTERN = /^[A-GH](?:#|b)?/;
const NOTE_PATTERN = /[A-GH](?:#|b)?/g;

export function isChordToken(text: string): boolean {
  return CHORD_PATTERN.test(text.trim());
}

export function prefersFlats(chord: string): boolean {
  const root = chord.match(ROOT_PATTERN)?.[0] ?? '';
  return FLAT_KEY_ROOTS.has(root);
}

function transposeNote(note: string, semitones: number, flats: boolean): string {
  const accidental = note[1] === '#' ? 1 : note[1] === 'b' ? -1 : 0;
  const offset = NATURAL_OFFSETS[note[0]] + accidental;
  const index = (((offset + semitones) % 12) + 12) % 12;
  return (flats ? FLAT_NAMES : SHARP_NAMES)[index];
}

export function transposeChord(chord: string, semitones: number, flats = false): string {
  const shift = ((semitones % 12) + 12) % 12;
  if (shift === 0) return chord;
  return chord.replace(NOTE_PATTERN, (note) => transposeNote(note, shift, flats));
}
