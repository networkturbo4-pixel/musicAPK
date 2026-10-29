export interface Song {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  addedAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  coverUrl?: string;
  songs: Song[];
  createdAt: number;
  isCustom?: boolean;
}

export type PlaybackMode = 'normal' | 'repeat-one' | 'repeat-all' | 'shuffle';

export interface PlayerState {
  currentSong: Song | null;
  currentPlaylistId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 100
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  playbackQueue: Song[];
  queueIndex: number;
}
