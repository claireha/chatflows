import { useRef, useState } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface WidgetVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

/** Widget preview video: autoplays once (muted), no native controls,
 *  with only replay and mute/unmute overlay buttons. */
export function WidgetVideo({ src, poster, className }: WidgetVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        playsInline
        onCanPlay={(e) => {
          const v = e.currentTarget;
          v.muted = false;
          void v.play().catch(() => {
            // Browser blocked unmuted autoplay — fall back to muted playback
            v.muted = true;
            setMuted(true);
            void v.play();
          });
        }}
        preload="metadata"
        className={className}
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        <button
          type="button"
          aria-label="Replay video"
          onClick={replay}
          className="rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          onClick={toggleMute}
          className="rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
