/**
 * Profit Center eligible account types.
 *
 * Only these account types may be tagged with a `profit_center_id`:
 *   - Expense
 *   - Cost of Sales
 *   - Income  (Revenue)
 *
 * All other types (Asset, Liability, Equity, Bank …) must NOT carry
 * a profit center reference.
 */
export const PROFIT_CENTER_ELIGIBLE_TYPES: ReadonlySet<string> = new Set([
    'Expense',
    'Cost of Sales',
    'Income',
]);

/** Returns `true` when the given account type may carry a profit center. */
export function isProfitCenterEligible(accountType: string | undefined | null): boolean {
    if (!accountType) return false;
    return PROFIT_CENTER_ELIGIBLE_TYPES.has(accountType);
}
