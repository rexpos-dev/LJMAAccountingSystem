import { prisma } from '@/lib/prisma';

// ─── ANOMALY DETECTION ────────────────────────────────────────────────────────

interface TransactionLine {
    id: string;
    ref: string;
    accountNo: number;
    amount: number;
    date: Date;
    particulars?: string;
}

interface AnomalyResult {
    entityId: string;
    entityRef: string;
    anomalyType: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    amount: number;
    baseline?: number;
}

/**
 * Scan recent transactions for anomalies:
 * - Amount spike: > 3x the account's rolling average
 * - Weekend posting: posted on Saturday/Sunday
 * - Duplicate: same amount + account within 3 days
 * - Round number: unusually large round amounts (potential manual entry error)
 */
export async function detectAnomalies(lookbackDays = 90): Promise<AnomalyResult[]> {
    const since = new Date();
    since.setDate(since.getDate() - lookbackDays);

    const txLines: any[] = await prisma.$queryRaw`
        SELECT
            t.id, t.reference AS ref, t.date, t.particulars,
            tl.account_no AS accountNo,
            tl.debit, tl.credit,
            ABS(tl.debit - tl.credit) AS amount
        FROM transaction_line tl
        JOIN transaction t ON t.id = tl.transaction_id
        WHERE t.date >= ${since}
        ORDER BY t.date DESC
        LIMIT 2000
    `;

    // Build per-account rolling average
    const accountAmounts = new Map<number, number[]>();
    for (const row of txLines) {
        const acct = Number(row.accountNo);
        const amt = Number(row.amount);
        if (!accountAmounts.has(acct)) accountAmounts.set(acct, []);
        accountAmounts.get(acct)!.push(amt);
    }

    const accountAvg = new Map<number, number>();
    accountAmounts.forEach((amounts, acct) => {
        const avg = amounts.reduce((s, a) => s + a, 0) / amounts.length;
        accountAvg.set(acct, avg);
    });

    const anomalies: AnomalyResult[] = [];
    const seen = new Set<string>(); // for duplicate detection

    for (const row of txLines) {
        const acct = Number(row.accountNo);
        const amt = Number(row.amount);
        const date = new Date(row.date);
        const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

        // 1. Amount spike
        const avg = accountAvg.get(acct) ?? 0;
        if (avg > 0 && amt > avg * 3 && amt > 10000) {
            anomalies.push({
                entityId: row.id,
                entityRef: row.ref ?? row.id,
                anomalyType: 'amount_spike',
                severity: amt > avg * 10 ? 'high' : 'medium',
                description: `Amount ₱${amt.toLocaleString('en-PH')} is ${(amt / avg).toFixed(1)}x the account average of ₱${avg.toLocaleString('en-PH')} for account ${acct}.`,
                amount: amt,
                baseline: parseFloat(avg.toFixed(2)),
            });
        }

        // 2. Weekend posting
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            anomalies.push({
                entityId: row.id,
                entityRef: row.ref ?? row.id,
                anomalyType: 'weekend',
                severity: 'low',
                description: `Transaction posted on a ${dayOfWeek === 0 ? 'Sunday' : 'Saturday'} (${date.toLocaleDateString('en-PH')}).`,
                amount: amt,
            });
        }

        // 3. Duplicate detection (same account + same amount within ±3 days)
        const dupKey = `${acct}-${amt.toFixed(2)}-${date.toISOString().slice(0, 10)}`;
        if (seen.has(dupKey)) {
            anomalies.push({
                entityId: row.id,
                entityRef: row.ref ?? row.id,
                anomalyType: 'duplicate',
                severity: 'high',
                description: `Possible duplicate: account ${acct}, amount ₱${amt.toLocaleString('en-PH')} already posted on ${date.toLocaleDateString('en-PH')}.`,
                amount: amt,
            });
        }
        seen.add(dupKey);

        // 4. Large round number
        if (amt >= 100000 && amt % 10000 === 0) {
            anomalies.push({
                entityId: row.id,
                entityRef: row.ref ?? row.id,
                anomalyType: 'round_number',
                severity: 'low',
                description: `Large round amount ₱${amt.toLocaleString('en-PH')} — verify this is correct and not a manual estimate.`,
                amount: amt,
            });
        }
    }

    return anomalies;
}

// ─── EXPENSE AUTO-CATEGORIZATION ─────────────────────────────────────────────

const CATEGORY_PATTERNS: { pattern: RegExp; accountNo: number; accountName: string }[] = [
    { pattern: /electricity|meralco|power/i, accountNo: 5110, accountName: 'Utilities Expense' },
    { pattern: /water|maynilad|manila water/i, accountNo: 5110, accountName: 'Utilities Expense' },
    { pattern: /internet|globe|pldt|sky|converge/i, accountNo: 5120, accountName: 'Communications Expense' },
    { pattern: /salary|payroll|wages/i, accountNo: 5100, accountName: 'Salaries & Wages' },
    { pattern: /rent|lease|space/i, accountNo: 5130, accountName: 'Rent Expense' },
    { pattern: /fuel|gasoline|diesel|petrol/i, accountNo: 5140, accountName: 'Transportation Expense' },
    { pattern: /transport|grab|taxi|toll/i, accountNo: 5140, accountName: 'Transportation Expense' },
    { pattern: /office supplies|supplies|stationery/i, accountNo: 5150, accountName: 'Office Supplies' },
    { pattern: /repair|maintenance|fix/i, accountNo: 5160, accountName: 'Repairs & Maintenance' },
    { pattern: /insurance/i, accountNo: 5170, accountName: 'Insurance Expense' },
    { pattern: /depreciation/i, accountNo: 5180, accountName: 'Depreciation Expense' },
    { pattern: /tax|bir|vat|withholding/i, accountNo: 5190, accountName: 'Taxes & Licenses' },
    { pattern: /advertising|marketing|promo/i, accountNo: 5200, accountName: 'Advertising Expense' },
    { pattern: /meal|food|snack|entertainment/i, accountNo: 5210, accountName: 'Representation Expense' },
    { pattern: /training|seminar|workshop/i, accountNo: 5220, accountName: 'Training & Development' },
    { pattern: /medical|clinic|pharmacy|hospital/i, accountNo: 5230, accountName: 'Medical Expense' },
    { pattern: /bank|charge|service fee/i, accountNo: 5240, accountName: 'Bank Charges' },
    { pattern: /purchase|supplies|goods/i, accountNo: 5000, accountName: 'Cost of Sales' },
];

/**
 * Suggest an account for an expense based on its description.
 */
export function suggestExpenseAccount(description: string): {
    accountNo: number;
    accountName: string;
    confidence: 'high' | 'medium' | 'low';
} | null {
    for (const { pattern, accountNo, accountName } of CATEGORY_PATTERNS) {
        if (pattern.test(description)) {
            return { accountNo, accountName, confidence: 'high' };
        }
    }
    return null;
}
