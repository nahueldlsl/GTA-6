// ============================================================================
// 🌴 HISTORY / TIMELINE MODAL COMPONENT
// ============================================================================

import React from 'react';
import { History } from 'lucide-react';
import { BaseModal } from './BaseModal';
import type { NodeId } from '../../types/game';

interface HistoryStep {
  nodeId: NodeId;
  choiceId?: string;
  timestamp: number;
  title: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryStep[];
  onRewind: (nodeId: NodeId) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onRewind
}) => {
  if (!isOpen) return null;

  return (
    <BaseModal
      title="HISTORIAL DE DECISIONES"
      icon={<History className="w-4 h-4 text-cyan-400" />}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {history.map((step, idx) => (
          <div
            key={idx}
            className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
          >
            <div>
              <span className="text-[10px] font-mono text-cyan-400">PASO #{idx + 1}</span>
              <h5 className="font-bold text-zinc-200">{step.title}</h5>
            </div>
            <button
              onClick={() => {
                onRewind(step.nodeId);
                onClose();
              }}
              className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-1 rounded hover:bg-cyan-900 transition-colors cursor-pointer"
            >
              Rebobinar
            </button>
          </div>
        ))}
      </div>
    </BaseModal>
  );
};
