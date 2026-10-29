import { Song } from '../types';

export interface MediaSessionCallbacks {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeekTo?: (position: number) => void;
}

export function updateMediaSessionMetadata(song: Song | null, playlistName?: string): void {
  if (!('mediaSession' in navigator)) return;

  if (!song) {
    navigator.mediaSession.metadata = null;
    return;
  }

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: playlistName || 'Soundify Music',
      artwork: [
        {
          src: song.thumbnailUrl,
          sizes: '512x512',
          type: 'image/jpeg',
        },
        {
          src: `https://i.ytimg.com/vi/${song.videoId}/mqdefault.jpg`,
          sizes: '320x180',
          type: 'image/jpeg',
        }
      ],
    });
  } catch (err) {
    console.warn('Error setting MediaSession metadata', err);
  }
}

export function updateMediaSessionPlaybackState(isPlaying: boolean): void {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  } catch (err) {
    console.warn('Error setting MediaSession playback state', err);
  }
}

export function updateMediaSessionPositionState(duration: number, position: number, playbackRate = 1.0): void {
  if (!('mediaSession' in navigator) || !('setPositionState' in navigator.mediaSession)) return;
  try {
    if (duration > 0 && position >= 0 && position <= duration) {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate,
        position,
      });
    }
  } catch (err) {
    // Sometimes throws if duration is 0 or NaN
  }
}

export function setupMediaSessionActionHandlers(callbacks: MediaSessionCallbacks): void {
  if (!('mediaSession' in navigator)) return;

  const actions: Array<{ action: MediaSessionAction; handler: (details?: MediaSessionActionDetails) => void }> = [
    { action: 'play', handler: () => callbacks.onPlay() },
    { action: 'pause', handler: () => callbacks.onPause() },
    { action: 'nexttrack', handler: () => callbacks.onNext() },
    { action: 'previoustrack', handler: () => callbacks.onPrevious() },
    {
      action: 'seekto',
      handler: (details) => {
        if (details && typeof details.seekTime === 'number' && callbacks.onSeekTo) {
          callbacks.onSeekTo(details.seekTime);
        }
      },
    },
    {
      action: 'seekbackward',
      handler: (details) => {
        const offset = details?.seekOffset || 10;
        if (callbacks.onSeekTo) {
          // Will be handled in component if current position is tracked
        }
      }
    },
    {
      action: 'seekforward',
      handler: (details) => {
        const offset = details?.seekOffset || 10;
        if (callbacks.onSeekTo) {
          // Will be handled in component if current position is tracked
        }
      }
    }
  ];

  for (const { action, handler } of actions) {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (err) {
      // Action might not be supported in this browser version
    }
  }
}
