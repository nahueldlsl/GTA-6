// ============================================================================
// 🌴 VICE-OS: HEIST PLANNER APP ("THE NEON VAULT") — INTERACTIVE TACTICAL BOARD
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { HEIST_CREW_MEMBERS } from '../../data/storyGraph';
import { formatCurrency } from '../../utils/formatCurrency';
import { audioEngine } from '../../engine/audioEngine';
import type { CharacterId, HeistSession } from '../../types/game';
import { Users, Target, Shield, CheckCircle, Sparkles } from 'lucide-react';

export const HeistPlannerApp: React.FC = () => {
  const { crewLoyalty, configureHeist, activeHeist, showToast } = useGameStore();

  const [approach, setApproach] = useState<'STEALTH_CYBER' | 'HEAVY_ASSAULT'>(
    activeHeist?.approach || 'STEALTH_CYBER'
  );
  const [selectedCrew, setSelectedCrew] = useState<Record<'hacker' | 'driver' | 'gunman', CharacterId>>({
    hacker: activeHeist?.selectedCrew?.hacker || 'lucia',
    driver: activeHeist?.selectedCrew?.driver || 'cal',
    gunman: activeHeist?.selectedCrew?.gunman || 'drequan'
  });
  const [justSaved, setJustSaved] = useState(false);

  // Compute cuts & success chance dynamically from actual selected crew members
  const chosenMembers = (['hacker', 'driver', 'gunman'] as const)
    .map((role) => HEIST_CREW_MEMBERS.find((m) => m.id === selectedCrew[role]))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const totalCrewCut = chosenMembers.reduce((sum, m) => sum + m.demandedCut, 0);
  const playerCut = Math.max(10, 100 - totalCrewCut);
  const potentialLoot = 50000000;
  const playerExpectedCash = (potentialLoot * playerCut) / 100;

  const avgSkill =
    chosenMembers.reduce((sum, m) => sum + m.skill, 0) / Math.max(1, chosenMembers.length);
  const avgLoyalty =
    chosenMembers.reduce((sum, m) => sum + (crewLoyalty[m.id] ?? 50), 0) /
    Math.max(1, chosenMembers.length);
  const successProbability = Math.min(99, Math.round(avgSkill * 0.65 + avgLoyalty * 0.35));

  const handleAssignMember = (memberId: CharacterId, role: 'Hacker' | 'Driver' | 'Gunman') => {
    audioEngine.playClick();
    const roleKey = role.toLowerCase() as 'hacker' | 'driver' | 'gunman';
    setSelectedCrew((prev) => ({
      ...prev,
      [roleKey]: memberId
    }));
    setJustSaved(false);
  };

  const handleSavePlan = () => {
    audioEngine.playDecisionImpact();
    const session: HeistSession = {
      id: 'heist_neon_vault_01',
      title: 'The Neon Vault Heist',
      targetName: 'Banco Central de Sunport',
      estimatedLoot: potentialLoot,
      approach,
      selectedCrew,
      playerCut,
      riskFactor: approach === 'STEALTH_CYBER' ? 'MEDIUM' : 'HIGH'
    };
    configureHeist(session);
    setJustSaved(true);
    showToast(
      'PLAN DE ATRACO CONFIRMADO',
      `Enfoque ${approach === 'STEALTH_CYBER' ? 'Ghost Protocol' : 'Heavy Metal'} • Tu corte: ${formatCurrency(playerExpectedCash)} (${successProbability}% éxito)`,
      'success'
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white p-3 space-y-3 overflow-y-auto select-none scrollbar-thin scrollbar-thumb-zinc-800">
      {/* Target Briefing */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-cyan-500/40 p-3 rounded-xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
              <Target className="w-3 h-3" /> OBJETIVO PRINCIPAL
            </span>
            <h3 className="text-sm sm:text-base font-black text-white mt-0.5 uppercase tracking-wide">
              The Neon Vault
            </h3>
            <span className="text-[10px] text-zinc-400">Banco Central & Servidores Fríos</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400">Botín Estimado</span>
            <div className="text-sm font-bold text-emerald-400 font-mono">$50,000,000</div>
            <span className="text-[9px] font-mono text-cyan-300">Éxito est.: {successProbability}%</span>
          </div>
        </div>
      </div>

      {/* Approach Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-pink-400" /> Selección de Enfoque Táctico
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              audioEngine.playClick();
              setApproach('STEALTH_CYBER');
              setJustSaved(false);
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              approach === 'STEALTH_CYBER'
                ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>🕶️ Ghost Protocol</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 leading-snug">
              Bypass biométrico, corte de energía y escape silencioso.
            </p>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setApproach('HEAVY_ASSAULT');
              setJustSaved(false);
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              approach === 'HEAVY_ASSAULT'
                ? 'bg-pink-950/50 border-pink-500 text-white shadow-[0_0_15px_rgba(255,0,128,0.2)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>💣 Heavy Metal</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 leading-snug">
              Camión blindado, PEM, asalto frontal y combate directo.
            </p>
          </button>
        </div>
      </div>

      {/* Crew Assignment (Interactive selection per role) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-yellow-400" /> Tripulación (Clic para asignar rol)
          </label>
          <span className="text-[9px] font-mono text-zinc-400">3 roles activos</span>
        </div>

        <div className="space-y-2">
          {HEIST_CREW_MEMBERS.map((member) => {
            const loyalty = crewLoyalty[member.id] ?? 50;
            const roleKey = member.role.toLowerCase() as 'hacker' | 'driver' | 'gunman';
            const isAssigned = selectedCrew[roleKey] === member.id;
            const isImageUrl = member.avatar.startsWith('/') || member.avatar.includes('.');

            return (
              <div
                key={member.id}
                onClick={() => handleAssignMember(member.id, member.role)}
                className={`p-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer border ${
                  isAssigned
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg border border-zinc-700 overflow-hidden shrink-0">
                    {isImageUrl ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      member.avatar
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-zinc-100">{member.name}</span>
                      <span className="text-[9px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-400 border border-zinc-700">
                        {member.role}
                      </span>
                      {isAssigned && (
                        <span className="text-[8px] font-mono bg-emerald-500 text-black font-black px-1.5 py-0.2 rounded uppercase">
                          ASIGNADO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 mt-0.5">
                      <span>
                        Lealtad: <span className="text-pink-400 font-bold">{loyalty}%</span>
                      </span>
                      <span>
                        Habilidad: <span className="text-cyan-400 font-bold">{member.skill}%</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {member.demandedCut}%
                  </span>
                  <span className="text-[9px] block text-zinc-500">Corte</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout Summary */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-xs space-y-1.5 font-mono">
        <div className="flex justify-between text-zinc-400">
          <span>Comisión Total Tripulación:</span>
          <span className="text-red-400">
            {totalCrewCut}% (-{formatCurrency((potentialLoot * totalCrewCut) / 100)})
          </span>
        </div>
        <div className="flex justify-between text-zinc-400">
          <span>Probabilidad Táctica de Éxito:</span>
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {successProbability}%
          </span>
        </div>
        <div className="flex justify-between text-white font-bold pt-1 border-t border-zinc-800">
          <span>Tu Corte Neto ({playerCut}%):</span>
          <span className="text-emerald-400 font-bold">+{formatCurrency(playerExpectedCash)}</span>
        </div>
      </div>

      {/* Lock in Plan Button */}
      <button
        onClick={handleSavePlan}
        className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
          justSaved
            ? 'bg-emerald-500 text-black'
            : 'bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white'
        }`}
      >
        <CheckCircle className="w-4 h-4" />
        <span>{justSaved ? 'Plan de Atraco Confirmado ✓' : 'Bloquear Plan de Atraco'}</span>
      </button>
    </div>
  );
};
