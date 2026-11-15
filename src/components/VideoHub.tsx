import { useState } from 'react';
import { EyeOff, Film, Guitar, Mic, Music, Video } from 'lucide-react';
import { BUTTON_ACTIVE, BUTTON_BASE, BUTTON_IDLE, GLASS_CARD } from '@/lib/ui';
import { resolveMedia } from '@/lib/media';
import type { VideoLinks, VideoTabId } from '@/types';

const VIDEO_TABS: { id: VideoTabId; label: string; icon: typeof Music }[] = [
  { id: 'original', label: 'Original Track', icon: Music },
  { id: 'tutorial', label: 'Guitar Tutorial', icon: Guitar },
  { id: 'live', label: 'Live/Cover', icon: Mic },
  { id: 'custom', label: 'Custom Video', icon: Film },
];

interface VideoHubProps {
  videos: VideoLinks;
  hidden: boolean;
  onToggleHidden: () => void;
}

function VideoPlayer({ url }: { url: string }) {
  if (!url.trim()) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 text-center dark:border-white/10">
        <Video className="h-6 w-6 text-zinc-400" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No link added for this tab yet.</p>
      </div>
    );
  }

  const media = resolveMedia(url);
  if (!media) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-rose-400/60 p-6 text-center text-sm text-rose-600 dark:text-rose-300">
        This link cannot be played. Use a full https:// address.
      </div>
    );
  }

  if (media.kind === 'youtube') {
    return (
      <iframe
        key={media.embedUrl}
        src={media.embedUrl}
        title="YouTube video player"
        className="aspect-video w-full rounded-xl bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (media.kind === 'file' && media.mediaType === 'video') {
    return <video key={media.url} src={media.url} controls preload="metadata" className="aspect-video w-full rounded-xl bg-black" />;
  }

  if (media.kind === 'file') {
    return (
      <div className="flex w-full items-center rounded-xl border border-zinc-200 bg-zinc-100/70 p-4 dark:border-white/10 dark:bg-white/5">
        <audio key={media.url} src={media.url} controls preload="metadata" className="w-full" />
      </div>
    );
  }

  return (
    <iframe
      key={media.url}
      src={media.url}
      title="Embedded video"
      className="aspect-video w-full rounded-xl bg-black"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
}

export default function VideoHub({ videos, hidden, onToggleHidden }: VideoHubProps) {
  const [activeTab, setActiveTab] = useState<VideoTabId>('original');
  const activeVideo = videos[activeTab];

  return (
    <section className={`${GLASS_CARD} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          <Video className="h-4 w-4 text-[var(--accent)]" />
          Media Hub
        </div>
        <button
          type="button"
          onClick={onToggleHidden}
          aria-expanded={!hidden}
          className={`${BUTTON_BASE} ${BUTTON_IDLE} py-1.5 text-xs`}
        >
          {hidden ? <Video className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {hidden ? 'Show Video Player' : 'Hide Video Player'}
        </button>
      </div>

      {!hidden && (
        <div className="flex flex-col gap-4 px-4 pb-4 sm:px-5 sm:pb-5">
          <div role="tablist" aria-label="Video sources" className="flex gap-2 overflow-x-auto pb-1">
            {VIDEO_TABS.map(({ id, label, icon: Icon }) => {
              const selected = id === activeTab;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(id)}
                  className={`${BUTTON_BASE} shrink-0 py-2 text-xs ${selected ? BUTTON_ACTIVE : BUTTON_IDLE}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
          <VideoPlayer url={activeVideo} />
        </div>
      )}
    </section>
  );
}
