// ============================================================================
// 🌴 REUSABLE BASE MODAL DIALOG COMPONENT
// ============================================================================

import React from 'react';

interface BaseModalProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  title,
  icon,
  onClose,
  maxWidth = 'max-w-sm',
  children
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`bg-zinc-900 border border-zinc-700 p-5 rounded-2xl ${maxWidth} w-full space-y-4 shadow-2xl`}>
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            {icon} {title}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xs font-mono cursor-pointer"
          >
            [CERRAR]
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
