import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import diamondIcon from '@/assets/diamond-icon.svg';
import promoVideo from '@/assets/promo-video.mp4';
import playerPlay from '@/assets/player-play.svg';
import playerPause from '@/assets/player-pause.svg';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NavPromoBannerProps {
  isExpanded: boolean;
  onDismiss: () => void;
  onTryItOut?: () => void;
}

// Section breakpoints in seconds: [0, 3s, 7s, end]
const getSectionBreakpoints = (duration: number) => {
  if (duration <= 0) return [0, 0.33, 0.66, 1];
  return [0, 3 / duration, 7 / duration, 1];
  
};

const SegmentedTimeline: React.FC<{ progress: number; duration: number; onSeek: (time: number) => void }> = ({ progress, duration, onSeek }) => {
  const breakpoints = getSectionBreakpoints(duration);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const seekFromClientX = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container || !duration) return;
    // Get all section elements
    const sections = container.children;
    const gap = 3; // matches gap-[3px]
    for (let i = 0; i < sections.length; i++) {
      const rect = (sections[i] as HTMLElement).getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) {
        const x = (clientX - rect.left) / rect.width;
        const start = breakpoints[i];
        const end = breakpoints[i + 1];
        const globalProgress = start + x * (end - start);
        onSeek(globalProgress * duration);
        return;
      }
    }
    // If past the end, seek to end
    const containerRect = container.getBoundingClientRect();
    if (clientX > containerRect.right) onSeek(duration);
    if (clientX < containerRect.left) onSeek(0);
  }, [breakpoints, duration, onSeek]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        seekFromClientX(e.clientX);
      }
    };
    const handleMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [seekFromClientX]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    seekFromClientX(e.clientX);
  };

  return (
    <div ref={containerRef} className="flex items-center gap-[3px] flex-1" onMouseDown={handleMouseDown}>
      {[0, 1, 2].map((i) => {
        const start = breakpoints[i];
        const end = breakpoints[i + 1];
        const size = end - start;
        const fill = Math.min(1, Math.max(0, (progress - start) / size));
        return (
          <div
            key={i}
            className="h-[6px] rounded-full cursor-pointer relative"
            style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.5)', flex: size }}
          >
            <div
              className="h-full rounded-full relative"
              style={{
                width: `${fill * 100}%`,
                backgroundColor: '#D20688',
              }}
            >
              {fill > 0 && fill < 1 && (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[10px] h-[10px] rounded-full cursor-grab"
                  style={{ backgroundColor: '#D20688' }}
                  onMouseDown={(e) => { e.stopPropagation(); isDragging.current = true; }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const NavPromoBanner: React.FC<NavPromoBannerProps> = ({ isExpanded, onDismiss, onTryItOut }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2500);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 1500);
  }, []);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) {
      setProgress(v.currentTime / v.duration);
      setDuration(v.duration);
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = time;
    }
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (previewOpen) {
      setIsPlaying(true);
      setProgress(0);
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2500);
    } else {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [previewOpen]);

  if (!isExpanded) {
    return (
      <div className="flex items-center justify-center rounded-lg aspect-square mb-2 border border-sidebar-border/40" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.2)' }}>
        <img src={diamondIcon} alt="" className="w-3.5 h-3.5" />
      </div>
    );
  }

  return (
    <>
      <video src={promoVideo} preload="auto" muted playsInline className="hidden" />

      <div className="rounded-lg p-3 mb-2 border border-sidebar-border/40" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.2)' }}>
        <p className="font-medium text-sidebar-foreground leading-tight mb-1.5" style={{ fontSize: '16px' }}>
          Try a simpler, customizable sidebar
        </p>
        <p className="text-xs text-sidebar-foreground font-light leading-snug mb-4">
          Put your most-used tools one click away
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onDismiss} className="rounded-md bg-transparent text-sidebar-foreground/70 font-light hover:text-sidebar-foreground transition-colors" style={{ height: '24px', padding: '0 8px', fontSize: '12px' }}>
            Not now
          </button>
          <button onClick={() => setPreviewOpen(true)} className="rounded-md bg-transparent border border-sidebar-foreground text-sidebar-foreground font-light hover:bg-sidebar-foreground/10 transition-colors" style={{ height: '24px', padding: '0 12px', fontSize: '12px' }}>
            Preview
          </button>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="p-0 rounded-2xl [&>button:last-child]:hidden" style={{ maxWidth: '480px', borderRadius: '16px' }}>
          <DialogHeader className="flex flex-row items-center justify-between px-6 border-b [&+button]:hidden" style={{ height: '64px', minHeight: '64px' }}>
            <DialogTitle className="font-semibold" style={{ fontSize: '20px' }}>Try a simpler, customizable sidebar</DialogTitle>
            <button onClick={() => setPreviewOpen(false)} className="rounded-sm opacity-70 hover:opacity-100 transition-opacity" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>

          {/* Video area with custom controls */}
          <div
            className="mx-6 rounded-xl overflow-hidden relative"
            style={{ backgroundColor: '#FCEBF2', aspectRatio: '511 / 500' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <video
              ref={videoRef}
              key={previewOpen ? 'open' : 'closed'}
              src={promoVideo}
              preload="none"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full rounded-xl object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleTimeUpdate}
            />

            {/* Custom controls overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2.5 transition-all duration-300 ease-out"
              style={{
                background: 'linear-gradient(transparent, hsla(0, 0%, 0%, 0.35))',
                opacity: controlsVisible ? 1 : 0,
                transform: controlsVisible ? 'translateY(0)' : 'translateY(8px)',
                pointerEvents: controlsVisible ? 'auto' : 'none',
              }}
            >
              <button onClick={togglePlay} className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: '#D20688' }} aria-label={isPlaying ? 'Pause' : 'Play'}>
                <img src={isPlaying ? playerPause : playerPlay} alt="" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
              </button>
              <SegmentedTimeline progress={progress} duration={duration} onSeek={handleSeek} />
            </div>
          </div>

          {/* CTA button */}
          <div className="px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => { setPreviewOpen(false); onTryItOut?.(); }}
              className="rounded-md text-sm font-semibold px-6 py-3 transition-colors text-white"
              style={{ backgroundColor: 'hsl(0, 0%, 0%)' }}
            >
              Try it out
            </button>
            <span className="text-xs text-muted-foreground">You can switch back to your old sidebar anytime</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
