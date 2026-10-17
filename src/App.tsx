import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GamePhase, 
  GameSettings, 
  PlayerData, 
  TaskDefinition, 
  DeadBody, 
  SabotageState, 
  SabotageType, 
  MeetingState, 
  GameOverState, 
  ChatMessage,
  RoomId,
  SacredPower
} from './types/game';
import { 
  ABBEY_ROOMS, 
  ALL_TASKS, 
  SABOTAGES, 
  VENT_LOCATIONS, 
  MONK_COLORS, 
  BOT_NAMES, 
  BOT_ALIBIS, 
  BOT_ACCUSATIONS 
} from './game/abbeyData';
import { AbbeyEngine } from './game/AbbeyEngine';
import { soundEngine } from './audio/soundEngine';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { TaskModal } from './components/TaskModal';
import { MeetingModal } from './components/MeetingModal';
import { EjectionScreen } from './components/EjectionScreen';
import { SabotageModal } from './components/SabotageModal';
import { MinimapModal } from './components/MinimapModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  // Game Setup
  const [phase, setPhase] = useState<GamePhase>('title');
  const [settings, setSettings] = useState<GameSettings>({
    playerCount: 7,
    impostorCount: 2,
    playerName: 'Irmão Bento',
    playerColor: '#854d0e',
    rolePreference: 'random',
  });

  // World State
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [tasks, setTasks] = useState<TaskDefinition[]>([]);
  const [deadBodies, setDeadBodies] = useState<DeadBody[]>([]);
  const [sabotageState, setSabotageState] = useState<SabotageState>({
    active: false,
    type: null,
    timer: 0,
    maxTimer: 35,
    fixedByUsers: [],
    doorsLocked: false,
    lockedRooms: [],
    cursedRooms: [],
    illusionsActive: false,
    traps: [],
    cooldowns: {
      blackout: 0,
      curse_bells: 0,
      lockdown: 0,
      sound_illusions: 0,
      curse_station: 0,
      plant_trap: 0,
    },
  });

  // Meeting State
  const [meeting, setMeeting] = useState<MeetingState | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isVotingPhase, setIsVotingPhase] = useState(false);
  const [meetingTimer, setMeetingTimer] = useState(45);

  // Modals & UI Toggles
  const [activeTask, setActiveTask] = useState<TaskDefinition | null>(null);
  const [showSabotageModal, setShowSabotageModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());
  const [gameOver, setGameOver] = useState<GameOverState | null>(null);

  // Proximity Triggers
  const [nearbyTask, setNearbyTask] = useState<TaskDefinition | null>(null);
  const [nearbyBody, setNearbyBody] = useState<DeadBody | null>(null);
  const [nearbyVentId, setNearbyVentId] = useState<string | null>(null);
  const [canCallEmergency, setCanCallEmergency] = useState(false);
  const [witnessedKillTarget, setWitnessedKillTarget] = useState<PlayerData | null>(null);

  // 3D Engine & Input Refs
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<AbbeyEngine | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const playersRef = useRef<PlayerData[]>(players);
  playersRef.current = players;

  // Initialize Game Players & Tasks
  const initializeGame = useCallback(() => {
    const totalCount = settings.playerCount;
    // Rule: < 7 => 1 Impostor ("A Freira Maligna"); >= 7 => 2 Impostors ("A Freira" + "Ajudante")
    const impostorTarget = totalCount < 7 ? 1 : 2;

    // Pick Roles
    let humanRole: 'monk' | 'impostor' = 'monk';
    let humanSpecific: 'monk' | 'evil_nun' | 'evil_assistant' = 'monk';

    if (settings.rolePreference === 'impostor') {
      humanRole = 'impostor';
      humanSpecific = 'evil_nun';
    } else if (settings.rolePreference === 'monk') {
      humanRole = 'monk';
      humanSpecific = 'monk';
    } else {
      // Random
      const isImp = Math.random() < impostorTarget / totalCount;
      humanRole = isImp ? 'impostor' : 'monk';
      humanSpecific = isImp ? 'evil_nun' : 'monk';
    }

    // Available colors (exclude human chosen color)
    const availableColors = MONK_COLORS.filter((c) => c.color !== settings.playerColor);

    // Build Players list
    const newPlayers: PlayerData[] = [];

    // Human player
    const humanColorDef = MONK_COLORS.find((c) => c.color === settings.playerColor) || MONK_COLORS[0];
    newPlayers.push({
      id: 'player_human',
      name: settings.playerName || 'Irmão Bento',
      isHuman: true,
      role: humanRole,
      specificRole: humanSpecific,
      color: settings.playerColor,
      colorName: humanColorDef.name,
      isAlive: true,
      currentRoom: 'nave',
      position: { x: 0, y: 0, z: 12 },
      tasksCompleted: 0,
      totalTasks: 4,
      assignedTasks: [],
      killCooldown: 15,
      maxKillCooldown: 40,
      inVent: false,
      unlockedPowers: [],
      powerCooldowns: {
        agua_benta: 0,
        lascas_da_cruz: 0,
        livro_exorcismo: 0,
        cruz_sagrada: 0,
        santo_graal: 0,
      },
    });

    // Determine how many bot impostors needed
    let remainingImpostors = impostorTarget - (humanRole === 'impostor' ? 1 : 0);

    // Bot players
    for (let i = 1; i < totalCount; i++) {
      const isBotImpostor = remainingImpostors > 0 && (i === 1 || Math.random() < 0.4 || totalCount - i <= remainingImpostors);
      if (isBotImpostor) remainingImpostors--;

      const specific = isBotImpostor 
        ? (newPlayers.some(p => p.specificRole === 'evil_nun') ? 'evil_assistant' : 'evil_nun')
        : 'monk';

      const colorItem = availableColors[i % availableColors.length];
      const botName = BOT_NAMES[(i - 1) % BOT_NAMES.length];

      // Scatter start positions around nave and atrium
      const startX = (Math.random() - 0.5) * 8;
      const startZ = 6 + Math.random() * 12;

      newPlayers.push({
        id: `bot_${i}`,
        name: botName,
        isHuman: false,
        role: isBotImpostor ? 'impostor' : 'monk',
        specificRole: specific,
        color: colorItem.color,
        colorName: colorItem.name,
        isAlive: true,
        currentRoom: 'nave',
        position: { x: startX, y: 0, z: startZ },
        tasksCompleted: 0,
        totalTasks: 4,
        assignedTasks: [],
        killCooldown: 25,
        maxKillCooldown: 40,
        inVent: false,
        unlockedPowers: [],
        powerCooldowns: {
          agua_benta: 0,
          lascas_da_cruz: 0,
          livro_exorcismo: 0,
          cruz_sagrada: 0,
          santo_graal: 0,
        },
      });
    }

    // Assign Tasks to Innocent Monks
    const instantiatedTasks: TaskDefinition[] = ALL_TASKS.map((t, idx) => ({
      ...t,
      id: `task_${idx}`,
      completed: false,
    }));

    // Distribute 4 random tasks per innocent player
    newPlayers.forEach((player) => {
      if (player.role === 'monk') {
        const shuffled = [...instantiatedTasks].sort(() => Math.random() - 0.5);
        player.assignedTasks = shuffled.slice(0, 4);
        player.totalTasks = 4;
      }
    });

    setPlayers(newPlayers);
    setTasks(instantiatedTasks);
    setDeadBodies([]);
    setMeeting(null);
    setChatMessages([]);
    setGameOver(null);
    setPhase('playing');
  }, [settings]);

  // Mount 3D Scene when entering 'playing' phase
  useEffect(() => {
    if (phase !== 'title' && canvasMountRef.current && !engineRef.current) {
      const engine = new AbbeyEngine(canvasMountRef.current, tasks);
      engineRef.current = engine;
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [phase]);

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // Single triggers
      if (e.key === 'e' || e.key === 'E') {
        if (nearbyTask && !activeTask && phase === 'playing') {
          setActiveTask(nearbyTask);
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        if (nearbyBody && phase === 'playing') {
          triggerMeeting('body_found', nearbyBody);
        }
      }
      if (e.key === 'q' || e.key === 'Q') {
        const human = playersRef.current.find((p) => p.isHuman);
        if (human && human.role === 'impostor' && human.killCooldown <= 0 && phase === 'playing') {
          attemptKill();
        }
      }
      if (e.key === 'm' || e.key === 'M') {
        setShowMapModal((prev) => !prev);
      }
      if (e.key === 'v' || e.key === 'V') {
        const human = playersRef.current.find((p) => p.isHuman);
        if (human && human.role === 'impostor') {
          setShowSabotageModal((prev) => !prev);
        }
      }
      if (e.key === ' ' || e.key === 'f' || e.key === 'F') {
        const human = playersRef.current.find((p) => p.isHuman);
        if (human && human.role === 'impostor' && nearbyVentId) {
          toggleVent();
        }
      }
      if (e.key === 'Escape') {
        setActiveTask(null);
        setShowSabotageModal(false);
        setShowMapModal(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyTask, nearbyBody, nearbyVentId, activeTask, phase]);

  // Main 60fps Game Tick & Simulation Loop
  useEffect(() => {
    if (phase !== 'playing') return;

    let animId: number;

    const gameLoop = () => {
      const currentPlayers = [...playersRef.current];
      const human = currentPlayers.find((p) => p.isHuman);
      if (!human) return;

      // 1. Human Movement
      if (human.isAlive && !human.isTrapped && !human.inVent) {
        const speed = 0.22;
        let dx = 0;
        let dz = 0;

        if (keysPressed.current['w'] || keysPressed.current['arrowup']) dz -= speed;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dz += speed;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= speed;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += speed;

        // Diagonal normalization
        if (dx !== 0 && dz !== 0) {
          dx *= 0.7071;
          dz *= 0.7071;
        }

        // Bounds clamp
        const newX = Math.max(-36, Math.min(36, human.position.x + dx));
        const newZ = Math.max(-38, Math.min(48, human.position.z + dz));

        // Detect current room
        const room = ABBEY_ROOMS.find(
          (r) =>
            newX >= r.bounds.minX &&
            newX <= r.bounds.maxX &&
            newZ >= r.bounds.minZ &&
            newZ <= r.bounds.maxZ
        );

        human.position.x = newX;
        human.position.z = newZ;
        if (room) human.currentRoom = room.id;
      }

      // 2. Bot AI Autonomous Routines
      currentPlayers.forEach((p) => {
        if (p.isHuman || !p.isAlive) return;

        // Pick random target in their current room or adjoining room
        if (!p.targetPosition || Math.hypot(p.position.x - p.targetPosition.x, p.position.z - p.targetPosition.z) < 0.6) {
          const roomDef = ABBEY_ROOMS.find((r) => r.id === p.currentRoom) || ABBEY_ROOMS[0];
          p.targetPosition = {
            x: roomDef.bounds.minX + Math.random() * (roomDef.bounds.maxX - roomDef.bounds.minX),
            z: roomDef.bounds.minZ + Math.random() * (roomDef.bounds.maxZ - roomDef.bounds.minZ),
          };
        }

        // Step towards target
        const bdx = p.targetPosition.x - p.position.x;
        const bdz = p.targetPosition.z - p.position.z;
        const dist = Math.hypot(bdx, bdz);
        const botSpeed = 0.12;

        if (dist > 0.1) {
          p.position.x += (bdx / dist) * botSpeed;
          p.position.z += (bdz / dist) * botSpeed;
        }

        // Room update
        const bRoom = ABBEY_ROOMS.find(
          (r) =>
            p.position.x >= r.bounds.minX &&
            p.position.x <= r.bounds.maxX &&
            p.position.z >= r.bounds.minZ &&
            p.position.z <= r.bounds.maxZ
        );
        if (bRoom) p.currentRoom = bRoom.id;

        // Impostor bot hunting logic (Levitation & Cross Ritual)
        if (p.role === 'impostor' && p.killCooldown <= 0 && !p.isChannelingKill) {
          // Find closest monk
          const monkTarget = currentPlayers.find(
            (other) => other.isAlive && other.role === 'monk' && !other.isBeingLevitated && Math.hypot(other.position.x - p.position.x, other.position.z - p.position.z) < 2.5
          );
          if (monkTarget && !monkTarget.hasHolyProtection) {
            // Start levitation ritual
            p.isChannelingKill = true;
            p.channelingTimer = 3.5;
            p.channelingTargetId = monkTarget.id;
            monkTarget.isBeingLevitated = true;
            soundEngine.playPhantomWhisper();
          }
        }

        // Bot discovers dead body
        deadBodies.forEach((body) => {
          if (!body.discovered && Math.hypot(p.position.x - body.position.x, p.position.z - body.position.z) < 5.0) {
            body.discovered = true;
            triggerMeeting('body_found', body, p);
          }
        });
      });

      // 2b. Progress all Levitation Channeling Kills (Human or Bot)
      let activeWitnessTarget: PlayerData | null = null;
      currentPlayers.forEach((p) => {
        if (p.isChannelingKill && p.channelingTargetId) {
          const victim = currentPlayers.find((v) => v.id === p.channelingTargetId);
          if (victim && victim.isAlive) {
            victim.isBeingLevitated = true;
            p.channelingTimer = (p.channelingTimer || 3.5) - 0.016;

            // Check if human witnesses this ritual in progress
            if (human.isAlive && human.id !== p.id && human.id !== victim.id) {
              const distToCrime = Math.hypot(p.position.x - human.position.x, p.position.z - human.position.z);
              if (distToCrime < 14) {
                activeWitnessTarget = victim;
              }
            }

            // Check if bot witnesses this ritual
            currentPlayers.forEach((w) => {
              if (!w.isHuman && w.isAlive && w.id !== p.id && w.id !== victim.id && w.role === 'monk') {
                const distToCrime = Math.hypot(p.position.x - w.position.x, p.position.z - w.position.z);
                if (distToCrime < 8 && Math.random() < 0.02) {
                  // Bot witnesses and calls emergency flagrante!
                  triggerMeeting('witnessed_kill', undefined, w);
                }
              }
            });

            // Finish ritual after 3.5s
            if (p.channelingTimer <= 0) {
              victim.isAlive = false;
              victim.isBeingLevitated = false;
              p.isChannelingKill = false;
              p.channelingTargetId = undefined;
              p.killCooldown = 40; // Considerable cooldown as requested

              soundEngine.playKillSound();
              setDeadBodies((prev) => [
                ...prev,
                {
                  id: `body_${Date.now()}`,
                  playerId: victim.id,
                  playerName: victim.name,
                  color: victim.color,
                  position: { ...victim.position },
                  roomId: victim.currentRoom,
                  discovered: false,
                },
              ]);
            }
          } else {
            p.isChannelingKill = false;
            p.channelingTargetId = undefined;
          }
        }
      });
      setWitnessedKillTarget(activeWitnessTarget);

      // 3. Proximity Checks for Human
      // Tasks
      const nearT = tasks.find(
        (t) =>
          !t.completed &&
          Math.hypot(t.position[0] - human.position.x, t.position[2] - human.position.z) < 3.2
      );
      setNearbyTask(nearT || null);

      // Dead Bodies
      const nearB = deadBodies.find(
        (b) => Math.hypot(b.position.x - human.position.x, b.position.z - human.position.z) < 3.5
      );
      setNearbyBody(nearB || null);

      // Emergency Bell in Nave
      const distToBell = Math.hypot(0 - human.position.x, 14 - human.position.z);
      setCanCallEmergency(distToBell < 3.2);

      // Vents
      const nearV = VENT_LOCATIONS.find(
        (v) => Math.hypot(v.position[0] - human.position.x, v.position[2] - human.position.z) < 2.8
      );
      setNearbyVentId(nearV ? nearV.id : null);

      // Traps check
      if (human.isAlive && !human.isTrapped) {
        sabotageState.traps.forEach((trap) => {
          if (Math.hypot(trap.x - human.position.x, trap.z - human.position.z) < 1.8) {
            human.isTrapped = true;
            human.trapTimer = 4;
            soundEngine.playTrapTrigger();
          }
        });
      }

      // Cooldown decrements
      if (human.killCooldown > 0) {
        human.killCooldown = Math.max(0, human.killCooldown - 0.016);
      }
      currentPlayers.forEach((p) => {
        if (!p.isHuman && p.killCooldown > 0) {
          p.killCooldown = Math.max(0, p.killCooldown - 0.016);
        }
      });

      // Sync 3D engine
      if (engineRef.current) {
        engineRef.current.syncPlayers(currentPlayers, human.id);
        engineRef.current.syncDeadBodies(deadBodies);
        engineRef.current.setBlackout(sabotageState.active && sabotageState.type === 'blackout');
      }

      // Check Win Conditions
      checkVictoryConditions(currentPlayers, tasks);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [phase, tasks, deadBodies, sabotageState]);

  // Sabotage Cooldown Timer (1s Interval)
  useEffect(() => {
    if (phase !== 'playing') return;

    const interval = setInterval(() => {
      setSabotageState((prev) => {
        const nextCd = { ...prev.cooldowns };
        (Object.keys(nextCd) as SabotageType[]).forEach((k) => {
          if (nextCd[k] > 0) nextCd[k]--;
        });

        // Sabotage timer decrement
        let active = prev.active;
        let timer = prev.timer;
        if (active && timer > 0) {
          timer--;
          if (timer <= 0) {
            if (prev.type === 'curse_bells') {
              // Critical sabotage victory for Impostors!
              setGameOver({
                winner: 'impostors',
                reason: 'O Sino da Maldição ressoou até o fim e a loucura consumiu a abadia!',
              });
              setPhase('game_over');
            }
            active = false;
          }
        }

        return { ...prev, cooldowns: nextCd, active, timer };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Check Win Conditions
  const checkVictoryConditions = (currentPlayers: PlayerData[], currentTasks: TaskDefinition[]) => {
    const livingMonks = currentPlayers.filter((p) => p.isAlive && p.role === 'monk');
    const livingImpostors = currentPlayers.filter((p) => p.isAlive && p.role === 'impostor');

    // 1. Impostors equal or exceed monks => Impostors Win
    if (livingImpostors.length >= livingMonks.length && livingImpostors.length > 0) {
      soundEngine.playKillSound();
      setGameOver({
        winner: 'impostors',
        reason: 'A Freira Maligna e seus servos abateram os monges e tomaram a catedral!',
      });
      setPhase('game_over');
      return;
    }

    // 2. All Impostors ejected => Monks Win
    if (livingImpostors.length === 0) {
      soundEngine.playTaskComplete();
      setGameOver({
        winner: 'monks',
        reason: 'Todos os impostores foram desmascarados e banidos da abadia sagrada!',
      });
      setPhase('game_over');
      return;
    }

    // 3. All Tasks Completed => Monks Win
    const totalTasksCount = currentTasks.length;
    const completedTasksCount = currentTasks.filter((t) => t.completed).length;
    if (totalTasksCount > 0 && completedTasksCount >= totalTasksCount) {
      soundEngine.playTaskComplete();
      setGameOver({
        winner: 'monks',
        reason: 'Todas as tarefas sagradas foram concluídas e o mal foi expurgado da abadia!',
      });
      setPhase('game_over');
      return;
    }
  };

  // Impostor Kill Action: Suspender o jogador e esfaqueá-lo com uma cruz
  const attemptKill = () => {
    const human = players.find((p) => p.isHuman);
    if (!human || !human.isAlive || human.role !== 'impostor' || human.killCooldown > 0 || human.isChannelingKill) return;

    // Find nearest living monk
    const target = players.find(
      (p) => p.isAlive && p.role === 'monk' && !p.isBeingLevitated && Math.hypot(p.position.x - human.position.x, p.position.z - human.position.z) < 3.2
    );

    if (target) {
      if (target.hasHolyProtection) {
        soundEngine.playBell(300, 1.5, 0.5);
        target.hasHolyProtection = false;
        human.killCooldown = 15;
        return;
      }

      // Start levitation channeling ritual
      human.isChannelingKill = true;
      human.channelingTargetId = target.id;
      human.channelingTimer = 3.5;
      target.isBeingLevitated = true;

      soundEngine.playPhantomWhisper();
      setPlayers([...players]);
    }
  };

  // Sacred Power Activation by Innocent Monk
  const handleUseSacredPower = (powerKey: SacredPower) => {
    const human = players.find((p) => p.isHuman);
    if (!human || !human.isAlive || human.role === 'impostor') return;

    const cd = human.powerCooldowns[powerKey] || 0;
    if (cd > 0) return;

    soundEngine.playTaskComplete();

    // Reset cooldown for this power
    const nextCooldowns = { ...human.powerCooldowns, [powerKey]: 35 };
    human.powerCooldowns = nextCooldowns;

    if (powerKey === 'agua_benta') {
      // Stun any nearby impostor and cancel active levitation kills!
      players.forEach((p) => {
        if (p.isChannelingKill) {
          p.isChannelingKill = false;
          p.channelingTargetId = undefined;
          p.killCooldown = 18;
          if (p.channelingTargetId) {
            const v = players.find((target) => target.id === p.channelingTargetId);
            if (v) v.isBeingLevitated = false;
          }
        }
      });
      players.forEach((p) => (p.isBeingLevitated = false));
      setWitnessedKillTarget(null);
    } else if (powerKey === 'lascas_da_cruz') {
      human.hasHolyProtection = true;
      setTimeout(() => {
        human.hasHolyProtection = false;
        setPlayers([...players]);
      }, 20000);
    } else if (powerKey === 'livro_exorcismo') {
      soundEngine.playEmergencyAlarm();
      const impostorNames = players.filter((p) => p.role === 'impostor').map((p) => p.colorName).join(' e ');
      setChatMessages((prev) => [
        ...prev,
        {
          id: `exorcism_${Date.now()}`,
          senderId: 'system',
          senderName: 'Ritual de Exorcismo',
          senderColor: '#38bdf8',
          text: `A luz sagrada do Exorcismo revelou uma aura profana nos hábitos de cor: ${impostorNames}!`,
          timestamp: Date.now(),
          isSystem: true,
        },
      ]);
    } else if (powerKey === 'cruz_sagrada') {
      soundEngine.playBell(260, 3.0, 0.6);
      players.forEach((p) => {
        if (p.role === 'impostor') {
          p.killCooldown = Math.max(p.killCooldown, 12);
        }
      });
    } else if (powerKey === 'santo_graal') {
      soundEngine.playBell(180, 4.0, 0.7);
      if (sabotageState.active) {
        setSabotageState((prev) => ({ ...prev, active: false, timer: 0 }));
      } else if (deadBodies.length > 0) {
        const lastBody = deadBodies[deadBodies.length - 1];
        const resurrected = players.find((p) => p.id === lastBody.playerId);
        if (resurrected) {
          resurrected.isAlive = true;
          setDeadBodies(deadBodies.slice(0, -1));
        }
      }
    }

    setPlayers([...players]);
  };

  // Toggle Secret Vent
  const toggleVent = () => {
    const human = players.find((p) => p.isHuman);
    if (!human || human.role !== 'impostor') return;

    soundEngine.playVentWhoosh();
    if (human.inVent) {
      // Exit vent
      human.inVent = false;
    } else {
      // Enter vent & teleport to next vent location
      human.inVent = true;
      const currentVentIndex = VENT_LOCATIONS.findIndex((v) => v.id === nearbyVentId);
      const nextVent = VENT_LOCATIONS[(currentVentIndex + 1) % VENT_LOCATIONS.length];
      human.position.x = nextVent.position[0];
      human.position.z = nextVent.position[2];
      human.currentRoom = nextVent.roomId;
    }
    setPlayers([...players]);
  };

  // Trigger Sabotage
  const handleTriggerSabotage = (type: SabotageType) => {
    soundEngine.playEmergencyAlarm();
    const sabDef = SABOTAGES.find((s) => s.type === type);
    const cooldownDuration = sabDef?.cooldown || 30;

    setSabotageState((prev) => ({
      ...prev,
      active: true,
      type,
      timer: sabDef?.duration || 30,
      maxTimer: sabDef?.duration || 30,
      doorsLocked: type === 'lockdown',
      lockedRooms: type === 'lockdown' ? ['sacristia', 'calabouco'] : [],
      cursedRooms: type === 'curse_station' ? ['altar', 'cemiterio'] : [],
      cooldowns: {
        ...prev.cooldowns,
        [type]: cooldownDuration,
      },
    }));

    if (type === 'plant_trap') {
      const human = players.find((p) => p.isHuman);
      if (human) {
        setSabotageState((prev) => ({
          ...prev,
          traps: [
            ...prev.traps,
            {
              id: `trap_${Date.now()}`,
              x: human.position.x,
              z: human.position.z,
              createdBy: human.id,
              createdAt: Date.now(),
            },
          ],
        }));
      }
    }
  };

  // Trigger Emergency / Body Report / Witnessed Kill Meeting
  const triggerMeeting = (
    reason: 'body_found' | 'emergency_bell' | 'witnessed_kill',
    body?: DeadBody,
    caller?: PlayerData
  ) => {
    soundEngine.playEmergencyAlarm();
    const callingPlayer = caller || players.find((p) => p.isHuman)!;

    // Reset levitation on all players and cancel active channeling
    players.forEach((p) => {
      p.isChannelingKill = false;
      p.isBeingLevitated = false;
      p.channelingTargetId = undefined;
    });
    setWitnessedKillTarget(null);

    // Reset all living players to Council Table in Nave
    const updated = players.map((p, i) => {
      const angle = (i * Math.PI * 2) / players.length;
      return {
        ...p,
        position: { x: Math.cos(angle) * 3.5, y: 0, z: 14 + Math.sin(angle) * 3.5 },
        currentRoom: 'nave' as RoomId,
        inVent: false,
      };
    });
    setPlayers(updated);

    const initialMessages: ChatMessage[] = [
      {
        id: `msg_sys_1`,
        senderId: 'system',
        senderName: 'Assembleia Sagrada',
        senderColor: '#fbbf24',
        text: reason === 'witnessed_kill'
          ? `FLAGRANTE CONFIRMADO! ${callingPlayer.name} presenciou a Freira Maligna suspendendo e tentando esfaquear um monge com a cruz!`
          : reason === 'body_found'
          ? `O corpo do ${body?.playerName} foi encontrado no ${body?.roomId}! Reúnam-se imediatamente!`
          : `${callingPlayer.name} badalou o Grande Sino da Abadia para convocar o conselho de emergência!`,
        timestamp: Date.now(),
        isSystem: true,
      },
    ];

    // Seed realistic bot chatter
    const livingBots = updated.filter((p) => !p.isHuman && p.isAlive);
    livingBots.slice(0, 3).forEach((bot, idx) => {
      setTimeout(() => {
        const alibi = BOT_ALIBIS[Math.floor(Math.random() * BOT_ALIBIS.length)];
        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg_bot_${Date.now()}_${idx}`,
            senderId: bot.id,
            senderName: bot.name,
            senderColor: bot.color,
            text: alibi,
            timestamp: Date.now(),
          },
        ]);
      }, 1500 + idx * 2500);
    });

    setMeeting({
      callerId: callingPlayer.id,
      callerName: callingPlayer.name,
      reason,
      victimName: body?.playerName,
      victimRoom: body?.roomId,
      discussionTimer: 45,
      votingTimer: 25,
      votes: {},
      hasVoted: {},
      ejectedPlayer: null,
      ejectionResultText: '',
      isTie: false,
    });

    setChatMessages(initialMessages);
    setIsVotingPhase(false);
    setMeetingTimer(45);
    setPhase('meeting_discussion');
  };

  // Meeting Timer Countdown
  useEffect(() => {
    if (phase !== 'meeting_discussion' && phase !== 'meeting_voting') return;

    const interval = setInterval(() => {
      setMeetingTimer((prev) => {
        if (prev <= 1) {
          if (!isVotingPhase) {
            // Transition to voting
            setIsVotingPhase(true);
            setPhase('meeting_voting');
            soundEngine.playBell(140, 1.5, 0.3);
            return 25; // 25s voting timer
          } else {
            // End of voting => tally
            tallyVotes();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isVotingPhase, meeting]);

  // Cast Vote
  const handleCastVote = (targetId: string | 'skip') => {
    if (!meeting) return;
    const human = players.find((p) => p.isHuman)!;

    const nextVotes = { ...meeting.votes, [human.id]: targetId };
    const nextHasVoted = { ...meeting.hasVoted, [human.id]: true };

    // Simulate bot votes
    players.forEach((p) => {
      if (!p.isHuman && p.isAlive && !nextHasVoted[p.id]) {
        // Bots randomly pick a living player or skip
        const livingTargets = players.filter((t) => t.isAlive && t.id !== p.id);
        const shouldSkip = Math.random() < 0.3;
        const target = shouldSkip
          ? 'skip'
          : livingTargets[Math.floor(Math.random() * livingTargets.length)].id;

        nextVotes[p.id] = target;
        nextHasVoted[p.id] = true;
      }
    });

    setMeeting({
      ...meeting,
      votes: nextVotes,
      hasVoted: nextHasVoted,
    });

    // If everyone voted, finish immediately
    const livingTotal = players.filter((p) => p.isAlive).length;
    if (Object.keys(nextHasVoted).length >= livingTotal) {
      setTimeout(() => tallyVotes(nextVotes), 1000);
    }
  };

  // Tally Votes and trigger Ejection
  const tallyVotes = (votesOverride?: Record<string, string>) => {
    if (!meeting) return;
    const votes = votesOverride || meeting.votes;

    // Count votes
    const counts: Record<string, number> = {};
    Object.values(votes).forEach((target) => {
      counts[target] = (counts[target] || 0) + 1;
    });

    // Find highest
    let maxVotes = 0;
    let topTarget: string | null = null;
    let isTie = false;

    Object.entries(counts).forEach(([target, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        topTarget = target;
        isTie = false;
      } else if (count === maxVotes) {
        isTie = true;
      }
    });

    let ejected: PlayerData | null = null;
    let resultText = 'Nenhum monge foi banido da abadia (Empate ou Votos Pulados).';

    if (!isTie && topTarget && topTarget !== 'skip') {
      ejected = players.find((p) => p.id === topTarget) || null;
      if (ejected) {
        ejected.isAlive = false;
        const isImp = ejected.role === 'impostor';
        resultText = isImp
          ? `${ejected.name} foi arremessado do campanário... Ele era a Freira Maligna!`
          : `${ejected.name} foi expulso da abadia... Ele NÃO era um impostor.`;
      }
    }

    setMeeting({
      ...meeting,
      ejectedPlayer: ejected,
      ejectionResultText: resultText,
      isTie,
    });

    setPhase('ejection');
  };

  // Finish Ejection and Return to Gameplay
  const handleEjectionFinish = () => {
    setMeeting(null);
    setDeadBodies([]); // Clean bodies after meeting
    setPhase('playing');
  };

  // Send Chat Message
  const handleSendMessage = (text: string) => {
    const human = players.find((p) => p.isHuman)!;
    soundEngine.playTick(500, 0.08);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: human.id,
      senderName: human.name,
      senderColor: human.color,
      text,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // Bot response after 1.5s
    setTimeout(() => {
      const livingBots = players.filter((p) => !p.isHuman && p.isAlive);
      if (livingBots.length > 0) {
        const responder = livingBots[Math.floor(Math.random() * livingBots.length)];
        const accusationTemplate = BOT_ACCUSATIONS[Math.floor(Math.random() * BOT_ACCUSATIONS.length)];
        const randomSuspect = players[Math.floor(Math.random() * players.length)].name;
        const randomRoom = ABBEY_ROOMS[Math.floor(Math.random() * ABBEY_ROOMS.length)].name;

        const replyText = accusationTemplate
          .replace('{suspect}', randomSuspect)
          .replace('{room}', randomRoom);

        setChatMessages((prev) => [
          ...prev,
          {
            id: `msg_bot_${Date.now()}`,
            senderId: responder.id,
            senderName: responder.name,
            senderColor: responder.color,
            text: replyText,
            timestamp: Date.now(),
          },
        ]);
      }
    }, 1200);
  };

  // Task Completion Handler
  const handleTaskComplete = () => {
    if (!activeTask) return;
    const human = players.find((p) => p.isHuman)!;

    // Mark task completed
    const updatedTasks = tasks.map((t) => (t.id === activeTask.id ? { ...t, completed: true } : t));
    setTasks(updatedTasks);

    human.tasksCompleted = Math.min(human.totalTasks, human.tasksCompleted + 1);

    // Award Sacred Relic Power to monk if it's a relic puzzle!
    if (activeTask.isSacredRelicPuzzle && activeTask.sacredPowerReward) {
      if (!human.unlockedPowers) human.unlockedPowers = [];
      if (!human.unlockedPowers.includes(activeTask.sacredPowerReward)) {
        human.unlockedPowers.push(activeTask.sacredPowerReward);
        soundEngine.playTaskComplete();
      }
    }

    setPlayers([...players]);
    setActiveTask(null);
  };

  // Calculate Total Abbey Task Progress %
  const totalTaskProgress = tasks.length > 0
    ? (tasks.filter((t) => t.completed).length / tasks.length) * 100
    : 0;

  const humanPlayer = players.find((p) => p.isHuman) || players[0];
  const livingImpostorsCount = players.filter((p) => p.isAlive && p.role === 'impostor').length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0a09] select-none font-sans">
      
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={canvasMountRef} className="absolute inset-0 z-0 w-full h-full" />

      {/* Title & Lobby Phase */}
      {phase === 'title' && (
        <TitleScreen
          settings={settings}
          onUpdateSettings={setSettings}
          onStartGame={initializeGame}
        />
      )}

      {/* In-Game HUD (Zero Occlusion, Collapsible Dock) */}
      {phase === 'playing' && humanPlayer && (
        <GameHUD
          humanPlayer={humanPlayer}
          activeRoomId={humanPlayer.currentRoom}
          totalTaskProgress={totalTaskProgress}
          sabotageState={sabotageState}
          nearbyTask={nearbyTask}
          nearbyBody={nearbyBody}
          nearbyVentId={nearbyVentId}
          witnessedKillTarget={witnessedKillTarget}
          canCallEmergency={canCallEmergency}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(soundEngine.toggleMute())}
          onInteractTask={() => nearbyTask && setActiveTask(nearbyTask)}
          onReportBody={() => {
            if (witnessedKillTarget) {
              triggerMeeting('witnessed_kill');
            } else if (nearbyBody) {
              triggerMeeting('body_found', nearbyBody);
            }
          }}
          onCallEmergency={() => triggerMeeting('emergency_bell')}
          onKill={attemptKill}
          onToggleVent={toggleVent}
          onOpenSabotage={() => setShowSabotageModal(true)}
          onOpenMap={() => setShowMapModal(true)}
          onUseSacredPower={handleUseSacredPower}
        />
      )}

      {/* Task Mini-game Modal */}
      {activeTask && (
        <TaskModal
          task={activeTask}
          onComplete={handleTaskComplete}
          onClose={() => setActiveTask(null)}
        />
      )}

      {/* Discussion & Voting Meeting Modal */}
      {(phase === 'meeting_discussion' || phase === 'meeting_voting') && meeting && (
        <MeetingModal
          meeting={meeting}
          players={players}
          humanPlayer={humanPlayer}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          onCastVote={handleCastVote}
          onAdvanceToVoting={() => {
            setIsVotingPhase(true);
            setPhase('meeting_voting');
            setMeetingTimer(25);
          }}
          isVotingPhase={isVotingPhase}
          timeLeft={meetingTimer}
        />
      )}

      {/* Ejection Screen */}
      {phase === 'ejection' && meeting && (
        <EjectionScreen
          ejectedPlayer={meeting.ejectedPlayer}
          resultText={meeting.ejectionResultText}
          impostorsRemaining={livingImpostorsCount}
          onFinish={handleEjectionFinish}
        />
      )}

      {/* Sabotage Modal for Evil Nun */}
      {showSabotageModal && (
        <SabotageModal
          sabotageState={sabotageState}
          onTriggerSabotage={handleTriggerSabotage}
          onClose={() => setShowSabotageModal(false)}
        />
      )}

      {/* Minimap Modal */}
      {showMapModal && (
        <MinimapModal
          humanPlayer={humanPlayer}
          tasks={tasks}
          sabotageState={sabotageState}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {/* Game Over Modal */}
      {phase === 'game_over' && gameOver && (
        <GameOverModal
          gameOverState={gameOver}
          players={players}
          onPlayAgain={() => {
            soundEngine.stopAmbient();
            setPhase('title');
          }}
        />
      )}

    </div>
  );
}
