import React, { useState, useEffect, useRef } from 'react';
import { PlayerData, MeetingState, ChatMessage } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { 
  BellIcon, 
  SkullIcon, 
  UserIcon, 
  SendIcon, 
  CheckIcon, 
  AlertTriangleIcon,
  MonkHoodIcon 
} from './SvgIcons';

interface MeetingModalProps {
  meeting: MeetingState;
  players: PlayerData[];
  humanPlayer: PlayerData;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onCastVote: (targetId: string | 'skip') => void;
  onAdvanceToVoting: () => void;
  isVotingPhase: boolean;
  timeLeft: number;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  meeting,
  players,
  humanPlayer,
  chatMessages,
  onSendMessage,
  onCastVote,
  onAdvanceToVoting,
  isVotingPhase,
  timeLeft,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string | 'skip' | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const humanHasVoted = !!meeting.hasVoted[humanPlayer.id];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickChat = (msg: string) => {
    onSendMessage(msg);
  };

  const confirmVote = (target: string | 'skip') => {
    if (humanHasVoted || !humanPlayer.isAlive) return;
    soundEngine.playTick(600, 0.15);
    setSelectedTarget(target);
    onCastVote(target);
  };

  const QUICK_REPLIES = [
    'Eu estava fazendo tarefas no Altar.',
    'Achei o corpo no Calabouço!',
    'Alguém viu a Freira Maligna?',
    'Acho muito suspeito o comportamento!',
    'Melhor pularmos o voto por enquanto.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-6 backdrop-blur-none">
      <div className="w-full max-w-5xl h-[90vh] bg-stone-900 border-2 border-stone-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-stone-950 px-6 py-3 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {meeting.reason === 'body_found' ? (
              <div className="flex items-center gap-2 text-rose-500 font-gothic font-bold text-lg">
                <SkullIcon className="w-7 h-7 text-rose-500" />
                <span>Corpo Encontrado por {meeting.callerName}!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-400 font-gothic font-bold text-lg">
                <BellIcon className="w-7 h-7 text-amber-400 animate-bounce" />
                <span>Reunião de Emergência Convocada!</span>
              </div>
            )}
          </div>

          {/* Phase Badge & Timer */}
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest font-mono px-3 py-1 bg-stone-800 rounded border border-stone-700 text-stone-300">
              {isVotingPhase ? 'Fase de Votação' : 'Fase de Discussão'}
            </span>
            <div className="flex items-center gap-2 bg-stone-950 px-4 py-1.5 rounded-lg border border-amber-600/50">
              <span className="text-stone-400 text-xs font-gothic">Tempo:</span>
              <span className={`font-mono text-lg font-bold tabular-nums ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Players, Right Chat */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 bg-stone-900">
          
          {/* Players Roster (Left: 7 cols) */}
          <div className="md:col-span-7 p-4 border-r border-stone-800 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-gothic text-stone-400">Monges da Abadia ({players.length})</span>
              {!isVotingPhase && (
                <button
                  onClick={onAdvanceToVoting}
                  className="px-3 py-1 text-xs bg-amber-700/80 hover:bg-amber-600 text-stone-100 rounded font-gothic font-semibold transition cursor-pointer"
                >
                  Iniciar Votação Agora &rarr;
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
              {players.map((p) => {
                const hasVoted = meeting.hasVoted[p.id];
                const isSelf = p.id === humanPlayer.id;

                return (
                  <div
                    key={p.id}
                    className={`relative p-3 rounded-xl border flex items-center justify-between transition-all ${
                      !p.isAlive
                        ? 'bg-stone-950/80 border-stone-800 opacity-50'
                        : isSelf
                        ? 'bg-amber-950/20 border-amber-600/60 shadow'
                        : 'bg-stone-800/80 border-stone-700 hover:border-stone-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-inner"
                        style={{ backgroundColor: p.color, borderColor: '#44403c' }}
                      >
                        <MonkHoodIcon className="w-6 h-6 text-stone-900" />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-gothic font-bold text-sm text-stone-200">
                            {p.name}
                          </span>
                          {isSelf && (
                            <span className="text-[10px] bg-amber-700/60 text-amber-200 px-1.5 py-0.2 rounded font-mono">
                              Você
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 block font-mono">
                          {p.isAlive ? p.colorName : 'Morto / Espectro'}
                        </span>
                      </div>
                    </div>

                    {/* Voting Action / Status */}
                    <div>
                      {!p.isAlive ? (
                        <SkullIcon className="w-5 h-5 text-stone-600" />
                      ) : isVotingPhase ? (
                        humanPlayer.isAlive && !humanHasVoted && !isSelf ? (
                          <button
                            onClick={() => confirmVote(p.id)}
                            className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-700 text-rose-200 text-xs font-gothic rounded border border-rose-600/50 transition cursor-pointer active:scale-95"
                          >
                            Votar
                          </button>
                        ) : hasVoted ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-semibold">
                            <CheckIcon className="w-4 h-4" /> Votou
                          </span>
                        ) : (
                          <span className="text-stone-500 text-xs italic font-serif">Pensando...</span>
                        )
                      ) : hasVoted ? (
                        <CheckIcon className="w-4 h-4 text-emerald-500" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skip Vote Button */}
            {isVotingPhase && humanPlayer.isAlive && !humanHasVoted && (
              <div className="mt-3 pt-3 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => confirmVote('skip')}
                  className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-gothic text-xs font-bold rounded-lg border border-stone-600 transition cursor-pointer"
                >
                  Pular Voto (Sem Acusação)
                </button>
              </div>
            )}
          </div>

          {/* Council Chat (Right: 5 cols) */}
          <div className="md:col-span-5 flex flex-col bg-stone-950 p-4 min-h-0">
            <span className="text-xs uppercase font-gothic text-stone-400 mb-2">Discussão do Conselho</span>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0">
              {chatMessages.length === 0 && (
                <div className="h-full flex items-center justify-center text-stone-600 text-xs italic">
                  O conselho aguarda os primeiros testemunhos...
                </div>
              )}
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-lg text-xs border ${
                    msg.isSystem
                      ? 'bg-amber-950/20 border-amber-900/50 text-amber-300 italic'
                      : msg.senderId === humanPlayer.id
                      ? 'bg-stone-800 border-amber-600/40 text-stone-200 ml-4'
                      : 'bg-stone-900 border-stone-800 text-stone-300 mr-4'
                  }`}
                >
                  {!msg.isSystem && (
                    <div className="flex items-center gap-1.5 mb-1 font-gothic font-bold">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: msg.senderColor }} />
                      <span style={{ color: msg.senderColor }}>{msg.senderName}:</span>
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Chat Pills */}
            <div className="py-2 flex flex-wrap gap-1.5 border-t border-stone-800/80 mt-2">
              {QUICK_REPLIES.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickChat(reply)}
                  className="text-[10px] bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 px-2.5 py-1 rounded-full border border-stone-800 transition cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSend} className="flex gap-2 pt-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Fale com o conselho dos monges..."
                className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-amber-700 hover:bg-amber-600 text-stone-900 font-bold rounded-lg transition cursor-pointer flex items-center justify-center"
              >
                <SendIcon className="w-4 h-4 text-stone-900" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
