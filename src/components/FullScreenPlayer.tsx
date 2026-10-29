import React from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Bluetooth,
  ListMusic,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Song } from '../types';
import { formatTime } from '../utils/formatTime';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  playlistName?: string;
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
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onToggleFavorite: () => void;
  onOpenBluetoothModal: () => void;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
}

export function FullScreenPlayer({
  isOpen,
  onClose,
  currentSong,
  playlistName,
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
  onToggleShuffle,
  onCycleRepeat,
  onToggleFavorite,
  onOpenBluetoothModal,
  onVolumeChange,
  onToggleMute,
}: FullScreenPlayerProps) {
  if (!isOpen || !currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0c10] text-white overflow-hidden animate-fade-in">
      {/* Background blurred album art */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-125 pointer-events-none"
        style={{ backgroundImage: `url(${currentSong.thumbnailUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0b0c10] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          onClick={onClose}
          className="p-2 text-gray-300 hover:text-white rounded-full bg-white/5 active:scale-95 transition"
        >
          <ChevronDown size={24} />
        </button>

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
            Reproduciendo desde lista
          </p>
          <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px]">
            {playlistName || 'Soundify Music'}
          </h3>
        </div>

        <a
          href={`https://www.youtube.com/watch?v=${currentSong.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-300 hover:text-white rounded-full bg-white/5 active:scale-95 transition"
          title="Abrir en YouTube"
        >
          <ExternalLink size={20} />
        </a>
      </header>

      {/* Center Main Art */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-4">
        <div className="relative group w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10">
          <img
            src={currentSong.thumbnailUrl}
            alt={currentSong.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          />
          {isPlaying && (
            <div className="absolute bottom-3 right-3 flex items-end gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Title & Artist & Favorite */}
        <div className="w-full max-w-sm mt-8 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
              {currentSong.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 truncate mt-1">
              {currentSong.artist}
            </p>
          </div>
          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-full transition active:scale-90 ${
              isFavorite ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart size={26} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </main>

      {/* Bottom Controls Area */}
      <footer className="relative z-10 px-8 pb-10 max-w-md mx-auto w-full">
        {/* Progress Bar & Timers */}
        <div className="mb-6">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            style={{
              background: `linear-gradient(to right, #10b981 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
            }}
          />
          <div className="flex justify-between text-xs font-mono text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Big Control Buttons */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onToggleShuffle}
            className={`p-3 rounded-full transition ${
              isShuffle ? 'text-emerald-400' : 'text-gray-400'
            }`}
          >
            <Shuffle size={22} />
          </button>

          <button
            onClick={onPrevious}
            className="p-3 text-white hover:text-emerald-400 active:scale-90 transition"
          >
            <SkipBack size={30} fill="currentColor" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-18 h-18 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black flex items-center justify-center transition shadow-xl shadow-emerald-500/25"
          >
            {isPlaying ? (
              <Pause size={34} fill="currentColor" />
            ) : (
              <Play size={34} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-3 text-white hover:text-emerald-400 active:scale-90 transition"
          >
            <SkipForward size={30} fill="currentColor" />
          </button>

          <button
            onClick={onCycleRepeat}
            className={`p-3 rounded-full transition ${
              repeatMode !== 'off' ? 'text-emerald-400' : 'text-gray-400'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
          </button>
        </div>

        {/* Bluetooth Device Banner */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <button
            onClick={onOpenBluetoothModal}
            className="flex items-center gap-2 text-emerald-400 font-medium hover:underline"
          >
            <Bluetooth size={16} />
            <span>Transmitiendo por Bluetooth / Auriculares</span>
          </button>

          <div className="flex items-center gap-2 text-gray-400">
            <button onClick={onToggleMute} className="hover:text-white">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-20 h-1 bg-white/20 rounded-lg accent-emerald-400"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
