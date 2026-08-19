// ============================================================================
// 🌴 FINANCES & SYNDICATE RESPECT METERS DISPLAY
// ============================================================================

import React from 'react';
import { Award } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface FinancesDisplayProps {
  cleanCash: number;
  dirtyCash: number;
  respect: number;
}

export const FinancesDisplay: React.FC<FinancesDisplayProps> = ({
  cleanCash,
  dirtyCash,
  respect
}) => {
  return (
    <div className="flex items-center space-x-2 shrink-0 select-none">
      {/* Clean Cash */}
      <div className="bg-zinc-900/90 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shadow-sm">
        <span className="text-[10px] font-mono font-bold text-emerald-400">💵</span>
        <span className="text-xs sm:text-sm font-mono font-black text-emerald-300">
          {formatCurrency(cleanCash)}
        </span>
      </div>

      {/* Dirty Cash */}
      <div className="bg-zinc-900/90 border border-amber-500/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shadow-sm">
        <span className="text-[10px] font-mono font-bold text-amber-400">🔥</span>
        <span className="text-xs sm:text-sm font-mono font-black text-amber-300">
          {formatCurrency(dirtyCash)}
        </span>
      </div>

      {/* Syndicate Respect */}
      <div className="hidden md:flex items-center space-x-1.5 bg-zinc-900/80 border border-cyan-500/30 px-2.5 py-1 rounded-lg text-xs font-mono text-cyan-300">
        <Award className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-bold">{respect}%</span>
        <div className="w-12 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-cyan-400 h-full" style={{ width: `${respect}%` }} />
        </div>
      </div>
    </div>
  );
};
