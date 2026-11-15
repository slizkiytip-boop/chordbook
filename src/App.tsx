import { useState, type CSSProperties } from 'react';
import { BarChart3, Menu } from 'lucide-react';
import AddSongModal from '@/components/AddSongModal';
import AppearanceMenu from '@/components/AppearanceMenu';
import Sidebar from '@/components/Sidebar';
import SongPanel from '@/components/SongPanel';
import StatisticsModal from '@/components/StatisticsModal';
import { SEED_SONGS } from '@/data/seedSongs';
import { usePersistentState } from '@/hooks/usePersistentState';
import { createSongId, filterSongs, uniqueSorted } from '@/lib/songs';
import { ACCENTS, BUTTON_BASE, BUTTON_IDLE, ICON_BUTTON } from '@/lib/ui';
import type { AccentKey, ChordStyle, FontFamilyKey, ServiceRecord, Song, ThemeMode, Typography } from '@/types';

function App() {
  const [songs, setSongs] = useState<Song[]>(SEED_SONGS);
  const [selectedId, setSelectedId] = useState(SEED_SONGS[0].id);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [artist, setArtist] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [setlistIds, setSetlistIds] = usePersistentState<string[]>('chordbook:setlist', []);
  const [playCounts, setPlayCounts] = usePersistentState<Record<string, number>>('chordbook:play-counts', {});
  const [serviceHistory, setServiceHistory] = usePersistentState<ServiceRecord[]>('chordbook:service-history', []);

  const [theme, setTheme] = usePersistentState<ThemeMode>('chordbook:theme', 'dark');
  const [accent, setAccent] = usePersistentState<AccentKey>('chordbook:accent', 'neon');
  const [fontSize, setFontSize] = usePersistentState<number>('chordbook:font-size', 18);
  const [chordScale, setChordScale] = usePersistentState<number>('chordbook:chord-scale', 100);
  const [fontFamily, setFontFamily] = usePersistentState<FontFamilyKey>('chordbook:font-family', 'modern');
  const [chordStyle, setChordStyle] = usePersistentState<ChordStyle>('chordbook:chord-style', 'badges');
  const [showChords, setShowChords] = usePersistentState<boolean>('chordbook:show-chords', true);
  const [showLyrics, setShowLyrics] = usePersistentState<boolean>('chordbook:show-lyrics', true);

  const genres = uniqueSorted(songs.map((song) => song.genre));
  const artists = uniqueSorted(songs.map((song) => song.artist));
  const visibleSongs = filterSongs(songs, { query, genre, artist });
  const selectedSong = songs.find((song) => song.id === selectedId);
  const setlistSongs = setlistIds
    .map((id) => songs.find((song) => song.id === id))
    .filter((song): song is Song => song !== undefined);

  const selectSong = (id: string) => {
    setSelectedId(id);
    setSidebarOpen(false);
  };

  const addSong = (song: Song) => {
    setSongs((current) => [...current, song]);
    setSelectedId(song.id);
    setQuery('');
    setGenre('');
    setArtist('');
    setAddOpen(false);
  };

  const toggleSetlist = (id: string) => {
    setSetlistIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const logService = () => {
    setPlayCounts((current) => {
      const next = { ...current };
      for (const id of setlistIds) next[id] = (next[id] ?? 0) + 1;
      return next;
    });
    setServiceHistory((current) => [...current, { id: createSongId(), date: new Date().toISOString(), songIds: setlistIds }]);
    setSetlistIds([]);
  };

  const updateLyrics = (id: string, lyrics: string) => {
    setSongs((current) => current.map((song) => (song.id === id ? { ...song, lyrics } : song)));
  };

  const typography: Typography = { fontSize, chordScale, fontFamily, chordStyle };

  const updateTypography = (patch: Partial<Typography>) => {
    if (patch.fontSize !== undefined) setFontSize(patch.fontSize);
    if (patch.chordScale !== undefined) setChordScale(patch.chordScale);
    if (patch.fontFamily !== undefined) setFontFamily(patch.fontFamily);
    if (patch.chordStyle !== undefined) setChordStyle(patch.chordStyle);
  };

  const appStyle = { '--accent': ACCENTS[accent].hex } as CSSProperties;

  return (
    <div className={theme === 'dark' ? 'dark' : ''} style={appStyle}>
      <div className="flex min-h-dvh bg-zinc-100 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#23262b,_#0d0e10_60%)] dark:text-zinc-100">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[19rem] max-w-[85vw] border-r border-zinc-200 bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-out lg:static lg:self-start lg:w-80 lg:max-w-none lg:translate-x-0 dark:border-white/10 dark:bg-zinc-900/95 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar
            songs={songs}
            visibleSongs={visibleSongs}
            selectedId={selectedId}
            setlistIds={setlistIds}
            setlistSongs={setlistSongs}
            playCounts={playCounts}
            query={query}
            genre={genre}
            artist={artist}
            genres={genres}
            artists={artists}
            onQueryChange={setQuery}
            onGenreChange={setGenre}
            onArtistChange={setArtist}
            onSelect={selectSong}
            onToggleSetlist={toggleSetlist}
            onLogService={logService}
            onAddSong={() => setAddOpen(true)}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-zinc-950/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200/80 bg-zinc-100/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open song list"
              className={`${ICON_BUTTON} lg:hidden`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatsOpen(true)}
                aria-label="Statistics"
                className={`${BUTTON_BASE} ${BUTTON_IDLE}`}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Statistics</span>
              </button>
              <AppearanceMenu theme={theme} accent={accent} onThemeChange={setTheme} onAccentChange={setAccent} />
            </div>
          </div>

          {selectedSong ? (
            <SongPanel
              key={selectedSong.id}
              song={selectedSong}
              typography={typography}
              showChords={showChords}
              showLyrics={showLyrics}
              onTypographyChange={updateTypography}
              onToggleChords={() => setShowChords((value) => !value)}
              onToggleLyrics={() => setShowLyrics((value) => !value)}
              onSaveLyrics={(lyrics) => updateLyrics(selectedSong.id, lyrics)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-zinc-500 dark:text-zinc-400">
              Choose a song from the list to start.
            </div>
          )}
        </main>
      </div>

      {addOpen && <AddSongModal onClose={() => setAddOpen(false)} onSave={addSong} />}
      {statsOpen && (
        <StatisticsModal serviceHistory={serviceHistory} songs={songs} onClose={() => setStatsOpen(false)} />
      )}
    </div>
  );
}

export default App;
