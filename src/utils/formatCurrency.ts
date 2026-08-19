// ============================================================================
// 🌴 VICE DYNASTY - CURRENCY FORMATTING UTILITY
// ============================================================================

export function formatCurrency(amount: number): string {
  return `$${Math.floor(amount).toLocaleString()}`;
}
