import { Playlist, Song } from '../types';

const STORAGE_KEY_PLAYLISTS = 'soundify_playlists_v1';
const STORAGE_KEY_FAVORITES = 'soundify_favorites_v1';
const STORAGE_KEY_HISTORY = 'soundify_history_v1';

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-pop-hits',
    name: 'Top Éxitos Globales',
    description: 'Los mayores éxitos y tendencias del momento en YouTube.',
    accentColor: '#1db954',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now(),
    songs: [
      {
        id: 'song-1',
        videoId: 'kJQP7kiw5Fk',
        title: 'Despacito',
        artist: 'Luis Fonsi ft. Daddy Yankee',
        thumbnailUrl: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
        duration: 282,
        addedAt: Date.now() - 3600000 * 5,
      },
      {
        id: 'song-2',
        videoId: 'JGwWNGJdvx8',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        thumbnailUrl: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
        duration: 263,
        addedAt: Date.now() - 3600000 * 4,
      },
      {
        id: 'song-3',
        videoId: 'fJ9rUzIMcZQ',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        thumbnailUrl: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
        duration: 359,
        addedAt: Date.now() - 3600000 * 3,
      },
      {
        id: 'song-4',
        videoId: '09R8_2nJtjg',
        title: 'Sugar',
        artist: 'Maroon 5',
        thumbnailUrl: 'https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg',
        duration: 300,
        addedAt: Date.now() - 3600000 * 2,
      },
    ],
  },
  {
    id: 'playlist-lofi-chill',
    name: 'Lofi & Chill para Concentrarse',
    description: 'Ritmos relajantes para estudiar, trabajar o conducir conectado al Bluetooth.',
    accentColor: '#8a2be2',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now(),
    songs: [
      {
        id: 'song-5',
        videoId: 'jfKfPfyJRdk',
        title: 'beats to relax/study to',
        artist: 'Lofi Girl',
        thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
        duration: 180,
        addedAt: Date.now() - 7200000,
      },
      {
        id: 'song-6',
        videoId: '5qap5aO4i9A',
        title: 'Lofi Hip Hop Radio',
        artist: 'ChilledCow / Lofi Girl',
        thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
        duration: 210,
        addedAt: Date.now() - 3600000,
      }
    ],
  },
  {
    id: 'playlist-rock-vibes',
    name: 'Rock Classics en Español & Inglés',
    description: 'Guitarras legendarias y energía pura para el camino.',
    accentColor: '#e11d48',
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now(),
    songs: [
      {
        id: 'song-7',
        videoId: '1w7OgIMMRc4',
        title: 'Sweet Child O\' Mine',
        artist: 'Guns N\' Roses',
        thumbnailUrl: 'https://i.ytimg.com/vi/1w7OgIMMRc4/hqdefault.jpg',
        duration: 302,
        addedAt: Date.now() - 5000000,
      },
      {
        id: 'song-8',
        videoId: 'hTWKbfoikeg',
        title: 'Smells Like Teen Spirit',
        artist: 'Nirvana',
        thumbnailUrl: 'https://i.ytimg.com/vi/hTWKbfoikeg/hqdefault.jpg',
        duration: 278,
        addedAt: Date.now() - 4000000,
      },
      {
        id: 'song-9',
        videoId: 'Kj_K7mF7ZpQ',
        title: 'De Música Ligera',
        artist: 'Soda Stereo',
        thumbnailUrl: 'https://i.ytimg.com/vi/Kj_K7mF7ZpQ/hqdefault.jpg',
        duration: 218,
        addedAt: Date.now() - 3000000,
      }
    ]
  }
];

export function loadPlaylists(): Playlist[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PLAYLISTS);
    if (!data) {
      savePlaylists(INITIAL_PLAYLISTS);
      return INITIAL_PLAYLISTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PLAYLISTS;
  } catch (e) {
    console.error('Error loading playlists', e);
    return INITIAL_PLAYLISTS;
  }
}

export function savePlaylists(playlists: Playlist[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(playlists));
  } catch (e) {
    console.error('Error saving playlists', e);
  }
}

export function loadFavorites(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favIds));
  } catch (e) {
    console.error('Error saving favorites', e);
  }
}
