import { useState, useEffect } from 'react';
import { X, Loader2, Plus, AlertCircle, Play } from 'lucide-react';
import type { Playlist, Song } from '../types';
import { extractYouTubeVideoId, fetchYouTubeMetadata } from '../services/youtubeService';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  currentPlaylistId: string | null;
  onAddSong: (playlistId: string, song: Song) => void;
}

export function AddSongModal({
  isOpen,
  onClose,
  playlists,
  currentPlaylistId,
  onAddSong,
}: AddSongModalProps) {
  const [url, setUrl] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(currentPlaylistId || playlists[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    videoId: string;
    title: string;
    artist: string;
    thumbnailUrl: string;
  } | null>(null);

  useEffect(() => {
    if (currentPlaylistId) {
      setSelectedPlaylistId(currentPlaylistId);
    } else if (playlists.length > 0 && !selectedPlaylistId) {
      setSelectedPlaylistId(playlists[0].id);
    }
  }, [currentPlaylistId, playlists]);

  // When URL changes, automatically detect and preview
  useEffect(() => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      setPreview(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const meta = await fetchYouTubeMetadata(url);
        if (isMounted) {
          setPreview(meta);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error al obtener datos del video.');
          setIsLoading(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [url]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!preview || !selectedPlaylistId) return;

    const newSong: Song = {
      id: `song-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      videoId: preview.videoId,
      title: preview.title,
      artist: preview.artist,
      thumbnailUrl: preview.thumbnailUrl,
      duration: 0, // will be resolved when player plays it
      addedAt: Date.now(),
    };

    onAddSong(selectedPlaylistId, newSong);
    setUrl('');
    setPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#18181f] border border-white/10 rounded-2xl p-6 shadow-2xl text-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Agregar Canción</h2>
            <p className="text-xs text-gray-400">Pega cualquier enlace de YouTube o YouTube Shorts</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Enlace de YouTube
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=... o youtu.be/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
              {isLoading && (
                <div className="absolute right-3 top-3 text-emerald-400 animate-spin">
                  <Loader2 size={20} />
                </div>
              )}
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
                <AlertCircle size={14} /> {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Playlist de Destino
            </label>
            <select
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              className="w-full bg-[#202028] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              {playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name} ({pl.songs.length} canciones)
                </option>
              ))}
            </select>
          </div>

          {/* Live Preview Card */}
          {preview && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 animate-fade-in">
              <img
                src={preview.thumbnailUrl}
                alt={preview.title}
                className="w-16 h-16 object-cover rounded-lg shrink-0 shadow"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-emerald-400 font-semibold mb-0.5">Vista previa detectada</p>
                <p className="text-sm font-semibold text-white truncate">{preview.title}</p>
                <p className="text-xs text-gray-400 truncate">{preview.artist}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            disabled={!preview || isLoading}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition ${
              preview && !isLoading
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 cursor-pointer'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={18} />
            <span>Agregar a Playlist</span>
          </button>
        </div>
      </div>
    </div>
  );
}
