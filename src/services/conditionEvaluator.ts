// ============================================================================
// 🌴 VICE DYNASTY - STATE CONDITION EVALUATION ENGINE
// ============================================================================

import type { GameState, StateCondition } from '../types/game';

/**
 * Evaluates whether a story choice's condition is satisfied by the current game state.
 * Returns { passed: boolean, reason?: string }
 */
export function evaluateCondition(state: GameState, condition: StateCondition): { passed: boolean; reason?: string } {
  const { field, operator, value, key, failMessage } = condition;
  let actual: unknown;

  if (field === 'inventory') {
    const hasItem = state.inventory.includes(String(value));
    const passed = operator === 'HAS' ? hasItem : operator === 'NOT_HAS' ? !hasItem : hasItem;
    return {
      passed,
      reason: passed ? undefined : failMessage || `Requiere ítem: ${value}`
    };
  }

  if (field === 'flags' && key) {
    actual = state.flags[key];
  } else if (field === 'crewLoyalty' && key) {
    actual = state.crewLoyalty[key as keyof typeof state.crewLoyalty] ?? 50;
  } else {
    actual = state[field as keyof GameState];
  }

  let passed = false;
  switch (operator) {
    case 'EQ':
      passed = actual === value;
      break;
    case 'NEQ':
      passed = actual !== value;
      break;
    case 'GT':
      passed = Number(actual) > Number(value);
      break;
    case 'GTE':
      passed = Number(actual) >= Number(value);
      break;
    case 'LT':
      passed = Number(actual) < Number(value);
      break;
    case 'LTE':
      passed = Number(actual) <= Number(value);
      break;
    case 'HAS':
      passed = Array.isArray(actual) ? actual.includes(value) : false;
      break;
    case 'NOT_HAS':
      passed = Array.isArray(actual) ? !actual.includes(value) : true;
      break;
    default:
      passed = true;
  }

  return {
    passed,
    reason: passed ? undefined : failMessage || `Requisito no cumplido: ${field} ${operator} ${value}`
  };
}

/**
 * Checks all conditions for a choice. Returns isLocked and first fail reason if any.
 */
export function checkChoiceConditions(
  state: GameState,
  conditions?: StateCondition[]
): { isLocked: boolean; lockHint?: string } {
  if (!conditions || conditions.length === 0) {
    return { isLocked: false };
  }

  for (const cond of conditions) {
    const res = evaluateCondition(state, cond);
    if (!res.passed) {
      return { isLocked: true, lockHint: res.reason };
    }
  }

  return { isLocked: false };
}
