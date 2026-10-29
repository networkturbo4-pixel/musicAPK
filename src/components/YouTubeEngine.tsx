import { useEffect, useRef } from 'react';
import { Song } from '../types';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeEngineProps {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onSongEnded: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onPlayerStateChange?: (isPlaying: boolean) => void;
  seekRequested: number | null;
  onSeekHandled: () => void;
}

export function YouTubeEngine({
  currentSong,
  isPlaying,
  volume,
  isMuted,
  onSongEnded,
  onTimeUpdate,
  onPlayerStateChange,
  seekRequested,
  onSeekHandled,
}: YouTubeEngineProps) {
  const playerRef = useRef<any>(null);
  const isApiReady = useRef<boolean>(false);
  const intervalRef = useRef<any>(null);
  const isInternalChangeRef = useRef<boolean>(false);

  // Load YouTube IFrame API script
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      isApiReady.current = true;
      initPlayer();
      return;
    }

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevOnReady) prevOnReady();
      isApiReady.current = true;
      initPlayer();
    };

    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const initPlayer = () => {
    if (!window.YT || !window.YT.Player || playerRef.current) return;

    playerRef.current = new window.YT.Player('yt-player-container', {
      height: '100',
      width: '100',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(isMuted ? 0 : volume);
          if (currentSong) {
            event.target.cueVideoById(currentSong.videoId);
          }
        },
        onStateChange: (event: any) => {
          const state = event.data;
          // YT.PlayerState: -1: UNSTARTED, 0: ENDED, 1: PLAYING, 2: PAUSED, 3: BUFFERING, 5: CUED
          if (state === 0) {
            onSongEnded();
          } else if (state === 1) {
            isInternalChangeRef.current = true;
            onPlayerStateChange?.(true);
          } else if (state === 2) {
            isInternalChangeRef.current = true;
            onPlayerStateChange?.(false);
          }
        },
        onError: (e: any) => {
          console.warn('YouTube Player error code:', e.data);
          // If video unavailable or embedding not allowed, auto skip to next
          if ([2, 5, 100, 101, 150].includes(e.data)) {
            setTimeout(() => onSongEnded(), 1500);
          }
        },
      },
    });
  };

  // Load new song when currentSong changes
  useEffect(() => {
    if (!playerRef.current || !playerRef.current.loadVideoById || !currentSong) return;

    try {
      if (isPlaying) {
        playerRef.current.loadVideoById(currentSong.videoId);
      } else {
        playerRef.current.cueVideoById(currentSong.videoId);
      }
    } catch (e) {
      console.error('Error loading video in YT Player', e);
    }
  }, [currentSong?.id, currentSong?.videoId]);

  // Handle play / pause state from UI
  useEffect(() => {
    if (!playerRef.current || !playerRef.current.playVideo || !playerRef.current.pauseVideo) return;

    try {
      const state = playerRef.current.getPlayerState?.();
      if (isPlaying && state !== 1 && state !== 3) {
        playerRef.current.playVideo();
      } else if (!isPlaying && state === 1) {
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      console.warn('Error toggling play/pause in YT Player', e);
    }
  }, [isPlaying]);

  // Handle volume & mute
  useEffect(() => {
    if (!playerRef.current || !playerRef.current.setVolume) return;
    try {
      if (isMuted) {
        playerRef.current.mute?.();
      } else {
        playerRef.current.unMute?.();
        playerRef.current.setVolume(volume);
      }
    } catch (e) {
      // ignore
    }
  }, [volume, isMuted]);

  // Handle seek requested
  useEffect(() => {
    if (seekRequested !== null && playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(seekRequested, true);
      } catch (e) {
        // ignore
      }
      onSeekHandled();
    }
  }, [seekRequested]);

  // Polling current playback time
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
        try {
          const currentTime = playerRef.current.getCurrentTime() || 0;
          const duration = playerRef.current.getDuration() || 0;
          onTimeUpdate(currentTime, duration);
        } catch {
          // ignore
        }
      }
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onTimeUpdate]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      <div id="yt-player-container" />
    </div>
  );
}
