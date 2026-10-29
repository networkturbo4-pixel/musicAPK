import React from 'react';
import {
  Play,
  Pause,
  Shuffle,
  Plus,
  Trash2,
  Heart,
  Clock,
  Music,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { Playlist, Song } from '../types';
import { formatTime } from '../utils/formatTime';

interface PlaylistViewProps {
  playlist: Playlist;
  currentSong: Song | null;
  isPlaying: boolean;
  favorites: string[];
  onPlaySong: (song: Song, playlistId: string) => void;
  onTogglePlay: () => void;
  onPlayAll: () => void;
  onShufflePlay: () => void;
  onOpenAddModal: () => void;
  onRemoveSong: (songId: string) => void;
  onToggleFavorite: (songId: string) => void;
}

export function PlaylistView({
  playlist,
  currentSong,
  isPlaying,
  favorites,
  onPlaySong,
  onTogglePlay,
  onPlayAll,
  onShufflePlay,
  onOpenAddModal,
  onRemoveSong,
  onToggleFavorite,
}: PlaylistViewProps) {
  const isCurrentPlaylist = currentSong && playlist.songs.some((s) => s.id === currentSong.id);
  const totalDuration = playlist.songs.reduce((acc, s) => acc + (s.duration || 180), 0);

  return (
    <div className="flex-1 overflow-y-auto pb-28">
      {/* Header Banner with Dynamic Accent Gradient */}
      <div
        className="relative p-6 sm:p-8 pt-10 sm:pt-14 pb-8 transition-colors duration-500"
        style={{
          background: `linear-gradient(180deg, ${playlist.accentColor}cc 0%, #121216 100%)`,
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 max-w-6xl mx-auto">
          {/* Cover Art */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 bg-black/40 border border-white/10 group relative flex items-center justify-center">
            {playlist.coverUrl ? (
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: playlist.accentColor }}
              >
                <Music size={64} className="text-white/80" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-white/80">
              Playlist Oficial
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mt-1 tracking-tight">
              {playlist.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-2xl">
              {playlist.description}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-300 mt-3 font-medium">
              <span className="text-white font-semibold">{playlist.songs.length} canciones</span>
              <span>•</span>
              <span>{Math.round(totalDuration / 60)} min aprox</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-black/30 text-emerald-400 font-mono">
                YouTube Audio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (isCurrentPlaylist) {
                onTogglePlay();
              } else {
                onPlayAll();
              }
            }}
            disabled={playlist.songs.length === 0}
            className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-40 text-black flex items-center justify-center shadow-xl shadow-emerald-500/30 transition cursor-pointer"
            title="Reproducir Playlist"
          >
            {isCurrentPlaylist && isPlaying ? (
              <Pause size={26} fill="currentColor" />
            ) : (
              <Play size={26} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button
            onClick={onShufflePlay}
            disabled={playlist.songs.length === 0}
            className="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Reproducir en orden aleatorio"
          >
            <Shuffle size={22} />
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold rounded-full border border-white/10 transition shadow-sm"
          >
            <Plus size={18} className="text-emerald-400" />
            <span>Pegar URL de YouTube</span>
          </button>
        </div>
      </div>

      {/* Song List Table */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {playlist.songs.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-white/10 rounded-2xl bg-white/5 my-6">
            <Music size={48} className="mx-auto text-gray-500 mb-3" />
            <h3 className="text-lg font-semibold text-white">Esta lista está vacía</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Copia y pega la URL de cualquier canción o video de YouTube para empezar a armar tu colección.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm rounded-full transition shadow-lg shadow-emerald-500/20"
            >
              <Plus size={16} />
              <span>Agregar primera canción</span>
            </button>
          </div>
        ) : (
          <div className="w-full">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/10 select-none">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6">Título y Artista</div>
              <div className="col-span-3">Origen</div>
              <div className="col-span-2 text-right flex items-center justify-end gap-1">
                <Clock size={14} />
              </div>
            </div>

            {/* Song Rows */}
            <div className="divide-y divide-white/5">
              {playlist.songs.map((song, index) => {
                const isSelected = currentSong?.id === song.id;
                const isFav = favorites.includes(song.id);

                return (
                  <div
                    key={song.id}
                    className={`group grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-3 sm:px-4 py-3 rounded-xl transition cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 text-emerald-400'
                        : 'hover:bg-white/5 text-gray-200'
                    }`}
                    onClick={() => onPlaySong(song, playlist.id)}
                  >
                    {/* Index / Play Button */}
                    <div className="hidden sm:flex col-span-1 items-center justify-center text-xs font-mono text-gray-400">
                      <span className="group-hover:hidden">
                        {isSelected && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 h-3 bg-emerald-400 animate-bounce" />
                            <span className="w-0.5 h-2 bg-emerald-400 animate-bounce delay-100" />
                            <span className="w-0.5 h-3.5 bg-emerald-400 animate-bounce delay-200" />
                          </div>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            onTogglePlay();
                          } else {
                            onPlaySong(song, playlist.id);
                          }
                        }}
                        className="hidden group-hover:block p-1 text-white hover:text-emerald-400 transition"
                      >
                        {isSelected && isPlaying ? (
                          <Pause size={16} fill="currentColor" />
                        ) : (
                          <Play size={16} fill="currentColor" />
                        )}
                      </button>
                    </div>

                    {/* Thumbnail & Title */}
                    <div className="col-span-1 sm:col-span-6 flex items-center gap-3 min-w-0">
                      <img
                        src={song.thumbnailUrl}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover shadow shrink-0 bg-black/40"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isSelected ? 'text-emerald-400' : 'text-white'
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    {/* Source YouTube Link */}
                    <div className="hidden sm:flex col-span-3 items-center gap-2 text-xs text-gray-400">
                      <a
                        href={`https://www.youtube.com/watch?v=${song.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 hover:text-red-400 transition"
                      >
                        <span>YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    {/* Actions & Duration */}
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 text-xs text-gray-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(song.id);
                        }}
                        className={`p-1.5 transition rounded-full ${
                          isFav ? 'text-emerald-400' : 'hover:text-white'
                        }`}
                        title={isFav ? 'Quitar de favoritos' : 'Favorito'}
                      >
                        <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                      </button>

                      <span className="font-mono">
                        {song.duration > 0 ? formatTime(song.duration) : '3:45'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSong(song.id);
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition"
                        title="Eliminar canción de esta lista"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
