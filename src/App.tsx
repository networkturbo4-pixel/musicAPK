import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Playlist, Song } from './types';
import {
  loadPlaylists,
  savePlaylists,
  loadFavorites,
  saveFavorites,
} from './services/storage';
import {
  updateMediaSessionMetadata,
  updateMediaSessionPlaybackState,
  updateMediaSessionPositionState,
  setupMediaSessionActionHandlers,
} from './services/mediaSession';
import {
  checkForUpdates,
  type UpdateInfo,
  APP_CURRENT_VERSION,
} from './services/updateService';
import { YouTubeEngine } from './components/YouTubeEngine';
import { Sidebar } from './components/Sidebar';
import { PlaylistView } from './components/PlaylistView';
import { PlayerBottomBar } from './components/PlayerBottomBar';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { AddSongModal } from './components/AddSongModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { BluetoothModal } from './components/BluetoothModal';
import { QueueDrawer } from './components/QueueDrawer';
import { UpdateModal } from './components/UpdateModal';
import {
  Music2,
  Plus,
  Heart,
  Bluetooth,
  Menu,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => loadPlaylists());
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());
  const [activePlaylistId, setActivePlaylistId] = useState<string>(() => playlists[0]?.id || '');
  const [isFavoritesActive, setIsFavoritesActive] = useState<boolean>(false);

  // Modals state
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isBluetoothOpen, setIsBluetoothOpen] = useState(false);
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Updater state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [hasUpdateAvailable, setHasUpdateAvailable] = useState(false);
  const [updateCheckError, setUpdateCheckError] = useState<string | undefined>(undefined);

  // Player state
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [, setCurrentPlaylistId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [seekRequested, setSeekRequested] = useState<number | null>(null);

  // Auto check for updates on startup (after 3 seconds)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const result = await checkForUpdates();
        if (result.hasUpdate && result.updateInfo) {
          setHasUpdateAvailable(true);
          setUpdateInfo(result.updateInfo);
        }
      } catch (err) {
        // ignore background error
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleManualCheckUpdates = useCallback(async () => {
    setIsCheckingUpdate(true);
    setUpdateCheckError(undefined);
    setIsUpdateModalOpen(true);
    try {
      const res = await checkForUpdates();
      setHasUpdateAvailable(res.hasUpdate);
      setUpdateInfo(res.updateInfo);
      setUpdateCheckError(res.error);
    } catch (e: any) {
      setUpdateCheckError(e.message || 'Error al conectar con GitHub');
    } finally {
      setIsCheckingUpdate(false);
    }
  }, []);

  // Persist playlists
  useEffect(() => {
    savePlaylists(playlists);
  }, [playlists]);

  // Persist favorites
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Active playlist computed
  const activePlaylist = useMemo(() => {
    if (isFavoritesActive) {
      const allSongs = playlists.flatMap((p) => p.songs);
      const favSongs = allSongs.filter((s, idx, self) =>
        favorites.includes(s.id) && self.findIndex((item) => item.id === s.id) === idx
      );

      return {
        id: 'favorites-playlist',
        name: 'Tus Canciones Favoritas',
        description: 'Colección de canciones que has marcado con me gusta.',
        accentColor: '#ec4899',
        songs: favSongs,
        createdAt: 0,
      } as Playlist;
    }

    return playlists.find((p) => p.id === activePlaylistId) || playlists[0] || null;
  }, [playlists, activePlaylistId, isFavoritesActive, favorites]);

  // Handle Play a song
  const handlePlaySong = useCallback((song: Song, playlistId: string) => {
    const targetPlaylist = isFavoritesActive
      ? activePlaylist
      : playlists.find((p) => p.id === playlistId);

    if (!targetPlaylist) return;

    let newQueue = [...targetPlaylist.songs];
    let newIndex = newQueue.findIndex((s) => s.id === song.id);

    if (newIndex === -1) {
      newQueue = [song, ...newQueue];
      newIndex = 0;
    }

    if (isShuffle) {
      const remaining = newQueue.filter((s) => s.id !== song.id).sort(() => Math.random() - 0.5);
      newQueue = [song, ...remaining];
      newIndex = 0;
    }

    setQueue(newQueue);
    setQueueIndex(newIndex);
    setCurrentSong(song);
    setCurrentPlaylistId(playlistId);
    setIsPlaying(true);
    setCurrentTime(0);
  }, [playlists, isFavoritesActive, activePlaylist, isShuffle]);

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    if (!currentSong) {
      if (activePlaylist && activePlaylist.songs.length > 0) {
        handlePlaySong(activePlaylist.songs[0], activePlaylist.id);
      }
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [currentSong, activePlaylist, handlePlaySong]);

  // Play Next Song
  const handleNext = useCallback(() => {
    if (queue.length === 0) return;

    if (repeatMode === 'one' && currentSong) {
      setSeekRequested(0);
      setIsPlaying(true);
      return;
    }

    let nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setQueueIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [queue, queueIndex, repeatMode, currentSong]);

  // Play Previous Song
  const handlePrevious = useCallback(() => {
    if (queue.length === 0) return;

    if (currentTime > 3) {
      setSeekRequested(0);
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    setQueueIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [queue, queueIndex, currentTime]);

  // Song ended event from YouTube
  const handleSongEnded = useCallback(() => {
    handleNext();
  }, [handleNext]);

  // Seek handler
  const handleSeek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    setSeekRequested(seconds);
    updateMediaSessionPositionState(duration, seconds);
  }, [duration]);

  // Time update from YouTube engine
  const handleTimeUpdate = useCallback((currTime: number, totalDuration: number) => {
    setCurrentTime(currTime);
    if (totalDuration > 0 && totalDuration !== duration) {
      setDuration(totalDuration);
    }
    updateMediaSessionPositionState(totalDuration || duration, currTime);
  }, [duration]);

  // Play All in current playlist
  const handlePlayAll = useCallback(() => {
    if (activePlaylist && activePlaylist.songs.length > 0) {
      handlePlaySong(activePlaylist.songs[0], activePlaylist.id);
    }
  }, [activePlaylist, handlePlaySong]);

  // Shuffle Play in current playlist
  const handleShufflePlay = useCallback(() => {
    if (!activePlaylist || activePlaylist.songs.length === 0) return;
    setIsShuffle(true);
    const randomIndex = Math.floor(Math.random() * activePlaylist.songs.length);
    handlePlaySong(activePlaylist.songs[randomIndex], activePlaylist.id);
  }, [activePlaylist, handlePlaySong]);

  // Repeat Mode cycle: off -> all -> one -> off
  const handleCycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Shuffle toggle
  const handleToggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev);
  }, []);

  // Favorite toggle
  const handleToggleFavorite = useCallback((songId: string) => {
    setFavorites((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  }, []);

  // Add Song to playlist
  const handleAddSong = useCallback((playlistId: string, song: Song) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return {
            ...pl,
            songs: [song, ...pl.songs],
          };
        }
        return pl;
      })
    );
  }, []);

  // Remove Song from active playlist
  const handleRemoveSong = useCallback((songId: string) => {
    if (!activePlaylist) return;
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === activePlaylist.id) {
          return {
            ...pl,
            songs: pl.songs.filter((s) => s.id !== songId),
          };
        }
        return pl;
      })
    );
  }, [activePlaylist]);

  // Create new Playlist
  const handleCreatePlaylist = useCallback((newPlaylist: Playlist) => {
    setPlaylists((prev) => [...prev, newPlaylist]);
    setActivePlaylistId(newPlaylist.id);
    setIsFavoritesActive(false);
  }, []);

  // Delete Playlist
  const handleDeletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (activePlaylistId === id && filtered.length > 0) {
        setActivePlaylistId(filtered[0].id);
      }
      return filtered;
    });
  }, [activePlaylistId]);

  // MediaSession Action Handlers setup
  useEffect(() => {
    setupMediaSessionActionHandlers({
      onPlay: () => setIsPlaying(true),
      onPause: () => setIsPlaying(false),
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSeekTo: handleSeek,
    });
  }, [handleNext, handlePrevious, handleSeek]);

  // Update MediaSession metadata
  useEffect(() => {
    updateMediaSessionMetadata(currentSong, activePlaylist?.name);
  }, [currentSong, activePlaylist?.name]);

  // Update MediaSession state
  useEffect(() => {
    updateMediaSessionPlaybackState(isPlaying);
  }, [isPlaying]);

  return (
    <div className="flex h-screen w-screen bg-[#0c0d11] text-gray-100 overflow-hidden font-sans select-none">
      {/* Hidden YouTube Engine */}
      <YouTubeEngine
        currentSong={currentSong}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        onSongEnded={handleSongEnded}
        onTimeUpdate={handleTimeUpdate}
        onPlayerStateChange={(playing) => setIsPlaying(playing)}
        seekRequested={seekRequested}
        onSeekHandled={() => setSeekRequested(null)}
      />

      {/* Desktop / Tablet Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          playlists={playlists}
          activePlaylistId={activePlaylistId}
          onSelectPlaylist={(id) => {
            setActivePlaylistId(id);
            setIsFavoritesActive(false);
          }}
          onOpenCreateModal={() => setIsCreatePlaylistOpen(true)}
          onOpenBluetoothModal={() => setIsBluetoothOpen(true)}
          onOpenUpdateModal={handleManualCheckUpdates}
          hasUpdateAvailable={hasUpdateAvailable}
          onDeletePlaylist={handleDeletePlaylist}
          favoritesCount={favorites.length}
          onSelectFavorites={() => setIsFavoritesActive(true)}
          isFavoritesActive={isFavoritesActive}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#16171f] to-[#0c0d11]">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-white/5 bg-[#101014]/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              <Menu size={22} />
            </button>
            <div className="flex md:hidden items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black">
                <Music2 size={16} />
              </div>
              <span className="font-bold text-sm text-white">Soundify</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {hasUpdateAvailable && (
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold border border-emerald-500/30 animate-pulse transition"
              >
                <RefreshCw size={13} />
                <span>Actualización v{updateInfo?.version}</span>
              </button>
            )}

            <button
              onClick={() => setIsBluetoothOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-semibold border border-blue-500/25 transition cursor-pointer"
            >
              <Bluetooth size={14} />
              <span className="hidden sm:inline">Bluetooth / Coche</span>
            </button>

            <button
              onClick={() => setIsAddSongOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Plus size={16} />
              <span>Pegar URL</span>
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden p-4 bg-[#14141a] border-b border-white/10 space-y-2 animate-fade-in">
            <button
              onClick={() => {
                setIsFavoritesActive(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
            >
              <Heart size={16} className="text-pink-400" />
              <span>Canciones Favoritas ({favorites.length})</span>
            </button>

            <button
              onClick={() => {
                setIsCreatePlaylistOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
            >
              <Plus size={16} className="text-emerald-400" />
              <span>Crear Nueva Playlist</span>
            </button>

            <button
              onClick={() => {
                handleManualCheckUpdates();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-emerald-400 hover:bg-white/5 font-medium"
            >
              <RefreshCw size={16} />
              <span>Comprobar Actualizaciones (v{APP_CURRENT_VERSION})</span>
            </button>

            <div className="pt-2 border-t border-white/10">
              <p className="text-[11px] text-gray-400 font-semibold px-3 mb-1">Tus Playlists:</p>
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => {
                    setActivePlaylistId(pl.id);
                    setIsFavoritesActive(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white truncate"
                >
                  • {pl.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Playlist View */}
        {activePlaylist && (
          <PlaylistView
            playlist={activePlaylist}
            currentSong={currentSong}
            isPlaying={isPlaying}
            favorites={favorites}
            onPlaySong={handlePlaySong}
            onTogglePlay={handleTogglePlay}
            onPlayAll={handlePlayAll}
            onShufflePlay={handleShufflePlay}
            onOpenAddModal={() => setIsAddSongOpen(true)}
            onRemoveSong={handleRemoveSong}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      {/* Spotify Bottom Player Bar */}
      <PlayerBottomBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        isFavorite={currentSong ? favorites.includes(currentSong.id) : false}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onVolumeChange={(val) => setVolume(val)}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onToggleShuffle={handleToggleShuffle}
        onCycleRepeat={handleCycleRepeat}
        onToggleFavorite={() => currentSong && handleToggleFavorite(currentSong.id)}
        onOpenBluetoothModal={() => setIsBluetoothOpen(true)}
        onToggleFullScreen={() => setIsFullScreenPlayerOpen(true)}
        onToggleQueue={() => setIsQueueOpen((prev) => !prev)}
      />

      {/* Fullscreen Player for Mobile or expanded mode */}
      <FullScreenPlayer
        isOpen={isFullScreenPlayerOpen}
        onClose={() => setIsFullScreenPlayerOpen(false)}
        currentSong={currentSong}
        playlistName={activePlaylist?.name}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        isFavorite={currentSong ? favorites.includes(currentSong.id) : false}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onToggleShuffle={handleToggleShuffle}
        onCycleRepeat={handleCycleRepeat}
        onToggleFavorite={() => currentSong && handleToggleFavorite(currentSong.id)}
        onOpenBluetoothModal={() => setIsBluetoothOpen(true)}
        onVolumeChange={(val) => setVolume(val)}
        onToggleMute={() => setIsMuted((prev) => !prev)}
      />

      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={queue}
        currentIndex={queueIndex}
        onPlaySongAtIndex={(idx) => {
          setQueueIndex(idx);
          setCurrentSong(queue[idx]);
          setCurrentTime(0);
          setIsPlaying(true);
        }}
      />

      {/* Modals */}
      <AddSongModal
        isOpen={isAddSongOpen}
        onClose={() => setIsAddSongOpen(false)}
        playlists={playlists}
        currentPlaylistId={activePlaylistId}
        onAddSong={handleAddSong}
      />

      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />

      <BluetoothModal
        isOpen={isBluetoothOpen}
        onClose={() => setIsBluetoothOpen(false)}
      />

      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        updateInfo={updateInfo}
        isChecking={isCheckingUpdate}
        onCheckAgain={handleManualCheckUpdates}
        hasUpdate={hasUpdateAvailable}
        checkError={updateCheckError}
      />
    </div>
  );
}

export default App;
