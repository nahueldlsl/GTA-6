// ============================================================================
// 🌴 VICE DYNASTY - EFFECT PROCESSOR SERVICE
// ============================================================================

import type { GameState, StateEffect, CharacterId, HeatLevel } from '../types/game';

export interface EffectResult {
  cleanCash: number;
  dirtyCash: number;
  heatLevel: HeatLevel;
  respect: number;
  crewLoyalty: Record<CharacterId, number>;
  flags: Record<string, boolean | number | string>;
  inventory: string[];
  audioTriggers: Array<'cashRegister' | 'heatChange'>;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function clampHeat(val: number): HeatLevel {
  return clamp(val, 0, 5) as HeatLevel;
}

export function processEffects(state: GameState, effects: StateEffect[]): EffectResult {
  let cleanCash = state.cleanCash;
  let dirtyCash = state.dirtyCash;
  let heatLevel = state.heatLevel;
  let respect = state.respect;
  const crewLoyalty = { ...state.crewLoyalty };
  const flags = { ...state.flags };
  const inventory = [...state.inventory];
  const audioTriggers: EffectResult['audioTriggers'] = [];

  for (const eff of effects) {
    switch (eff.action) {
      case 'ADD_CLEAN_CASH':
        cleanCash = Math.max(0, cleanCash + Math.floor(Number(eff.value)));
        audioTriggers.push('cashRegister');
        break;

      case 'ADD_DIRTY_CASH':
        dirtyCash = Math.max(0, dirtyCash + Math.floor(Number(eff.value)));
        audioTriggers.push('cashRegister');
        break;

      case 'WASH_CASH': {
        const amt = Math.floor(Number(eff.value));
        if (dirtyCash >= amt && amt > 0) {
          dirtyCash -= amt;
          cleanCash += amt;
          audioTriggers.push('cashRegister');
        }
        break;
      }

      case 'SET_HEAT':
        heatLevel = clampHeat(Number(eff.value));
        audioTriggers.push('heatChange');
        break;

      case 'ADD_HEAT':
        heatLevel = clampHeat(heatLevel + Number(eff.value));
        audioTriggers.push('heatChange');
        break;

      case 'SUB_HEAT':
      case 'REMOVE_HEAT':
        heatLevel = clampHeat(heatLevel - Number(eff.value));
        audioTriggers.push('heatChange');
        break;

      case 'ADD_RESPECT':
        respect = clamp(respect + Number(eff.value), 0, 100);
        break;

      case 'SET_LOYALTY':
        if (eff.target) {
          crewLoyalty[eff.target as CharacterId] = clamp(Number(eff.value), 0, 100);
        }
        break;

      case 'ADD_LOYALTY':
        if (eff.target) {
          const key = eff.target as CharacterId;
          crewLoyalty[key] = clamp((crewLoyalty[key] || 50) + Number(eff.value), 0, 100);
        }
        break;

      case 'SET_FLAG':
        flags[eff.target || 'generic'] = eff.value;
        break;

      case 'ADD_INVENTORY':
        if (!inventory.includes(String(eff.value))) {
          inventory.push(String(eff.value));
        }
        break;

      case 'REMOVE_INVENTORY': {
        const idx = inventory.indexOf(String(eff.value));
        if (idx !== -1) {
          inventory.splice(idx, 1);
        }
        break;
      }

      case 'TRIGGER_PHONE_NOTIFICATION':
        // Handled at store/node level
        break;
    }
  }

  return {
    cleanCash,
    dirtyCash,
    heatLevel,
    respect,
    crewLoyalty,
    flags,
    inventory,
    audioTriggers
  };
}
