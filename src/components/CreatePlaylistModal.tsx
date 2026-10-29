import React, { useState } from 'react';
import { X, ListPlus, Sparkles } from 'lucide-react';
import { Playlist } from '../types';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (playlist: Playlist) => void;
}

const ACCENT_COLORS = [
  '#1db954', // Spotify Green
  '#8a2be2', // Purple
  '#e11d48', // Crimson Red
  '#2563eb', // Royal Blue
  '#d97706', // Amber
  '#0d9488', // Teal
  '#db2777', // Hot Pink
];

export function CreatePlaylistModal({ isOpen, onClose, onCreate }: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(ACCENT_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Mi lista de reproducción personalizada.',
      accentColor: selectedColor,
      createdAt: Date.now(),
      isCustom: true,
      songs: [],
    };

    onCreate(newPlaylist);
    setName('');
    setDescription('');
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
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl">
            <ListPlus size={26} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Nueva Playlist</h2>
            <p className="text-xs text-gray-400">Organiza tus canciones favoritas de YouTube</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Nombre de la Playlist
            </label>
            <input
              type="text"
              placeholder="Ej. Mis Favoritas 2026, Gym Vibes..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Descripción (Opcional)
            </label>
            <textarea
              placeholder="Describe de qué trata esta lista..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
              Color de Acento
            </label>
            <div className="flex items-center gap-3">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-80 hover:opacity-100 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-full text-sm transition shadow-lg shadow-emerald-500/20"
            >
              Crear Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
