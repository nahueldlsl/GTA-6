// ============================================================================
// 🌴 VICE-OS: MISIONES Y MENSAJES CIFRADOS (GTA VI iFruit / ViceOS)
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getMergedStoryNodes } from '../../store/editorStore';
import { LEONIDA_MARKERS } from '../../data/mapMarkers.data';
import { audioEngine } from '../../engine/audioEngine';
import { VOICE_NOTE_PLAYBACK_MS } from '../../constants/audio';
import { Send, Mic, Play, CheckCheck, Target, MapPin } from 'lucide-react';

function getCurrentObjective(currentNodeId: string) {
  const nodes = getMergedStoryNodes();
  const node = nodes[currentNodeId];
  const marker = LEONIDA_MARKERS.find((m) => m.nodeId === currentNodeId);

  if (node) {
    const choiceSummary =
      node.choices.length > 0
        ? `Opciones tácticas (${node.choices.length}): ${node.choices.map((c) => c.label).join(' • ')}`
        : node.video.dialogueSubtitle || marker?.description || 'Avanza en la escena cinemática actual.';

    return {
      title: `${node.actTitle ? node.actTitle + ' — ' : ''}${node.chapterTitle}`.toUpperCase(),
      objective: marker?.description || node.phoneNotification?.message || choiceSummary,
      location: node.location || marker?.district || 'ESTADO DE LEONIDA',
      character: marker?.characterName || node.video.speaker || node.phoneNotification?.sender || 'Lucia & Jason',
      reward: marker?.reward || (node.isEnding ? `Desenlace: ${node.endingType || 'Historia'}` : 'Respeto & Dinero')
    };
  }

  return {
    title: 'MISIÓN EN CURSO: CONQUISTAR LEONIDA',
    objective: 'Sigue los eventos de la historia, consulta las opciones en pantalla y mantén comunicación con tu equipo.',
    location: 'ESTADO DE LEONIDA',
    character: 'Lucia & Jason',
    reward: 'Respeto & Dinero'
  };
}

export const SignalApp: React.FC = () => {
  const { signalMessages, sendSignalMessage, sendInteractiveReply, currentNodeId } = useGameStore();
  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const currentObj = getCurrentObjective(currentNodeId);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const voiceTimeoutRef = useRef<number | null>(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [signalMessages.length]);

  // Clean up audio timeout on unmount
  useEffect(() => {
    return () => {
      if (voiceTimeoutRef.current !== null) {
        window.clearTimeout(voiceTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendSignalMessage(inputText.trim());
    setInputText('');
  };

  const playVoiceNote = (msgId: string) => {
    setIsPlayingAudio(msgId);
    audioEngine.playNotification();

    if (voiceTimeoutRef.current !== null) {
      window.clearTimeout(voiceTimeoutRef.current);
    }

    voiceTimeoutRef.current = window.setTimeout(() => {
      setIsPlayingAudio(null);
      voiceTimeoutRef.current = null;
    }, VOICE_NOTE_PLAYBACK_MS);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
      {/* 1. TOP MISSION OBJECTIVE BANNER (Guía clara de la historia) */}
      <div className="bg-gradient-to-r from-pink-950/70 via-zinc-900 to-cyan-950/70 border-b border-zinc-800 p-3 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-pink-300 tracking-wider uppercase">
              OBJETIVO ACTUAL
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />
            {currentObj.location}
          </span>
        </div>
        <h4 className="text-xs font-bold text-white mb-0.5">{currentObj.title}</h4>
        <p className="text-[11px] text-zinc-300 leading-snug">{currentObj.objective}</p>
      </div>

      {/* 2. MESSAGES FEED */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800">
        {signalMessages.map((msg) => {
          const isImageUrl = msg.avatar && (msg.avatar.startsWith('/') || msg.avatar.includes('.'));
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isIncoming ? 'items-start' : 'items-end'}`}
            >
              {msg.isIncoming && msg.senderName && (
                <div className="flex items-center space-x-1.5 mb-1 pl-1">
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                    {isImageUrl ? (
                      <img src={msg.avatar} alt={msg.senderName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px]">{msg.avatar}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{msg.senderName}</span>
                </div>
              )}
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm ${
                  msg.isIncoming
                    ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-md'
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-tr-none shadow-md'
                }`}
              >
                {msg.isAudio ? (
                  <div className="flex items-center space-x-3 py-1">
                    <button
                      onClick={() => playVoiceNote(msg.id)}
                      className="p-2 bg-pink-500 rounded-full hover:bg-pink-400 text-white active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                    <div>
                      <div className="flex items-center space-x-1">
                        {[12, 24, 16, 28, 8, 20, 14, 22].map((h, idx) => (
                          <span
                            key={idx}
                            className={`w-1 rounded-full ${
                              isPlayingAudio === msg.id ? 'bg-cyan-400 animate-pulse' : 'bg-zinc-600'
                            }`}
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 mt-1 block">
                        {msg.audioDuration || '0:04'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}

                <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] font-mono text-zinc-400">
                  <span>{msg.timestamp}</span>
                  <CheckCheck className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. INTERACTIVE CONTEXTUAL QUICK REPLIES */}
      <div className="px-2 pt-2 bg-zinc-900/95 border-t border-zinc-800/80 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => sendInteractiveReply('lucia', 'Lucia, confío en ti. Estamos listos para el próximo movimiento.', 0)}
          className="px-2.5 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 border border-pink-900/50 text-[10px] font-mono text-pink-300 whitespace-nowrap transition-colors cursor-pointer shrink-0"
        >
          💬 "Lucia, confío en ti" (+Lealtad)
        </button>
        <button
          type="button"
          onClick={() => sendInteractiveReply('brian', 'Brian, voy al taller de los Cayos a revisar el encargo.', 2500)}
          className="px-2.5 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 border border-cyan-900/50 text-[10px] font-mono text-cyan-300 whitespace-nowrap transition-colors cursor-pointer shrink-0"
        >
          💬 "Brian, voy al taller" (+$2.5k)
        </button>
      </div>

      {/* 4. INPUT BAR */}
      <form onSubmit={handleSend} className="p-2 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2">
        <button
          type="button"
          onClick={() => sendSignalMessage('¡Entendido! Todo bajo control.')}
          className="p-2 text-zinc-400 hover:text-pink-400 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Respuesta Rápida"
        >
          <Mic className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribir mensaje cifrado..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-gradient-to-r from-pink-600 to-cyan-500 disabled:opacity-40 text-white rounded-full active:scale-95 transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
