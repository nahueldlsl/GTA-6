// ============================================================================
// 🌴 VICE-OS: DARKPAY CRYPTO WALLET & MONEY LAUNDERING APP
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useGameStore, PROTAGONIST_PERKS } from '../../store/gameStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { RECEIPT_DISMISS_DELAY_MS } from '../../constants/audio';
import { ShieldCheck, ArrowRightLeft, Flame, CheckCircle } from 'lucide-react';

export const DarkPayApp: React.FC = () => {
  const { cleanCash, dirtyCash, washMoney, heatLevel, buyBlackMarketItem, bribePolice, inventory, activeProtagonist } = useGameStore();

  const [activeTab, setActiveTab] = useState<'WASH' | 'MARKET'>('WASH');
  const [washAmount, setWashAmount] = useState<number>(Math.min(50000, dirtyCash));
  const [selectedMethod, setSelectedMethod] = useState<'club' | 'carwash' | 'mixer'>('club');
  const [lastReceipt, setLastReceipt] = useState<{ amount: number; cleanGained: number } | null>(null);
  const [marketMessage, setMarketMessage] = useState<string | null>(null);

  const receiptTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (receiptTimeoutRef.current !== null) {
        window.clearTimeout(receiptTimeoutRef.current);
      }
    };
  }, []);

  // Keep wash amount bounded if dirtyCash decreases externally
  useEffect(() => {
    setWashAmount((prev) => Math.min(prev, dirtyCash));
  }, [dirtyCash]);

  const methods = {
    club: {
      name: 'Club Nocturno "Neon Palms"',
      type: 'Empresa Pantalla / Ocio',
      fee: 15,
      icon: '🍸',
      minRespect: 10
    },
    carwash: {
      name: 'Sunport Auto Spa & Tuning',
      type: 'Negocio en Efectivo',
      fee: 20,
      icon: '🏎️',
      minRespect: 0
    },
    mixer: {
      name: 'Tornado DarkPool Mixer',
      type: 'Contrato Inteligente P2P',
      fee: 8,
      icon: '⚡',
      minRespect: 40
    }
  };

  const BLACK_MARKET_ITEMS = [
    {
      id: 'body_armor_tactical',
      name: 'Chaleco Blindado de Kevlar',
      desc: 'Absorbe hasta 2 choques policiales en el mapa 2D sin subir búsqueda.',
      perk: '🛡️ Escudo de Impacto Activo en Conducción',
      price: 15000,
      icon: '🛡️'
    },
    {
      id: 'c4_breach_charges',
      name: 'Cargas de Demolición C4',
      desc: 'Vuela la puerta de la bóveda del First National en el Acto V desbloqueando la salida rápida.',
      perk: '💣 Atajo Táctico de $3M en el Asalto al Banco',
      price: 25000,
      icon: '💣'
    },
    {
      id: 'tuned_muscle_car',
      name: 'Muscle Car V8 Modificado',
      desc: '+22% velocidad máxima, 2x recarga de nitro y luces de neón bajo el chasis.',
      perk: '⚡ Mejora Permanente del Vehículo en Leonida 2D',
      price: 45000,
      icon: '🏎️'
    }
  ];

  const currentMethod = methods[selectedMethod];
  const feeMultiplier = PROTAGONIST_PERKS[activeProtagonist].washFeeMultiplier;
  const effectiveFeePct = currentMethod.fee * feeMultiplier;
  const calculatedFee = Math.floor((washAmount * effectiveFeePct) / 100);
  const calculatedClean = Math.max(0, washAmount - calculatedFee);

  const handleWash = () => {
    if (washAmount <= 0 || dirtyCash < washAmount) return;
    const result = washMoney(washAmount, currentMethod.fee);
    if (result.success) {
      setLastReceipt({
        amount: washAmount,
        cleanGained: result.washedClean
      });

      if (receiptTimeoutRef.current !== null) {
        window.clearTimeout(receiptTimeoutRef.current);
      }

      receiptTimeoutRef.current = window.setTimeout(() => {
        setLastReceipt(null);
        receiptTimeoutRef.current = null;
      }, RECEIPT_DISMISS_DELAY_MS);

      setWashAmount(0);
    }
  };

  const handleBuy = (item: typeof BLACK_MARKET_ITEMS[0]) => {
    const res = buyBlackMarketItem(item.id, item.name, item.price);
    setMarketMessage(res.message);
    setTimeout(() => setMarketMessage(null), 4000);
  };

  const handleBribe = () => {
    const res = bribePolice(35000);
    setMarketMessage(res.message);
    setTimeout(() => setMarketMessage(null), 4000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white p-3 space-y-3 overflow-y-auto select-none scrollbar-thin scrollbar-thumb-zinc-800">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-zinc-900/90 border border-emerald-500/40 p-2.5 rounded-xl shadow-md">
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3 h-3" /> DINERO LIMPIO
          </span>
          <h3 className="text-sm sm:text-base font-black text-white mt-1 font-mono">
            {formatCurrency(cleanCash)}
          </h3>
        </div>

        <div className="bg-zinc-900/90 border border-amber-500/40 p-2.5 rounded-xl shadow-md">
          <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-bold">
            <Flame className="w-3 h-3 text-red-500" /> DINERO SUCIO
          </span>
          <h3 className="text-sm sm:text-base font-black text-amber-400 mt-1 font-mono">
            {formatCurrency(dirtyCash)}
          </h3>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('WASH')}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'WASH'
              ? 'bg-gradient-to-r from-pink-600 to-cyan-500 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🔄 Blanqueo
        </button>
        <button
          onClick={() => setActiveTab('MARKET')}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'MARKET'
              ? 'bg-gradient-to-r from-pink-600 to-cyan-500 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🛒 Mercado Negro & Sobornos
        </button>
      </div>

      {marketMessage && (
        <div className="bg-cyan-950/80 border border-cyan-500/60 p-2.5 rounded-xl text-xs font-mono text-cyan-200 animate-fadeIn">
          {marketMessage}
        </div>
      )}

      {activeTab === 'WASH' ? (
        /* Laundering Interface */
        <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase font-mono">
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" /> Lavado de Efectivo
            </h4>
            <span className="text-[10px] font-mono text-zinc-400">Comisión: {currentMethod.fee}%</span>
          </div>

          {/* Method Selector */}
          <div className="grid grid-cols-3 gap-1.5">
            {(Object.keys(methods) as Array<keyof typeof methods>).map((key) => {
              const m = methods[key];
              const isSelected = selectedMethod === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMethod(key)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-pink-950/40 border-pink-500 text-white shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <div className="text-base">{m.icon}</div>
                  <div className="text-[10px] font-bold truncate mt-1">{m.name.split('"')[1] || m.name.split(' ')[0]}</div>
                  <div className="text-[9px] font-mono text-zinc-400">-{m.fee}% Fee</div>
                </button>
              );
            })}
          </div>

          {/* Slider Amount */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Monto a Lavar:</span>
              <span className="text-amber-400 font-bold">{formatCurrency(washAmount)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={dirtyCash}
              step="5000"
              value={washAmount}
              onChange={(e) => setWashAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>$0</span>
              <button
                onClick={() => setWashAmount(dirtyCash)}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                MÁX ({formatCurrency(dirtyCash)})
              </button>
            </div>
          </div>

          {/* Preview Calculation */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-2.5 rounded-lg text-xs space-y-1 font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Comisión retenida:</span>
              <span className="text-red-400">-{formatCurrency(calculatedFee)}</span>
            </div>
            <div className="flex justify-between text-zinc-200 font-bold pt-1 border-t border-zinc-800">
              <span>Total Limpio a Recibir:</span>
              <span className="text-emerald-400">+{formatCurrency(calculatedClean)}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleWash}
            disabled={washAmount <= 0 || dirtyCash < washAmount}
            className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 disabled:opacity-30 text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
          >
            Ejecutar Lavado en {currentMethod.name.split(' ')[0]}
          </button>
        </div>
      ) : (
        /* Black Market & Bribery Interface */
        <div className="space-y-3">
          {/* Police Bribe Card */}
          <div className="bg-red-950/30 border border-red-500/50 p-3 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-red-300 uppercase font-mono">
                <span>🚨 Soborno a la Leonida PD</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {heatLevel > 0 ? `Búsqueda: ${heatLevel} ★` : 'Limpio'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Paga al contacto corrupto de Raul Bautista para borrar tu historial y eliminar todas las estrellas de búsqueda.
            </p>
            <button
              onClick={handleBribe}
              disabled={heatLevel === 0}
              className={`w-full py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                heatLevel > 0
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {heatLevel > 0 ? 'Pagar Soborno ($35,000)' : 'Sin Nivel de Búsqueda Activo'}
            </button>
          </div>

          {/* Black Market Items List */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
              Equipamiento Ilegal & Vehículos:
            </span>
            {BLACK_MARKET_ITEMS.map((item) => {
              const alreadyOwned = inventory.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-xl flex items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-xl">{item.icon}</span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                        {alreadyOwned && (
                          <span className="text-[8px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40 uppercase">
                            Equipado
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate block">
                        {item.desc}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-300 block mt-0.5 font-bold">
                        {item.perk}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuy(item)}
                    disabled={alreadyOwned}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 transition-all cursor-pointer ${
                      alreadyOwned
                        ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-pink-600 to-cyan-500 text-white hover:from-pink-500 hover:to-cyan-400'
                    }`}
                  >
                    {alreadyOwned ? '✓ En Posesión' : `$${item.price.toLocaleString()}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success Notification */}
      {lastReceipt && (
        <div className="bg-emerald-950/80 border border-emerald-500/60 p-3 rounded-xl flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-white block">¡Transferencia Exitosa!</span>
            <span className="text-emerald-300 text-[11px]">
              Se acreditaron +{formatCurrency(lastReceipt.cleanGained)} en tu cuenta limpia.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
