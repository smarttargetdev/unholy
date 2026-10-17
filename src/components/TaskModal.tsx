import React, { useState } from 'react';
import { TaskDefinition } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { 
  AbbeyCrossIcon, 
  CandleIcon, 
  ChaliceIcon, 
  BookIcon, 
  RelicIcon, 
  WaterGrateIcon, 
  BellIcon, 
  TombstoneIcon, 
  LeafPrunerIcon, 
  CloseIcon, 
  CheckIcon 
} from './SvgIcons';

interface TaskModalProps {
  task: TaskDefinition;
  onComplete: () => void;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onComplete, onClose }) => {
  // State for interactive mini-games
  const [completedLocal, setCompletedLocal] = useState(false);

  // 1. Candles task state
  const [candlesLit, setCandlesLit] = useState<boolean[]>([false, false, false, false, false]);

  // 2. Chalice scrubbing state
  const [polishProgress, setPolishProgress] = useState(0);

  // 3. Roman Missal pages
  const [missalSequence, setMissalSequence] = useState<number[]>([]);

  // 4. Reliquary symbols
  const SYMBOLS = ['Cruz', 'Cálice', 'Sino', 'Anjo', 'Chave'];
  const [wheels, setWheels] = useState<number[]>([0, 1, 2]);
  const TARGET_CODE = [1, 0, 2]; // Cálice, Cruz, Sino

  // 5. Crypt Pipe valves
  const [pipes, setPipes] = useState<number[]>([90, 180, 270, 90]);

  // 6. Bell Tower Rhythm strikes
  const [bellStrikes, setBellStrikes] = useState<number>(0);

  // 7. Graveyard Tombstone shards
  const [shardsPlaced, setShardsPlaced] = useState<boolean[]>([false, false, false]);

  // 8. Garden Vines clipped
  const [vinesClipped, setVinesClipped] = useState<boolean[]>([false, false, false, false]);

  // 9. Generic progress tasks (Pews, Oil, Torches, Seeds, etc.)
  const [simpleProgress, setSimpleProgress] = useState<number>(0);

  const handleFinish = () => {
    if (completedLocal) return;
    setCompletedLocal(true);
    soundEngine.playTaskComplete();
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  // Render specific mini-game
  const renderGameContent = () => {
    switch (task.type) {
      // 1. Acender Velas
      case 'acender_velas': {
        const toggleCandle = (idx: number) => {
          if (candlesLit[idx]) return;
          soundEngine.playTick(500 + idx * 80);
          const next = [...candlesLit];
          next[idx] = true;
          setCandlesLit(next);
          if (next.every(Boolean)) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-6">
            <p className="text-stone-300 text-sm mb-6 text-center">
              Toque em cada uma das cinco velas sagradas do candelabro para acendê-las na ordem.
            </p>
            <div className="flex gap-6 items-end bg-stone-900/90 p-8 rounded-xl border border-stone-700 shadow-2xl">
              {candlesLit.map((isLit, i) => (
                <button
                  key={i}
                  onClick={() => toggleCandle(i)}
                  className={`flex flex-col items-center transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
                    isLit ? 'opacity-100' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="h-10 flex items-center justify-center">
                    {isLit ? (
                      <span className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] text-3xl animate-bounce">
                        🔥
                      </span>
                    ) : (
                      <span className="w-1.5 h-3 bg-stone-500 rounded-t"></span>
                    )}
                  </div>
                  <div
                    className="w-8 rounded-t bg-amber-100 border-x border-stone-400 shadow-inner"
                    style={{ height: `${60 + i * 15}px` }}
                  />
                  <span className="text-xs text-stone-400 font-gothic mt-2">{i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        );
      }

      // 2. Polir o Cálice
      case 'polir_calice': {
        const scrub = () => {
          if (polishProgress >= 100) return;
          soundEngine.playTick(300 + polishProgress * 6, 0.08);
          const next = polishProgress + 12;
          setPolishProgress(next);
          if (next >= 100) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-stone-300 text-sm mb-4 text-center">
              Passe o tecido sagrado repetidamente sobre o cálice para remover a fuligem e cera antiga.
            </p>
            <div className="relative flex flex-col items-center justify-center bg-stone-900/90 p-8 rounded-xl border border-stone-700 w-full max-w-sm">
              <div 
                onClick={scrub} 
                className="w-48 h-48 rounded-full border-4 border-amber-600/60 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 select-none shadow-2xl transition-all"
                style={{
                  background: `radial-gradient(circle, rgba(245, 158, 11, ${polishProgress / 120}) 0%, rgba(28, 25, 23, 0.95) 75%)`
                }}
              >
                <ChaliceIcon className={`w-24 h-24 ${polishProgress >= 100 ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.9)]' : 'text-stone-500'}`} />
                <span className="text-xs text-amber-200 mt-2 font-mono">{Math.min(100, polishProgress)}% Lustrado</span>
              </div>
              <button
                onClick={scrub}
                className="mt-6 px-6 py-2.5 bg-amber-700 hover:bg-amber-600 active:scale-95 text-stone-900 font-gothic font-bold rounded-lg cursor-pointer shadow-lg"
              >
                Esfregar Cálice
              </button>
            </div>
          </div>
        );
      }

      // 3. Organizar o Missal Sagrado
      case 'organizar_missal': {
        const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V'];
        const clickRoman = (val: number) => {
          if (missalSequence.includes(val)) return;
          const next = [...missalSequence, val];
          soundEngine.playTick(400 + next.length * 90);
          setMissalSequence(next);
          if (next.length === 5) {
            // Check if correct order
            const isCorrect = next.every((n, idx) => n === idx + 1);
            if (isCorrect) {
              handleFinish();
            } else {
              soundEngine.playTick(150, 0.2);
              setTimeout(() => setMissalSequence([]), 500);
            }
          }
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-stone-300 text-sm mb-6 text-center">
              Reorganize os cantos do missal em ordem crescente: I, II, III, IV, V.
            </p>
            <div className="bg-stone-900/90 p-6 rounded-xl border border-stone-700 max-w-md w-full">
              <div className="h-14 bg-stone-950 rounded-lg border border-stone-800 flex items-center justify-center gap-4 mb-6">
                {missalSequence.map((num, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-900/40 text-amber-300 font-gothic font-bold rounded border border-amber-700/50">
                    {ROMAN_NUMERALS[num - 1]}
                  </span>
                ))}
                {missalSequence.length === 0 && (
                  <span className="text-stone-600 text-xs italic font-serif">Selecione as páginas...</span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-3">
                {[3, 1, 5, 2, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => clickRoman(num)}
                    disabled={missalSequence.includes(num)}
                    className={`py-4 font-gothic text-xl font-bold rounded-lg border transition-all cursor-pointer ${
                      missalSequence.includes(num)
                        ? 'bg-stone-800/40 text-stone-600 border-stone-800'
                        : 'bg-stone-800 text-amber-200 border-stone-600 hover:bg-stone-700 hover:border-amber-500 active:scale-95'
                    }`}
                  >
                    {ROMAN_NUMERALS[num - 1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // 4. Decifrar Relicário
      case 'decifrar_relicario': {
        const rotateWheel = (wheelIdx: number) => {
          soundEngine.playTick(550, 0.1);
          const next = [...wheels];
          next[wheelIdx] = (next[wheelIdx] + 1) % SYMBOLS.length;
          setWheels(next);
          if (next[0] === TARGET_CODE[0] && next[1] === TARGET_CODE[1] && next[2] === TARGET_CODE[2]) {
            handleFinish();
          }
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-stone-300 text-sm mb-4 text-center">
              Gire as rodas arcanas para decifrar a trindade do relicário: [Cálice · Cruz · Sino]
            </p>
            <div className="flex gap-4 bg-stone-900/90 p-8 rounded-xl border border-stone-700">
              {wheels.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span className="text-xs text-stone-500 font-gothic">Disco {i + 1}</span>
                  <button
                    onClick={() => rotateWheel(i)}
                    className="w-24 h-24 rounded-full bg-stone-800 border-4 border-amber-600/70 hover:border-amber-400 flex items-center justify-center text-amber-300 font-gothic text-sm font-bold shadow-lg transition-all active:scale-90 cursor-pointer"
                  >
                    {SYMBOLS[val]}
                  </button>
                  <span className="text-[10px] text-stone-400">Toque para girar</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // 5. Drenar Cripta (Canos/Válvulas)
      case 'drenar_cripta': {
        const rotatePipe = (idx: number) => {
          soundEngine.playTick(350, 0.1);
          const next = [...pipes];
          next[idx] = (next[idx] + 90) % 360;
          setPipes(next);
          if (next.every((deg) => deg === 0 || deg === 180)) {
            handleFinish();
          }
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-stone-300 text-sm mb-4 text-center">
              Gire os canos de chumbo antigos até alinhá-los na horizontal para escoar as águas da cripta.
            </p>
            <div className="grid grid-cols-4 gap-4 bg-stone-900/90 p-6 rounded-xl border border-stone-700">
              {pipes.map((deg, i) => (
                <button
                  key={i}
                  onClick={() => rotatePipe(i)}
                  className="w-18 h-18 bg-stone-800 rounded-lg border-2 border-stone-600 hover:border-cyan-400 flex items-center justify-center cursor-pointer transition-transform duration-200"
                >
                  <div
                    className="w-12 h-4 bg-cyan-600 rounded-sm shadow-md transition-transform"
                    style={{ transform: `rotate(${deg}deg)` }}
                  />
                </button>
              ))}
            </div>
          </div>
        );
      }

      // 6. Sintonizar os Sinos
      case 'ajustar_sinos': {
        const pullRope = () => {
          soundEngine.playBell(120 + bellStrikes * 25, 2.0, 0.5);
          const next = bellStrikes + 1;
          setBellStrikes(next);
          if (next >= 4) {
            handleFinish();
          }
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-stone-300 text-sm mb-4 text-center">
              Puxe a corda do campanário com firmeza quatro vezes para ressoar o bronze sagrado.
            </p>
            <div className="flex flex-col items-center bg-stone-900/90 p-8 rounded-xl border border-stone-700 w-full max-w-sm">
              <div className="relative mb-6">
                <BellIcon className="w-24 h-24 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-stone-800 text-xs text-amber-300 rounded font-mono">
                  {bellStrikes} / 4 Badalos
                </span>
              </div>
              <button
                onClick={pullRope}
                className="w-full py-3 bg-amber-700 hover:bg-amber-600 active:scale-95 text-stone-950 font-gothic font-bold rounded-lg cursor-pointer shadow-xl"
              >
                Puxar Corda do Sino
              </button>
            </div>
          </div>
        );
      }

      // 7. Restaurar Lápide
      case 'restaurar_lapide': {
        const placeShard = (idx: number) => {
          soundEngine.playTick(450, 0.1);
          const next = [...shardsPlaced];
          next[idx] = true;
          setShardsPlaced(next);
          if (next.every(Boolean)) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-stone-300 text-sm mb-4 text-center">
              Encaixe os três fragmentos da cruz celta partida sobre a lápide consagrada.
            </p>
            <div className="flex flex-col items-center bg-stone-900/90 p-6 rounded-xl border border-stone-700 w-full max-w-sm">
              <div className="w-40 h-52 bg-stone-950 rounded-t-3xl border-2 border-stone-700 relative flex flex-col items-center justify-center p-4 mb-4">
                <TombstoneIcon className="w-20 h-20 text-stone-700" />
                <div className="flex gap-2 mt-2">
                  {shardsPlaced.map((placed, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded ${placed ? 'bg-emerald-900 text-emerald-300' : 'bg-stone-800 text-stone-500'}`}>
                      Frag. {i + 1}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                {shardsPlaced.map((placed, i) => (
                  <button
                    key={i}
                    onClick={() => placeShard(i)}
                    disabled={placed}
                    className={`px-4 py-2 rounded-lg font-gothic text-xs cursor-pointer ${
                      placed ? 'bg-stone-800 text-stone-600' : 'bg-stone-700 hover:bg-stone-600 text-stone-200 border border-stone-500'
                    }`}
                  >
                    {placed ? 'Encaixado' : `Encaixar ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // 8. Podar Espinheiros
      case 'podar_espinheiros': {
        const clipVine = (idx: number) => {
          soundEngine.playTick(600, 0.1);
          const next = [...vinesClipped];
          next[idx] = true;
          setVinesClipped(next);
          if (next.every(Boolean)) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-stone-300 text-sm mb-4 text-center">
              Pode os ramos de espinhos amaldiçoados que sufocam a fonte sagrada do claustro.
            </p>
            <div className="grid grid-cols-2 gap-4 bg-stone-900/90 p-6 rounded-xl border border-stone-700">
              {vinesClipped.map((clipped, i) => (
                <button
                  key={i}
                  onClick={() => clipVine(i)}
                  disabled={clipped}
                  className={`h-24 w-32 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    clipped
                      ? 'bg-stone-950/40 border-stone-800 text-stone-600'
                      : 'bg-emerald-950/60 border-emerald-700 hover:border-emerald-400 text-emerald-300 active:scale-95'
                  }`}
                >
                  <LeafPrunerIcon className="w-8 h-8 mb-1" />
                  <span className="text-xs font-gothic">{clipped ? 'Podado' : 'Cortar Ramo'}</span>
                </button>
              ))}
            </div>
          </div>
        );
      }

      // 9. RELIC PUZZLE: Água Benta (Preencher os 3 frascos batismais)
      case 'relic_agua_benta': {
        const fillVial = () => {
          soundEngine.playTick(500 + simpleProgress * 10, 0.1);
          const next = simpleProgress + 34;
          setSimpleProgress(next);
          if (next >= 100) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-cyan-200 text-sm mb-4 text-center font-serif">
              * Relíquia Sagrada: Despeje a essência da fonte pura para consagrar a Água Benta.
            </p>
            <div className="flex flex-col items-center bg-cyan-950/30 p-8 rounded-2xl border-2 border-cyan-600/60 w-full max-w-sm">
              <div className="w-24 h-36 border-4 border-cyan-400 rounded-b-3xl relative overflow-hidden mb-6 bg-stone-950">
                <div
                  className="absolute bottom-0 w-full bg-cyan-500/80 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                  style={{ height: `${Math.min(100, simpleProgress)}%` }}
                />
              </div>
              <button
                onClick={fillVial}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-gothic font-bold rounded-xl cursor-pointer shadow-lg active:scale-95 transition"
              >
                Verter Água Pura ({Math.min(100, simpleProgress)}%)
              </button>
            </div>
          </div>
        );
      }

      // 10. RELIC PUZZLE: Lascas da Cruz (Reconstruir a Vera Cruz)
      case 'relic_lascas_cruz': {
        const placeSplinter = (idx: number) => {
          soundEngine.playTick(420 + idx * 80, 0.1);
          const next = [...shardsPlaced];
          next[idx] = true;
          setShardsPlaced(next);
          if (next.every(Boolean)) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-amber-200 text-sm mb-4 text-center font-serif">
              * Relíquia Sagrada: Encaixe as 3 lascas autênticas da Cruz de Jesus no relicário de carvalho.
            </p>
            <div className="flex flex-col items-center bg-amber-950/20 p-8 rounded-2xl border-2 border-amber-600/60 w-full max-w-sm">
              <div className="relative w-36 h-48 border-2 border-amber-700/60 rounded-xl bg-stone-950 flex items-center justify-center mb-6">
                <AbbeyCrossIcon className={`w-28 h-28 ${shardsPlaced.every(Boolean) ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.9)]' : 'text-stone-700'}`} />
              </div>
              <div className="grid grid-cols-3 gap-3 w-full">
                {shardsPlaced.map((placed, i) => (
                  <button
                    key={i}
                    onClick={() => placeSplinter(i)}
                    disabled={placed}
                    className={`py-3 rounded-lg font-gothic text-xs cursor-pointer ${
                      placed ? 'bg-amber-900/40 text-amber-500 border border-amber-800' : 'bg-amber-700 hover:bg-amber-600 text-stone-950 font-bold'
                    }`}
                  >
                    {placed ? 'Encaixada' : `Lasca ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // 11. RELIC PUZZLE: Livro de Exorcismo (Recitar Cântico Sagrado)
      case 'relic_livro_exorcismo': {
        const CHANT_WORDS = ['VADE', 'RETRO', 'SATANA', 'SANCTUS'];
        const clickWord = (wordIndex: number) => {
          soundEngine.playTick(300 + wordIndex * 100, 0.12);
          const next = [...missalSequence, wordIndex];
          setMissalSequence(next);
          if (next.length === 4) {
            const isCorrect = next.every((val, idx) => val === idx);
            if (isCorrect) {
              handleFinish();
            } else {
              soundEngine.playTick(160, 0.2);
              setTimeout(() => setMissalSequence([]), 500);
            }
          }
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-amber-200 text-sm mb-4 text-center font-serif">
              * Relíquia Sagrada: Recite o salmo de exorcismo na ordem sacra: [VADE &rarr; RETRO &rarr; SATANA &rarr; SANCTUS]
            </p>
            <div className="bg-stone-900/90 p-6 rounded-2xl border-2 border-amber-700/60 max-w-sm w-full">
              <div className="h-12 bg-stone-950 rounded-lg border border-stone-800 flex items-center justify-center gap-2 mb-4">
                {missalSequence.map((idx, i) => (
                  <span key={i} className="px-2 py-0.5 bg-amber-900/40 text-amber-300 font-gothic text-xs font-bold rounded">
                    {CHANT_WORDS[idx]}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[2, 0, 3, 1].map((wIdx) => (
                  <button
                    key={wIdx}
                    onClick={() => clickWord(wIdx)}
                    disabled={missalSequence.includes(wIdx)}
                    className="py-3 bg-stone-800 hover:bg-stone-700 active:scale-95 text-amber-200 font-gothic font-bold text-xs rounded-lg border border-stone-600 transition cursor-pointer"
                  >
                    {CHANT_WORDS[wIdx]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // 12. RELIC PUZZLE: Cruz Sagrada de Prata
      case 'relic_cruz_sagrada': {
        const hammerForge = () => {
          soundEngine.playTick(700, 0.15);
          const next = simpleProgress + 25;
          setSimpleProgress(next);
          if (next >= 100) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-stone-200 text-sm mb-4 text-center font-serif">
              * Relíquia Sagrada: Golpeie na bigorna sagrada para purificar a Cruz de Prata contra o mal.
            </p>
            <div className="flex flex-col items-center bg-stone-950 p-8 rounded-2xl border-2 border-stone-500 w-full max-w-sm">
              <div className="w-full bg-stone-900 h-4 rounded-full overflow-hidden border border-stone-700 mb-6">
                <div
                  className="bg-stone-300 h-full shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-200"
                  style={{ width: `${Math.min(100, simpleProgress)}%` }}
                />
              </div>
              <button
                onClick={hammerForge}
                className="w-full py-3 bg-stone-300 hover:bg-white text-stone-950 font-gothic font-bold rounded-xl cursor-pointer shadow-lg active:scale-95 transition"
              >
                Forjar Prata Sagrada ({Math.min(100, simpleProgress)}%)
              </button>
            </div>
          </div>
        );
      }

      // 13. RELIC PUZZLE: Santo Graal com o Sangue de Cristo
      case 'relic_santo_graal': {
        const addBloodDrop = () => {
          soundEngine.playBell(220 + simpleProgress * 3, 1.5, 0.4);
          const next = simpleProgress + 34;
          setSimpleProgress(next);
          if (next >= 100) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-4">
            <p className="text-rose-200 text-sm mb-4 text-center font-serif">
              * Relíquia Suprema: Desperte o Santo Graal com as 3 gotas divinas do Sangue da Aliança.
            </p>
            <div className="flex flex-col items-center bg-rose-950/30 p-8 rounded-2xl border-2 border-rose-600 w-full max-w-sm">
              <div className="w-24 h-24 rounded-full border-4 border-amber-500 flex items-center justify-center mb-6 bg-stone-950 shadow-[0_0_25px_rgba(234,179,8,0.4)]">
                <span className="text-3xl text-rose-500 animate-pulse">🍷</span>
              </div>
              <button
                onClick={addBloodDrop}
                className="w-full py-3 bg-gradient-to-r from-rose-700 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-gothic font-bold rounded-xl cursor-pointer shadow-xl active:scale-95 transition"
              >
                Consagrar Gota Sagrada ({Math.min(100, simpleProgress)}%)
              </button>
            </div>
          </div>
        );
      }

      // Outras tarefas (Limpeza, Reabastecer, Chaves, etc.)
      default: {
        const increment = () => {
          soundEngine.playTick(450 + simpleProgress * 15, 0.08);
          const next = simpleProgress + 25;
          setSimpleProgress(next);
          if (next >= 100) handleFinish();
        };

        return (
          <div className="flex flex-col items-center py-6">
            <p className="text-stone-300 text-sm mb-6 text-center">
              Execute os rituais sagrados correspondentes à tarefa para restaurar a ordem na abadia.
            </p>
            <div className="flex flex-col items-center bg-stone-900/90 p-8 rounded-xl border border-stone-700 w-full max-w-sm">
              <div className="w-full bg-stone-950 h-5 rounded-full overflow-hidden border border-stone-700 mb-6">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, simpleProgress)}%` }}
                />
              </div>
              <button
                onClick={increment}
                className="w-full py-3 bg-amber-700 hover:bg-amber-600 active:scale-95 text-stone-950 font-gothic font-bold rounded-lg cursor-pointer shadow-lg"
              >
                Completar Ação ({Math.min(100, simpleProgress)}%)
              </button>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-stone-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <AbbeyCrossIcon className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-gothic font-bold text-lg text-amber-200">{task.title}</h3>
              <p className="text-xs text-stone-400">{task.roomName} · Dificuldade: {task.difficulty}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {renderGameContent()}
        </div>

        {/* Completion Toast */}
        {completedLocal && (
          <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center gap-2 animate-fade-in">
            <CheckIcon className="w-16 h-16 text-emerald-400" />
            <span className="font-gothic text-xl font-bold text-emerald-200">Tarefa Sagrada Concluída!</span>
          </div>
        )}
      </div>
    </div>
  );
};
