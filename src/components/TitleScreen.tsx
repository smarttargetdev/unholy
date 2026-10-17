import React, { useState } from 'react';
import { GameSettings } from '../types/game';
import { MONK_COLORS } from '../game/abbeyData';
import { soundEngine } from '../audio/soundEngine';
import { AbbeyCrossIcon, MonkHoodIcon, EvilNunIcon, PlayIcon, VolumeOnIcon, VolumeOffIcon } from './SvgIcons';

interface TitleScreenProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onStartGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());

  const handleMuteToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handlePlayerCountChange = (count: number) => {
    soundEngine.playTick(500, 0.08);
    // Explicit rule: if < 7, 1 impostor; if >= 7, 2 impostors
    const impostors = count < 7 ? 1 : 2;
    onUpdateSettings({
      ...settings,
      playerCount: count,
      impostorCount: impostors,
    });
  };

  const handleStart = () => {
    soundEngine.playBell(110, 3.5, 0.5);
    soundEngine.startAmbient();
    onStartGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-10 select-none bg-radial from-stone-900 via-[#0e0c0a] to-[#070605] overflow-y-auto">
      
      {/* Top Bar: Mute button & Subtitle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-stone-400 text-xs tracking-widest font-mono uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
          Dedução Social 3D Isométrica
        </div>
        <button
          onClick={handleMuteToggle}
          className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-stone-200 transition cursor-pointer"
        >
          {isMuted ? <VolumeOffIcon className="w-5 h-5 text-rose-400" /> : <VolumeOnIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Hero Title Lockup with Bespoke Gothic Crest */}
      <div className="flex flex-col items-center my-auto py-8">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-amber-950/30 border-2 border-amber-600/40 flex items-center justify-center shadow-[0_0_50px_rgba(217,119,6,0.2)]">
            <AbbeyCrossIcon className="w-14 h-14 text-amber-500" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-gothic font-black text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-stone-100 via-amber-200 to-amber-600 drop-shadow-2xl">
          A ABADIA ABANDONADA
        </h1>
        <h2 className="text-base sm:text-xl font-medieval tracking-widest text-rose-500/90 text-center mt-1">
          O Mistério da Freira Maligna
        </h2>

        {/* Lobby Configuration Box */}
        <div className="mt-8 w-full max-w-xl bg-stone-900/90 border border-stone-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-none">
          
          {/* Player Count Selector (5 to 10) */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-gothic uppercase text-stone-300">
                Quantidade de Jogadores: <span className="text-amber-400 font-bold">{settings.playerCount}</span>
              </label>
              <span className="text-xs text-stone-400 font-mono">
                {settings.playerCount < 7 ? (
                  <span className="text-rose-400 font-bold">1 Impostor (A Freira Maligna)</span>
                ) : (
                  <span className="text-rose-500 font-bold">2 Impostores (A Freira & Ajudante)</span>
                )}
              </span>
            </div>

            <div className="flex gap-2">
              {[5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePlayerCountChange(num)}
                  className={`flex-1 py-2 rounded-lg font-gothic font-bold text-sm transition-all cursor-pointer ${
                    settings.playerCount === num
                      ? 'bg-amber-600 text-stone-950 shadow-lg scale-105'
                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700 border border-stone-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5 font-serif italic">
              * Menos de 7 jogadores: 1 impostor. 7 ou mais jogadores: 2 impostores.
            </p>
          </div>

          {/* Player Name and Robe Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-gothic uppercase text-stone-300 block mb-1.5">
                Seu Nome Monástico:
              </label>
              <input
                type="text"
                value={settings.playerName}
                onChange={(e) => onUpdateSettings({ ...settings, playerName: e.target.value })}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-gothic"
                maxLength={18}
              />
            </div>

            <div>
              <label className="text-xs font-gothic uppercase text-stone-300 block mb-1.5">
                Papel Desejado:
              </label>
              <select
                value={settings.rolePreference}
                onChange={(e) => onUpdateSettings({ ...settings, rolePreference: e.target.value as any })}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500 font-gothic cursor-pointer"
              >
                <option value="random">Sorteio Aleatório (Padrão)</option>
                <option value="monk">Monge Fiel (Inocente)</option>
                <option value="impostor">A Freira Maligna (Impostor)</option>
              </select>
            </div>
          </div>

          {/* Robe Color Swatches */}
          <div className="mb-6">
            <label className="text-xs font-gothic uppercase text-stone-300 block mb-2">
              Cor do Hábito Monástico:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {MONK_COLORS.map((item) => (
                <button
                  key={item.color}
                  onClick={() => onUpdateSettings({ ...settings, playerColor: item.color })}
                  className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${
                    settings.playerColor === item.color
                      ? 'border-amber-400 scale-110 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                      : 'border-stone-800 hover:border-stone-500 hover:scale-105'
                  }`}
                  style={{ backgroundColor: item.color }}
                  title={item.name}
                >
                  {settings.playerColor === item.color && (
                    <MonkHoodIcon className="w-5 h-5 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 active:scale-98 text-stone-950 font-gothic font-black text-lg rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3"
          >
            <PlayIcon className="w-5 h-5 text-stone-950" />
            ENTRAR NA ABADIA (START)
          </button>
        </div>
      </div>

      {/* Flat Control Hints Footer */}
      <div className="text-center text-xs text-stone-500 font-mono tracking-wider pt-4 border-t border-stone-800/60">
        WASD/Setas Move · E Fazer Tarefa · R Reportar Corpo · Q Assassinar · Espaço/F Passagem · V Sabotagem · M Mapa
      </div>

    </div>
  );
};
