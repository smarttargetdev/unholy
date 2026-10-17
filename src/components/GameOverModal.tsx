import React from 'react';
import { GameOverState, PlayerData } from '../types/game';
import { AbbeyCrossIcon, EvilNunIcon, MonkHoodIcon, PlayIcon } from './SvgIcons';

interface GameOverModalProps {
  gameOverState: GameOverState;
  players: PlayerData[];
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameOverState,
  players,
  onPlayAgain,
}) => {
  const isMonksWin = gameOverState.winner === 'monks';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 select-none animate-fade-in">
      <div className="w-full max-w-xl bg-stone-900 border-2 border-stone-700 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col items-center">
        
        {/* Banner Trophy Icon */}
        <div className="mb-4">
          {isMonksWin ? (
            <div className="w-20 h-20 rounded-full bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <AbbeyCrossIcon className="w-12 h-12 text-emerald-400" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-rose-950/60 border-2 border-rose-600 flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.4)]">
              <EvilNunIcon className="w-12 h-12 text-rose-500" />
            </div>
          )}
        </div>

        {/* Victory Title */}
        <h2 className={`text-3xl font-gothic font-black text-center mb-2 ${
          isMonksWin ? 'text-emerald-400' : 'text-rose-500'
        }`}>
          {isMonksWin ? 'VITÓRIA DOS MONGES FIÉIS!' : 'VITÓRIA DA FREIRA MALIGNA!'}
        </h2>

        <p className="text-sm font-serif italic text-stone-300 text-center mb-6 max-w-md">
          {gameOverState.reason}
        </p>

        {/* Players Roles Reveal Table */}
        <div className="w-full bg-stone-950 rounded-xl border border-stone-800 p-4 mb-6 max-h-56 overflow-y-auto">
          <span className="text-[11px] font-gothic uppercase text-stone-400 block mb-2.5">
            Revelação dos Papéis
          </span>
          <div className="space-y-2">
            {players.map((p) => {
              const isImp = p.role === 'impostor';
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs ${
                    isImp ? 'bg-rose-950/30 border-rose-800/50' : 'bg-stone-900 border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-stone-600" style={{ backgroundColor: p.color }} />
                    <span className="font-gothic font-bold text-stone-200">{p.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono">({p.colorName})</span>
                  </div>

                  <span className={`font-gothic font-bold text-xs ${isImp ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {p.specificRole === 'evil_nun'
                      ? 'A Freira Maligna'
                      : p.specificRole === 'evil_assistant'
                      ? 'Ajudante do Mal'
                      : 'Monge Fiel'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 active:scale-98 text-stone-950 font-gothic font-bold text-base rounded-xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
        >
          <PlayIcon className="w-4 h-4 text-stone-950" />
          <span>JOGAR NOVAMENTE</span>
        </button>

      </div>
    </div>
  );
};
