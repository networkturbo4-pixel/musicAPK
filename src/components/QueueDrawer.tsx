import React from 'react';
import { X, Play, Music2 } from 'lucide-react';
import { Song } from '../types';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Song[];
  currentIndex: number;
  onPlaySongAtIndex: (index: number) => void;
}

export function QueueDrawer({
  isOpen,
  onClose,
  queue,
  currentIndex,
  onPlaySongAtIndex,
}: QueueDrawerProps) {
  if (!isOpen) return null;

  const currentSong = queue[currentIndex];
  const nextSongs = queue.slice(currentIndex + 1);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#141419] border-l border-white/10 shadow-2xl flex flex-col animate-slide-left">
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Music2 size={18} className="text-emerald-400" />
          Cola de Reproducción
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg transition hover:bg-white/10"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Currently playing */}
        {currentSong && (
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
              Sonando Ahora
            </h4>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <img
                src={currentSong.thumbnailUrl}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-400 truncate">
                  {currentSong.title}
                </p>
                <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
              </div>
            </div>
          </div>
        )}

        {/* Up next */}
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">
            A continuación ({nextSongs.length})
          </h4>

          {nextSongs.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">
              No hay más canciones en la cola.
            </p>
          ) : (
            <div className="space-y-1.5">
              {nextSongs.map((song, i) => {
                const realIndex = currentIndex + 1 + i;
                return (
                  <div
                    key={`${song.id}-${realIndex}`}
                    onClick={() => onPlaySongAtIndex(realIndex)}
                    className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition"
                  >
                    <img
                      src={song.thumbnailUrl}
                      alt={song.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition">
                        {song.title}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{song.artist}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
