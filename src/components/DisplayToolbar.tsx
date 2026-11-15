import ToggleSwitch from '@/components/ToggleSwitch';
import TypographyPopover from '@/components/TypographyPopover';
import type { Typography } from '@/types';

interface DisplayToolbarProps {
  typography: Typography;
  onTypographyChange: (patch: Partial<Typography>) => void;
  showChords: boolean;
  showLyrics: boolean;
  onToggleChords: () => void;
  onToggleLyrics: () => void;
}

export default function DisplayToolbar({
  typography,
  onTypographyChange,
  showChords,
  showLyrics,
  onToggleChords,
  onToggleLyrics,
}: DisplayToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <TypographyPopover typography={typography} onChange={onTypographyChange} showLyrics={showLyrics} onToggleLyrics={onToggleLyrics} />

      <div className="flex flex-wrap items-center gap-5">
        <ToggleSwitch
          label="Show Chords"
          checked={showChords}
          onChange={onToggleChords}
          disabled={showChords && !showLyrics}
        />
        <ToggleSwitch
          label="Show Lyrics"
          checked={showLyrics}
          onChange={onToggleLyrics}
          disabled={showLyrics && !showChords}
        />
      </div>
    </div>
  );
}
