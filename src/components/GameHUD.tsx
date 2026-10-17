import React, { useState } from 'react';
import { PlayerData, RoomId, SabotageState, TaskDefinition, DeadBody, SacredPower } from '../types/game';
import { ABBEY_ROOMS } from '../game/abbeyData';
import { 
  AbbeyCrossIcon, 
  MonkHoodIcon, 
  EvilNunIcon, 
  BellIcon, 
  SkullIcon, 
  DaggerIcon, 
  VentIcon, 
  SabotageIcon, 
  MapIcon, 
  VolumeOnIcon, 
  VolumeOffIcon,
  AlertTriangleIcon
} from './SvgIcons';

interface GameHUDProps {
  humanPlayer: PlayerData;
  activeRoomId: RoomId;
  totalTaskProgress: number; // 0 to 100
  sabotageState: SabotageState;
  nearbyTask: TaskDefinition | null;
  nearbyBody: DeadBody | null;
  nearbyVentId: string | null;
  witnessedKillTarget: PlayerData | null;
  canCallEmergency: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onInteractTask: () => void;
  onReportBody: () => void;
  onCallEmergency: () => void;
  onKill: () => void;
  onToggleVent: () => void;
  onOpenSabotage: () => void;
  onOpenMap: () => void;
  onUseSacredPower: (power: SacredPower) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  humanPlayer,
  activeRoomId,
  totalTaskProgress,
  sabotageState,
  nearbyTask,
  nearbyBody,
  nearbyVentId,
  witnessedKillTarget,
  canCallEmergency,
  isMuted,
  onToggleMute,
  onInteractTask,
  onReportBody,
  onCallEmergency,
  onKill,
  onToggleVent,
  onOpenSabotage,
  onOpenMap,
  onUseSacredPower,
}) => {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const currentRoom = ABBEY_ROOMS.find((r) => r.id === activeRoomId);
  const isImpostor = humanPlayer.role === 'impostor';

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none">
      
      {/* Top Header Cluster (Tasks Progress & Room Pill) */}
      <div className="flex items-start justify-between gap-4">
        
        {/* Left: Abbey Task Progress */}
        <div className="pointer-events-auto bg-stone-950/90 border border-stone-800 rounded-xl p-3 shadow-2xl flex flex-col gap-1.5 w-64 md:w-80">
          <div className="flex items-center justify-between text-xs font-gothic">
            <span className="text-stone-300 font-bold flex items-center gap-1.5">
              <AbbeyCrossIcon className="w-4 h-4 text-emerald-400" />
              Tarefas da Abadia
            </span>
            <span className="font-mono text-emerald-400 font-bold tabular-nums">
              {Math.round(totalTaskProgress)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-800">
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-300 shadow"
              style={{ width: `${totalTaskProgress}%` }}
            />
          </div>

          {/* Player Role & Tasks count */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800/80 font-mono">
            <span className="flex items-center gap-1 font-gothic font-bold">
              {isImpostor ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <EvilNunIcon className="w-3.5 h-3.5 text-rose-500" />
                  {humanPlayer.specificRole === 'evil_nun' ? 'A Freira Maligna' : 'Ajudante do Mal'}
                </span>
              ) : (
                <span className="text-amber-300 flex items-center gap-1">
                  <MonkHoodIcon className="w-3.5 h-3.5 text-amber-400" />
                  Monge Fiel
                </span>
              )}
            </span>
            <span>
              Suas Tarefas: {humanPlayer.tasksCompleted}/{humanPlayer.totalTasks}
            </span>
          </div>
        </div>

        {/* Center: Active Sabotage Warning Alert */}
        {sabotageState.active && (
          <div className="pointer-events-auto bg-rose-950/90 border-2 border-rose-600 rounded-xl px-5 py-2.5 shadow-2xl flex items-center gap-3 animate-pulse">
            <AlertTriangleIcon className="w-6 h-6 text-rose-400" />
            <div>
              <div className="text-rose-200 font-gothic font-bold text-xs uppercase tracking-wide">
                {sabotageState.type === 'curse_bells'
                  ? 'Alarme: Sino da Maldição!'
                  : sabotageState.type === 'blackout'
                  ? 'Blecaute de Trevas!'
                  : 'Sabotagem em Andamento!'}
              </div>
              {sabotageState.timer > 0 && (
                <div className="text-rose-400 font-mono text-xs font-bold tabular-nums">
                  Tempo Restante: {sabotageState.timer}s
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right: Room Location, Map & Sound Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Room Pill */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-2xl">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentRoom?.color || '#a855f7' }} />
            <span className="font-gothic font-bold text-xs text-stone-200">
              {currentRoom?.name || 'Corredor da Abadia'}
            </span>
          </div>

          {/* Map Button */}
          <button
            onClick={onOpenMap}
            className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-amber-600 text-stone-300 hover:text-amber-400 transition cursor-pointer shadow-2xl"
            title="Abrir Mapa (M)"
          >
            <MapIcon className="w-5 h-5" />
          </button>

          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-stone-600 text-stone-300 transition cursor-pointer shadow-2xl"
            title="Som"
          >
            {isMuted ? <VolumeOffIcon className="w-5 h-5 text-rose-400" /> : <VolumeOnIcon className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Eyewitness Alert: Nun Levitation Kill in Progress! */}
      {witnessedKillTarget && humanPlayer.isAlive && (
        <div className="pointer-events-auto mx-auto bg-rose-950/95 border-2 border-rose-500 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-4 animate-bounce">
          <AlertTriangleIcon className="w-8 h-8 text-rose-400" />
          <div>
            <div className="font-gothic font-bold text-rose-200 text-sm">
              FLAGRANTE! ASSASSINATO EM ANDAMENTO!
            </div>
            <div className="text-xs text-rose-300">
              A Freira Maligna está suspendendo um monge no ar!
            </div>
          </div>
          <button
            onClick={onReportBody}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-gothic font-bold text-xs rounded-xl shadow-lg cursor-pointer"
          >
            DENUNCIAR CRIME [R]
          </button>
        </div>
      )}

      {/* Trapped Alert if stepped on trap */}
      {humanPlayer.isTrapped && (
        <div className="mx-auto bg-stone-950/95 border-2 border-purple-600 rounded-2xl px-6 py-3 text-center shadow-2xl animate-pulse pointer-events-auto">
          <span className="font-gothic font-bold text-purple-300 text-sm">
            Paralisado pela Armadilha de Pavor! ({humanPlayer.trapTimer || 3}s)
          </span>
        </div>
      )}

      {/* Levitation Kill in Progress Channeling Bar for Nun */}
      {humanPlayer.isChannelingKill && (
        <div className="pointer-events-auto mx-auto bg-stone-950/95 border-2 border-rose-600 rounded-2xl p-4 text-center shadow-2xl w-80">
          <div className="font-gothic font-bold text-rose-400 text-xs mb-2">
            RITUAL MACABRO: SUSPENDENDO MONGE COM A CRUZ...
          </div>
          <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden border border-rose-900">
            <div
              className="bg-gradient-to-r from-rose-700 to-rose-500 h-full transition-all duration-100"
              style={{ width: `${Math.round(((3.5 - (humanPlayer.channelingTimer || 0)) / 3.5) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Cuidado! Outros monges podem presenciar e denunciar!
          </span>
        </div>
      )}

      {/* Sacred Relics Bar for Innocent Monks */}
      {!isImpostor && humanPlayer.unlockedPowers && humanPlayer.unlockedPowers.length > 0 && (
        <div className="pointer-events-auto mx-auto bg-amber-950/30 border border-amber-600/50 rounded-2xl p-2 px-4 shadow-xl flex items-center gap-3">
          <span className="text-[10px] uppercase font-gothic font-bold text-amber-300">
            Poderes Sagrados:
          </span>
          <div className="flex gap-2">
            {humanPlayer.unlockedPowers.map((p) => {
              const cd = humanPlayer.powerCooldowns[p] || 0;
              const names: Record<string, string> = {
                agua_benta: 'Água Benta',
                lascas_da_cruz: 'Lascas da Cruz',
                livro_exorcismo: 'Livro do Exorcismo',
                cruz_sagrada: 'Cruz de Prata',
                santo_graal: 'Santo Graal',
              };

              return (
                <button
                  key={p}
                  onClick={() => onUseSacredPower(p)}
                  disabled={cd > 0}
                  className={`px-3 py-1.5 rounded-lg text-xs font-gothic font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    cd > 0
                      ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-md active:scale-95'
                  }`}
                >
                  <AbbeyCrossIcon className="w-3.5 h-3.5 text-stone-950" />
                  <span>{names[p] || p} {cd > 0 ? `(${cd}s)` : ''}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Unified Bottom Control Dock (Consolidated, Zero Viewport Occlusion, Collapsible) */}
      <div className="pointer-events-auto mx-auto w-full max-w-xl transition-all duration-300">
        
        {/* Collapse / Expand Toggle */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setDockCollapsed(!dockCollapsed)}
            className="px-3 py-0.5 bg-stone-950/90 hover:bg-stone-900 border-t border-x border-stone-800 rounded-t-lg text-[10px] text-stone-400 font-mono tracking-wider cursor-pointer"
          >
            {dockCollapsed ? '▴ Expandir Painel' : '▾ Ocultar Painel [H]'}
          </button>
        </div>

        {/* Dock Bar */}
        {!dockCollapsed && (
          <div className="bg-stone-950/95 border border-stone-800/90 rounded-2xl p-3 shadow-2xl flex items-center justify-center gap-3 backdrop-blur-none">
            
            {/* Task Action Button */}
            {nearbyTask && humanPlayer.isAlive && (
              <button
                onClick={onInteractTask}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-stone-950 font-gothic font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 animate-bounce"
              >
                <AbbeyCrossIcon className="w-4 h-4 text-stone-950" />
                <span>
                  {nearbyTask.isSacredRelicPuzzle ? 'Despertar Relíquia [E]' : 'Realizar Tarefa [E]'}
                </span>
              </button>
            )}

            {/* Report Body Button */}
            {nearbyBody && humanPlayer.isAlive && (
              <button
                onClick={onReportBody}
                className="px-4 py-2.5 bg-rose-700 hover:bg-rose-600 active:scale-95 text-white font-gothic font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 animate-pulse"
              >
                <SkullIcon className="w-4 h-4 text-white" />
                <span>Reportar Monge Caído [R]</span>
              </button>
            )}

            {/* Emergency Bell Button */}
            {canCallEmergency && humanPlayer.isAlive && (
              <button
                onClick={onCallEmergency}
                className="px-4 py-2.5 bg-amber-800 hover:bg-amber-700 active:scale-95 text-amber-100 font-gothic font-bold text-xs rounded-xl border border-amber-600/50 shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <BellIcon className="w-4 h-4 text-amber-300" />
                <span>Badalar Reunião</span>
              </button>
            )}

            {/* Impostor Actions */}
            {isImpostor && humanPlayer.isAlive && (
              <>
                {/* Levitate & Cross Kill Button */}
                <button
                  onClick={onKill}
                  disabled={humanPlayer.killCooldown > 0 || humanPlayer.isChannelingKill}
                  className={`px-4 py-2.5 font-gothic font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 ${
                    humanPlayer.killCooldown > 0 || humanPlayer.isChannelingKill
                      ? 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'
                      : 'bg-rose-800 hover:bg-rose-700 active:scale-95 text-white cursor-pointer'
                  }`}
                  title="Suspende a vítima no ar e desfere o golpe com a cruz (40s recarga)"
                >
                  <DaggerIcon className="w-4 h-4" />
                  <span>
                    {humanPlayer.killCooldown > 0
                      ? `Suspender e Esfaquear (${Math.ceil(humanPlayer.killCooldown)}s)`
                      : 'Suspender e Esfaquear [Q]'}
                  </span>
                </button>

                {/* Vent Button */}
                {nearbyVentId && (
                  <button
                    onClick={onToggleVent}
                    className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 active:scale-95 text-purple-200 font-gothic font-bold text-xs rounded-xl border border-purple-600 shadow-lg transition cursor-pointer flex items-center gap-2"
                  >
                    <VentIcon className="w-4 h-4 text-purple-300" />
                    <span>
                      {humanPlayer.inVent ? 'Sair da Passagem' : 'Entrar na Passagem [F]'}
                    </span>
                  </button>
                )}

                {/* Sabotage Menu Button */}
                <button
                  onClick={onOpenSabotage}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 active:scale-95 text-rose-300 font-gothic font-bold text-xs rounded-xl border border-rose-900/60 shadow-lg transition cursor-pointer flex items-center gap-2"
                >
                  <SabotageIcon className="w-4 h-4 text-rose-400" />
                  <span>Sabotagem [V]</span>
                </button>
              </>
            )}

            {/* Always accessible Map toggle */}
            <button
              onClick={onOpenMap}
              className="px-3 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 font-gothic text-xs rounded-xl border border-stone-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <MapIcon className="w-4 h-4" />
              <span>Mapa [M]</span>
            </button>

          </div>
        )}

      </div>

    </div>
  );
};
