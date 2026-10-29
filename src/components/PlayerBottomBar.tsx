import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Maximize2,
  Heart,
  Bluetooth,
  ListMusic
} from 'lucide-react';
import { Song } from '../types';
import { formatTime } from '../utils/formatTime';

interface PlayerBottomBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isFavorite: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onToggleFavorite: () => void;
  onOpenBluetoothModal: () => void;
  onToggleFullScreen: () => void;
  onToggleQueue?: () => void;
}

export function PlayerBottomBar({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  isFavorite,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onCycleRepeat,
  onToggleFavorite,
  onOpenBluetoothModal,
  onToggleFullScreen,
  onToggleQueue,
}: PlayerBottomBarProps) {
  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#121216]/95 border-t border-white/10 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Left: Song Info & Artwork */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 w-1/3 sm:w-1/4">
          <div
            onClick={onToggleFullScreen}
            className="relative group cursor-pointer shrink-0 rounded-lg overflow-hidden w-12 h-12 sm:w-14 sm:h-14 bg-black/40 shadow-md"
          >
            <img
              src={currentSong.thumbnailUrl}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition duration-300 ${isPlaying ? 'scale-105' : 'group-hover:scale-105'}`}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Maximize2 size={16} className="text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h4
              onClick={onToggleFullScreen}
              className="text-xs sm:text-sm font-semibold text-white truncate cursor-pointer hover:underline"
            >
              {currentSong.title}
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-400 truncate">
              {currentSong.artist}
            </p>
          </div>

          <button
            onClick={onToggleFavorite}
            className={`p-1.5 sm:p-2 rounded-full transition ${
              isFavorite ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
            }`}
            title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 max-w-xl">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={onToggleShuffle}
              className={`p-1.5 transition rounded-full ${
                isShuffle ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
              title={isShuffle ? 'Desactivar aleatorio' : 'Activar aleatorio'}
            >
              <Shuffle size={16} />
            </button>

            <button
              onClick={onPrevious}
              className="p-1.5 text-gray-300 hover:text-white transition"
              title="Anterior"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition shadow-lg shadow-white/10"
              title={isPlaying ? 'Pausa' : 'Reproducir'}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>

            <button
              onClick={onNext}
              className="p-1.5 text-gray-300 hover:text-white transition"
              title="Siguiente"
            >
              <SkipForward size={20} />
            </button>

            <button
              onClick={onCycleRepeat}
              className={`p-1.5 transition rounded-full ${
                repeatMode !== 'off' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
              title={`Repetir: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          {/* Progress Bar & Timers */}
          <div className="w-full flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs text-gray-400 font-mono w-9 text-right">
              {formatTime(currentTime)}
            </span>

            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400 group-hover:h-1.5 transition-all"
                style={{
                  background: `linear-gradient(to right, #10b981 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
                }}
              />
            </div>

            <span className="text-[10px] sm:text-xs text-gray-400 font-mono w-9">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume, Bluetooth & Fullscreen */}
        <div className="hidden sm:flex items-center justify-end gap-3 w-1/4">
          <button
            onClick={onOpenBluetoothModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/20 transition"
            title="Bluetooth conectado / opciones"
          >
            <Bluetooth size={14} />
            <span>Bluetooth</span>
          </button>

          {onToggleQueue && (
            <button
              onClick={onToggleQueue}
              className="p-2 text-gray-400 hover:text-white transition"
              title="Cola de reproducción"
            >
              <ListMusic size={18} />
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="p-1.5 text-gray-400 hover:text-white transition"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          <button
            onClick={onToggleFullScreen}
            className="p-2 text-gray-400 hover:text-white transition"
            title="Pantalla completa"
          >
            <Maximize2 size={18} />
          </button>
        </div>

      </div>
    </footer>
  );
}
