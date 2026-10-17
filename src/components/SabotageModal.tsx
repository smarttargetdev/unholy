import React from 'react';
import { SabotageType, SabotageState } from '../types/game';
import { SABOTAGES } from '../game/abbeyData';
import { soundEngine } from '../audio/soundEngine';
import { SabotageIcon, CloseIcon, AlertTriangleIcon } from './SvgIcons';

interface SabotageModalProps {
  sabotageState: SabotageState;
  onTriggerSabotage: (type: SabotageType) => void;
  onClose: () => void;
}

export const SabotageModal: React.FC<SabotageModalProps> = ({
  sabotageState,
  onTriggerSabotage,
  onClose,
}) => {
  const handleSabotage = (type: SabotageType) => {
    const cd = sabotageState.cooldowns[type] || 0;
    if (cd > 0) return;
    soundEngine.playTick(200, 0.2);
    onTriggerSabotage(type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 select-none">
      <div className="w-full max-w-2xl bg-stone-900 border-2 border-rose-900/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-rose-900/50">
          <div className="flex items-center gap-3">
            <SabotageIcon className="w-6 h-6 text-rose-500 animate-pulse" />
            <div>
              <h3 className="font-gothic font-bold text-lg text-rose-300">
                Poderes Sinistros da Freira Maligna
              </h3>
              <p className="text-xs text-stone-400">
                Sabote a fé e as tarefas dos monges para semear a loucura na abadia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Abilities Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {SABOTAGES.map((sab) => {
            const cd = sabotageState.cooldowns[sab.type] || 0;
            const isOnCooldown = cd > 0;
            const isCritical = sab.isCritical;

            return (
              <div
                key={sab.type}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCritical
                    ? 'bg-rose-950/30 border-rose-700/60'
                    : 'bg-stone-950/70 border-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-gothic font-bold text-stone-100 text-sm">
                        {sab.name}
                      </span>
                      {isCritical && (
                        <span className="text-[10px] bg-rose-700 text-white font-mono px-1.5 py-0.5 rounded uppercase">
                          Crítica
                        </span>
                      )}
                    </div>
                    {isOnCooldown && (
                      <span className="text-xs font-mono font-bold text-rose-400 tabular-nums">
                        {cd}s
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed mb-4">
                    {sab.description}
                  </p>
                </div>

                <button
                  onClick={() => handleSabotage(sab.type)}
                  disabled={isOnCooldown}
                  className={`w-full py-2.5 rounded-lg font-gothic text-xs font-bold transition-all cursor-pointer ${
                    isOnCooldown
                      ? 'bg-stone-800 text-stone-600 border border-stone-800 cursor-not-allowed'
                      : isCritical
                      ? 'bg-rose-700 hover:bg-rose-600 active:scale-95 text-white shadow-lg shadow-rose-950/50'
                      : 'bg-stone-800 hover:bg-stone-700 active:scale-95 text-rose-200 border border-rose-800/50'
                  }`}
                >
                  {isOnCooldown ? `Recarga (${cd}s)` : 'Executar Sabotagem'}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
