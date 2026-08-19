import React from 'react';
import { Users, Lock } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { CREW_MEMBERS_DISPLAY } from '../../constants/hud';
import { useGameStore } from '../../store/gameStore';

interface CrewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrewModal: React.FC<CrewModalProps> = ({ isOpen, onClose }) => {
  const { crewLoyalty, unlockedCrew } = useGameStore();

  if (!isOpen) return null;

  return (
    <BaseModal
      title="EQUIPO & CONTACTOS EN LEONIDA"
      icon={<Users className="w-4 h-4 text-cyan-400" />}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-3">
        <p className="text-[11px] text-zinc-400 font-mono mb-2">
          Conoce nuevos aliados y miembros del sindicato a medida que progresas en la historia.
        </p>

        {CREW_MEMBERS_DISPLAY.map((member) => {
          const isUnlocked = unlockedCrew.includes(member.id);
          const loyalty = crewLoyalty[member.id] || 50;
          const isImageUrl = member.avatar.startsWith('/') || member.avatar.includes('.');

          if (!isUnlocked) {
            return (
              <div
                key={member.id}
                className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-900 flex items-center justify-between opacity-50 select-none"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-zinc-500">??? (Contacto Bloqueado)</span>
                    <span className="text-[10px] text-zinc-600 block">Se desbloquea en próximos capítulos</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-600">--%</span>
              </div>
            );
          }

          return (
            <div
              key={member.id}
              className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 space-y-1.5 hover:border-cyan-900/60 transition-colors"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 shadow-md">
                    {isImageUrl ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs">{member.avatar}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-zinc-100 block">
                      {member.name}
                    </span>
                    <span className="text-[10px] text-pink-400 font-mono">{member.role}</span>
                  </div>
                </div>
                <span className="font-mono text-cyan-400 font-bold">{loyalty}% Lealtad</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-gradient-to-r from-pink-500 via-orange-500 to-cyan-400 h-full"
                  style={{ width: `${loyalty}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </BaseModal>
  );
};
