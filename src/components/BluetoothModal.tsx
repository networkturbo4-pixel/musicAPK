import React from 'react';
import { Bluetooth, Radio, Headphones, Car, CheckCircle2, X } from 'lucide-react';

interface BluetoothModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BluetoothModal({ isOpen, onClose }: BluetoothModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#18181f] border border-white/10 rounded-2xl p-6 shadow-2xl text-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
            <Bluetooth size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Reproducción por Bluetooth</h2>
            <p className="text-xs text-gray-400">Como Spotify: Auriculares, Altavoces y Autos</p>
          </div>
        </div>

        <div className="space-y-4 my-4 text-sm leading-relaxed">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3">
            <Radio className="text-emerald-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-white">1. Conexión de Audio Automática</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Simplemente conecta tu dispositivo móvil a cualquier auricular, altavoz o estéreo de coche vía Bluetooth. Todo el audio de YouTube saldrá automáticamente por tu dispositivo Bluetooth.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3">
            <Headphones className="text-purple-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-white">2. Controles Físicos y Gestuales</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Gracias a la API MediaSession, puedes pausar, reanudar o saltar canciones usando los toques en tus auriculares Bluetooth o el volante de tu automóvil.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3">
            <Car className="text-amber-400 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-white">3. Pantalla de Bloqueo y Notificaciones</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Verás la carátula, el título del video de YouTube y la barra de progreso en la pantalla de bloqueo de tu Android y en la pantalla táctil de tu auto.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 size={16} />
            <span>Listo para transmitir audio</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full text-sm transition shadow-lg shadow-emerald-500/20"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
