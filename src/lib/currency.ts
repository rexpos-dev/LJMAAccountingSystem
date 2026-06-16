import { prisma } from '@/lib/prisma';

/**
 * Convert an amount from one currency to PHP (base currency).
 * Uses the most recent exchange rate on or before the given date.
 */
export async function toBaseCurrency(amount: number, currencyCode: string, asOf?: Date): Promise<number> {
    if (currencyCode === 'PHP') return amount;

    const date = asOf ?? new Date();
    const currency = await prisma.currency.findUnique({ where: { code: currencyCode } });
    if (!currency) throw new Error(`Currency not found: ${currencyCode}`);

    const rate = await prisma.exchangeRate.findFirst({
        where: { currencyId: currency.id, rateDate: { lte: date } },
        orderBy: { rateDate: 'desc' },
    });

    if (!rate) throw new Error(`No exchange rate found for ${currencyCode} on or before ${date.toISOString().slice(0, 10)}`);
    return parseFloat((amount * rate.rateToBase).toFixed(4));
}

/**
 * Convert PHP to a foreign currency.
 */
export async function fromBaseCurrency(amountPHP: number, currencyCode: string, asOf?: Date): Promise<number> {
    if (currencyCode === 'PHP') return amountPHP;

    const date = asOf ?? new Date();
    const currency = await prisma.currency.findUnique({ where: { code: currencyCode } });
    if (!currency) throw new Error(`Currency not found: ${currencyCode}`);

    const rate = await prisma.exchangeRate.findFirst({
        where: { currencyId: currency.id, rateDate: { lte: date } },
        orderBy: { rateDate: 'desc' },
    });

    if (!rate) throw new Error(`No exchange rate found for ${currencyCode}`);
    return parseFloat((amountPHP / rate.rateToBase).toFixed(4));
}

/**
 * Compute unrealized forex gain/loss.
 * originalRate = rate at transaction date
 * currentRate  = today's rate
 */
export function forexGainLoss(amountForeign: number, originalRate: number, currentRate: number): number {
    const originalPHP = amountForeign * originalRate;
    const currentPHP = amountForeign * currentRate;
    return parseFloat((currentPHP - originalPHP).toFixed(2));
}
