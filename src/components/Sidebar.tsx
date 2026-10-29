import {
  ListMusic,
  Plus,
  Heart,
  Music2,
  Trash2,
  Bluetooth,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import type { Playlist } from '../types';
import { APP_CURRENT_VERSION } from '../services/updateService';

interface SidebarProps {
  playlists: Playlist[];
  activePlaylistId: string | null;
  onSelectPlaylist: (id: string) => void;
  onOpenCreateModal: () => void;
  onOpenBluetoothModal: () => void;
  onOpenUpdateModal: () => void;
  hasUpdateAvailable: boolean;
  onDeletePlaylist: (id: string) => void;
  favoritesCount: number;
  onSelectFavorites: () => void;
  isFavoritesActive: boolean;
}

export function Sidebar({
  playlists,
  activePlaylistId,
  onSelectPlaylist,
  onOpenCreateModal,
  onOpenBluetoothModal,
  onOpenUpdateModal,
  hasUpdateAvailable,
  onDeletePlaylist,
  favoritesCount,
  onSelectFavorites,
  isFavoritesActive,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-[#101014] border-r border-white/5 flex flex-col h-full select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Music2 size={20} className="text-black" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              Soundify <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">YT</span>
            </h1>
            <p className="text-[10px] text-gray-400">Bluetooth & YouTube APK</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="px-3 py-4 space-y-1">
        <button
          onClick={onSelectFavorites}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
            isFavoritesActive
              ? 'bg-white/10 text-white font-semibold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white shrink-0">
            <Heart size={14} fill="currentColor" />
          </div>
          <span className="flex-1 text-left">Canciones que te gustan</span>
          {favoritesCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
              {favoritesCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenBluetoothModal}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Bluetooth size={14} />
          </div>
          <span className="flex-1 text-left">Modo Bluetooth</span>
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        </button>
      </div>

      {/* Playlists Section */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-white/5 pt-3">
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
            <ListMusic size={14} />
            Mis Playlists
          </span>
          <button
            onClick={onOpenCreateModal}
            className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Crear nueva playlist"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Scrollable list of playlists */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {playlists.map((pl) => {
            const isActive = !isFavoritesActive && activePlaylistId === pl.id;
            return (
              <div
                key={pl.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm cursor-pointer transition ${
                  isActive
                    ? 'bg-white/10 text-white font-medium shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => onSelectPlaylist(pl.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: pl.accentColor || '#10b981' }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm">{pl.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {pl.songs.length} {pl.songs.length === 1 ? 'canción' : 'canciones'}
                    </p>
                  </div>
                </div>

                {pl.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`¿Eliminar la lista "${pl.name}"?`)) {
                        onDeletePlaylist(pl.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition rounded"
                    title="Eliminar lista"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Update Status & Version */}
      <div className="p-3 border-t border-white/5 bg-black/20">
        <button
          onClick={onOpenUpdateModal}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
            hasUpdateAvailable
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className={hasUpdateAvailable ? 'text-emerald-400' : ''} />
            <span>{hasUpdateAvailable ? '¡Actualizar APK!' : 'Buscar versión'}</span>
          </div>
          <span className="font-mono text-[10px] text-gray-500">v{APP_CURRENT_VERSION}</span>
        </button>
      </div>
    </aside>
  );
}
