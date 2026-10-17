import React, { useEffect } from 'react';
import { PlayerData } from '../types/game';
import { MonkHoodIcon, EvilNunIcon } from './SvgIcons';
import { soundEngine } from '../audio/soundEngine';

interface EjectionScreenProps {
  ejectedPlayer: PlayerData | null;
  resultText: string;
  impostorsRemaining: number;
  onFinish: () => void;
}

export const EjectionScreen: React.FC<EjectionScreenProps> = ({
  ejectedPlayer,
  resultText,
  impostorsRemaining,
  onFinish,
}) => {
  useEffect(() => {
    soundEngine.playBell(90, 4.0, 0.4);
    const timer = setTimeout(() => {
      onFinish();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const isImpostor = ejectedPlayer?.role === 'impostor';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 select-none animate-fade-in">
      {/* Visual Centerpiece */}
      <div className="flex flex-col items-center mb-8">
        {ejectedPlayer ? (
          <div className="relative mb-6">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center border-4 shadow-2xl animate-pulse"
              style={{
                backgroundColor: ejectedPlayer.color,
                borderColor: isImpostor ? '#dc2626' : '#d97706',
              }}
            >
              {isImpostor ? (
                <EvilNunIcon className="w-16 h-16 text-rose-500" />
              ) : (
                <MonkHoodIcon className="w-16 h-16 text-stone-900" />
              )}
            </div>
            {isImpostor && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-rose-900 text-rose-200 border border-rose-600 rounded-full text-xs font-gothic font-bold uppercase tracking-wider">
                Impostor Revelado!
              </span>
            )}
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-stone-900 border-2 border-stone-700 flex items-center justify-center text-stone-500 mb-6">
            <MonkHoodIcon className="w-12 h-12" />
          </div>
        )}

        {/* Narrative text */}
        <h2 className="text-2xl md:text-3xl font-gothic font-bold text-center text-stone-100 max-w-xl leading-relaxed mb-4">
          {resultText}
        </h2>

        {/* Impostors Remaining status */}
        <p className="text-sm md:text-base font-serif italic text-stone-400">
          {impostorsRemaining === 1
            ? 'Resta 1 seguidor das trevas infiltrado na abadia...'
            : impostorsRemaining > 1
            ? `Restam ${impostorsRemaining} seguidores das trevas infiltrados...`
            : 'A abadia foi expurgada do mal!'}
        </p>
      </div>

      <div className="text-xs text-stone-600 font-mono tracking-widest uppercase">
        Retornando aos corredores da catedral...
      </div>
    </div>
  );
};
