import React from 'react';
import { ABBEY_ROOMS, VENT_LOCATIONS } from '../game/abbeyData';
import { TaskDefinition, PlayerData, SabotageState } from '../types/game';
import { MapIcon, CloseIcon, AbbeyCrossIcon } from './SvgIcons';

interface MinimapModalProps {
  humanPlayer: PlayerData;
  tasks: TaskDefinition[];
  sabotageState: SabotageState;
  onClose: () => void;
}

export const MinimapModal: React.FC<MinimapModalProps> = ({
  humanPlayer,
  tasks,
  sabotageState,
  onClose,
}) => {
  // Coordinate mapping from 3D world (X: -40 to +40, Z: -40 to +55) to map canvas %
  const mapX = (x: number) => ((x + 42) / 84) * 100;
  const mapZ = (z: number) => ((z + 42) / 98) * 100;

  const isImpostor = humanPlayer.role === 'impostor';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 select-none">
      <div className="w-full max-w-2xl bg-stone-900 border-2 border-stone-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-2 text-amber-300 font-gothic font-bold">
            <MapIcon className="w-5 h-5 text-amber-400" />
            <span>Mapa Cartográfico da Abadia</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Map Area styled like ancient architectural parchment */}
        <div className="relative w-full aspect-[4/3] bg-[#1a1714] border-b border-stone-800 p-4 overflow-hidden">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Render Rooms */}
          {ABBEY_ROOMS.map((room) => {
            const left = mapX(room.bounds.minX);
            const top = mapZ(room.bounds.minZ);
            const width = mapX(room.bounds.maxX) - left;
            const height = mapZ(room.bounds.maxZ) - top;

            const isCurrent = humanPlayer.currentRoom === room.id;
            const isLocked = sabotageState.doorsLocked && sabotageState.lockedRooms.includes(room.id);
            const isCursed = sabotageState.cursedRooms.includes(room.id);

            return (
              <div
                key={room.id}
                className={`absolute border rounded-md flex flex-col items-center justify-center transition-all ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                    : isLocked
                    ? 'border-rose-600 bg-rose-950/50'
                    : isCursed
                    ? 'border-purple-600 bg-purple-950/40'
                    : 'border-stone-700/80 bg-stone-900/60'
                }`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
              >
                <span className="text-[10px] sm:text-xs font-gothic font-bold text-stone-300 text-center px-1">
                  {room.name}
                </span>
                {isLocked && (
                  <span className="text-[9px] text-rose-400 font-mono font-bold uppercase mt-0.5">
                    Trancada
                  </span>
                )}
                {isCursed && (
                  <span className="text-[9px] text-purple-400 font-mono font-bold uppercase mt-0.5">
                    Amaldiçoada
                  </span>
                )}
              </div>
            );
          })}

          {/* Vents for Impostors */}
          {isImpostor &&
            VENT_LOCATIONS.map((v) => (
              <div
                key={v.id}
                className="absolute w-3.5 h-3.5 -ml-1.5 -mt-1.5 rounded-full bg-rose-950 border-2 border-rose-500 shadow flex items-center justify-center"
                style={{ left: `${mapX(v.position[0])}%`, top: `${mapZ(v.position[2])}%` }}
                title={`Passagem: ${v.name}`}
              >
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
              </div>
            ))}

          {/* Tasks Markers */}
          {tasks
            .filter((t) => !t.completed)
            .map((t) => (
              <div
                key={t.id}
                className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-amber-400 border border-stone-900 shadow-md animate-pulse"
                style={{ left: `${mapX(t.position[0])}%`, top: `${mapZ(t.position[2])}%` }}
                title={`Tarefa: ${t.title}`}
              />
            ))}

          {/* Human Player Position Pin */}
          <div
            className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-xl flex items-center justify-center z-10 transition-all duration-300"
            style={{
              left: `${mapX(humanPlayer.position.x)}%`,
              top: `${mapZ(humanPlayer.position.z)}%`,
              backgroundColor: humanPlayer.color,
            }}
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 bg-stone-950 flex flex-wrap items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-stone-900 inline-block" />
              Tarefa Pendente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-white bg-amber-600 inline-block" />
              Sua Posição
            </span>
            {isImpostor && (
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3 h-3 rounded-full bg-rose-950 border border-rose-500 inline-block" />
                Passagem Secreta
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-stone-500">Tecla [M] para alternar</span>
        </div>

      </div>
    </div>
  );
};
