export type PlayerRole = 'monk' | 'impostor';

export type SpecificRole = 'monk' | 'evil_nun' | 'evil_assistant';

export type RoomId = 
  | 'nave'
  | 'altar'
  | 'sacristia'
  | 'torre'
  | 'calabouco'
  | 'cemiterio'
  | 'jardim'
  | 'atrio';

export interface RoomDefinition {
  id: RoomId;
  name: string;
  description: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  color: string;
}

export type TaskDifficulty = 'facil' | 'media' | 'dificil';
export type TaskDuration = 'curta' | 'media' | 'longa';

export type TaskType =
  // Nave
  | 'acender_velas'
  | 'limpar_bancos'
  | 'recolher_hostias'
  // Altar
  | 'polir_calice'
  | 'organizar_missal'
  | 'consertar_vitral'
  // Sacristia
  | 'decifrar_relicario'
  | 'reabastecer_oleo'
  | 'dobrar_tunicas'
  // Torre
  | 'ajustar_sinos'
  | 'engrenagens_relogio'
  | 'desamarrar_corda'
  // Calabouço
  | 'drenar_cripta'
  | 'reacender_tochas'
  | 'encontrar_chave'
  // Cemitério
  | 'restaurar_lapide'
  | 'queimar_raizes'
  // Jardim
  | 'podar_espinheiros'
  | 'plantar_sementes'
  | 'purificar_estatua'
  // Sacred Relic Puzzles (5 Sacred Powers)
  | 'relic_agua_benta'
  | 'relic_lascas_cruz'
  | 'relic_livro_exorcismo'
  | 'relic_cruz_sagrada'
  | 'relic_santo_graal';

export interface TaskDefinition {
  id: string;
  type: TaskType;
  title: string;
  roomId: RoomId;
  roomName: string;
  difficulty: TaskDifficulty;
  duration: TaskDuration;
  position: [number, number, number];
  completed: boolean;
  assignedToPlayerId?: string;
  isCursed?: boolean;
  isSacredRelicPuzzle?: boolean;
  sacredPowerReward?: SacredPower;
}

export type SacredPower = 
  | 'agua_benta'
  | 'lascas_da_cruz'
  | 'livro_exorcismo'
  | 'cruz_sagrada'
  | 'santo_graal';

export interface SacredPowerDefinition {
  type: SacredPower;
  name: string;
  description: string;
  icon: string;
  cooldown: number;
}

export type SabotageType = 
  | 'blackout'          // Apagar luzes/tochas
  | 'curse_bells'       // Sino da maldição (crítica)
  | 'lockdown'          // Trancar portas
  | 'sound_illusions'   // Espalhar ilusões sonoras
  | 'curse_station'     // Desativar estação de tarefa
  | 'plant_trap';       // Posicionar armadilha de pavor

export interface SabotageDefinition {
  type: SabotageType;
  name: string;
  description: string;
  cooldown: number;
  duration: number;
  isCritical?: boolean;
}

export interface ActiveTrap {
  id: string;
  x: number;
  z: number;
  createdBy: string;
  createdAt: number;
}

export interface SabotageState {
  active: boolean;
  type: SabotageType | null;
  timer: number;
  maxTimer: number;
  fixedByUsers: string[];
  doorsLocked: boolean;
  lockedRooms: RoomId[];
  cursedRooms: RoomId[];
  illusionsActive: boolean;
  traps: ActiveTrap[];
  cooldowns: Record<SabotageType, number>;
}

export interface PlayerData {
  id: string;
  name: string;
  isHuman: boolean;
  role: PlayerRole;
  specificRole: SpecificRole;
  color: string;
  colorName: string;
  isAlive: boolean;
  currentRoom: RoomId;
  position: { x: number; y: number; z: number };
  targetPosition?: { x: number; z: number };
  tasksCompleted: number;
  totalTasks: number;
  assignedTasks: TaskDefinition[];
  killCooldown: number;
  maxKillCooldown: number; // e.g. 40s
  inVent: boolean;
  ventLocationId?: string;
  isTrapped?: boolean;
  trapTimer?: number;

  // Levitation & Cross Execution State
  isBeingLevitated?: boolean;
  levitationProgress?: number; // 0 to 1
  isChannelingKill?: boolean;
  channelingTargetId?: string;
  channelingTimer?: number; // e.g. 3.5s

  // Sacred Relic Powers
  unlockedPowers: SacredPower[];
  powerCooldowns: Record<SacredPower, number>;
  hasHolyProtection?: boolean; // Lascas da Cruz active
}

export interface DeadBody {
  id: string;
  playerId: string;
  playerName: string;
  color: string;
  position: { x: number; y: number; z: number };
  roomId: RoomId;
  discovered: boolean;
}

export interface VentLocation {
  id: string;
  name: string;
  roomId: RoomId;
  position: [number, number, number];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export type GamePhase = 
  | 'title'
  | 'lobby'
  | 'playing'
  | 'meeting_discussion'
  | 'meeting_voting'
  | 'ejection'
  | 'game_over';

export interface GameSettings {
  playerCount: number; // 5 to 10
  impostorCount: number; // 1 if < 7, 2 if >= 7
  playerName: string;
  playerColor: string;
  rolePreference: 'random' | 'monk' | 'impostor';
}

export interface MeetingState {
  callerId: string;
  callerName: string;
  reason: 'body_found' | 'emergency_bell' | 'witnessed_kill';
  victimName?: string;
  victimRoom?: string;
  witnessedKillerName?: string;
  discussionTimer: number;
  votingTimer: number;
  votes: Record<string, string>;
  hasVoted: Record<string, boolean>;
  ejectedPlayer: PlayerData | null;
  ejectionResultText: string;
  isTie: boolean;
}

export interface GameOverState {
  winner: 'monks' | 'impostors';
  reason: string;
}
