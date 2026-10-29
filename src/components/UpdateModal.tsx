import React from 'react';
import {
  Download,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Smartphone,
} from 'lucide-react';
import type { UpdateInfo } from '../services/updateService';
import { APP_CURRENT_VERSION } from '../services/updateService';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateInfo: UpdateInfo | null;
  isChecking: boolean;
  onCheckAgain: () => void;
  hasUpdate: boolean;
  checkError?: string;
}

export function UpdateModal({
  isOpen,
  onClose,
  updateInfo,
  isChecking,
  onCheckAgain,
  hasUpdate,
  checkError,
}: UpdateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#18181f] border border-white/10 rounded-2xl p-6 shadow-2xl text-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <RefreshCw size={26} className={isChecking ? 'animate-spin' : ''} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gestor de Actualizaciones</h2>
            <p className="text-xs text-gray-400">Canal oficial de GitHub Releases</p>
          </div>
        </div>

        {/* Content based on status */}
        {isChecking ? (
          <div className="py-8 text-center space-y-3">
            <div className="inline-block p-4 rounded-full bg-white/5 animate-pulse">
              <RefreshCw size={32} className="text-emerald-400 animate-spin" />
            </div>
            <p className="text-sm text-gray-300">Buscando nueva versión en GitHub...</p>
          </div>
        ) : hasUpdate && updateInfo ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                  ¡Nueva versión disponible!
                </span>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-500 text-black rounded-full">
                  v{updateInfo.version}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Tu versión instalada: <span className="font-mono text-gray-300">v{APP_CURRENT_VERSION}</span>
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Novedades y Cambios:
              </h4>
              <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 text-xs text-gray-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                {updateInfo.releaseNotes}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-gray-400">
              <Smartphone size={16} className="text-emerald-400 shrink-0" />
              <span>
                Al presionar el botón se descargará el APK directamente para que tu celular lo instale.
              </span>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition font-medium"
              >
                Más tarde
              </button>
              <a
                href={updateInfo.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full text-sm transition shadow-lg shadow-emerald-500/20"
              >
                <Download size={18} />
                <span>Descargar APK (v{updateInfo.version})</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-2">
              <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Soundify está actualizado</h3>
              <p className="text-xs text-gray-400">
                Tienes la versión más reciente instalada: <span className="font-mono text-emerald-400 font-semibold">v{APP_CURRENT_VERSION}</span>
              </p>
            </div>

            {checkError && (
              <p className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                <AlertCircle size={16} className="shrink-0" />
                {checkError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={onCheckAgain}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition rounded-lg hover:bg-white/5"
              >
                <RefreshCw size={14} />
                <span>Volver a comprobar</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white font-medium rounded-full text-xs transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
