// ============================================================================
// 🌴 VICE-OS: HEIST PLANNER APP ("THE NEON VAULT")
// ============================================================================

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { HEIST_CREW_MEMBERS } from '../../data/storyGraph';
import type { CharacterId, HeistSession } from '../../types/game';
import { Users, Target, Shield, CheckCircle } from 'lucide-react';

export const HeistPlannerApp: React.FC = () => {
  const { crewLoyalty, configureHeist, activeHeist } = useGameStore();

  const [approach, setApproach] = useState<'STEALTH_CYBER' | 'HEAVY_ASSAULT'>(
    activeHeist?.approach || 'STEALTH_CYBER'
  );
  const [selectedCrew] = useState<Partial<Record<'hacker' | 'driver' | 'gunman', CharacterId>>>({
    hacker: 'lucia',
    driver: 'cal',
    gunman: 'drequan'
  });

  const totalCrewCut =
    (selectedCrew.hacker ? 25 : 0) +
    (selectedCrew.driver ? 20 : 0) +
    (selectedCrew.gunman ? 25 : 0);

  const playerCut = 100 - totalCrewCut;
  const potentialLoot = 50000000;
  const playerExpectedCash = (potentialLoot * playerCut) / 100;

  const handleSavePlan = () => {
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
            onClick={() => setApproach('STEALTH_CYBER')}
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
            onClick={() => setApproach('HEAVY_ASSAULT')}
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

      {/* Crew Assignment */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-yellow-400" /> Tripulación Asignada
        </label>
        <div className="space-y-2">
          {HEIST_CREW_MEMBERS.map((member) => {
            const loyalty = crewLoyalty[member.id] || 50;
            const isImageUrl = member.avatar.startsWith('/') || member.avatar.includes('.');
            return (
              <div
                key={member.id}
                className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl flex items-center justify-between hover:border-zinc-750 transition-colors"
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
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 mt-0.5">
                      <span>Lealtad: <span className="text-pink-400 font-bold">{loyalty}%</span></span>
                      <span>Habilidad: <span className="text-cyan-400 font-bold">{member.skill}%</span></span>
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
          <span className="text-red-400">{totalCrewCut}% (-${((potentialLoot * totalCrewCut) / 100).toLocaleString()})</span>
        </div>
        <div className="flex justify-between text-white font-bold pt-1 border-t border-zinc-800">
          <span>Tu Corte Neto ({playerCut}%):</span>
          <span className="text-emerald-400 font-bold">+${playerExpectedCash.toLocaleString()}</span>
        </div>
      </div>

      {/* Lock in Plan Button */}
      <button
        onClick={handleSavePlan}
        className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <CheckCircle className="w-4 h-4" /> Bloquear Plan de Atraco
      </button>
    </div>
  );
};
