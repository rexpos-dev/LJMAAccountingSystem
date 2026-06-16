/**
 * Depreciation computation helpers.
 * Supports: Straight-Line, Declining Balance (200% DB / double-declining).
 */

export interface DepreciationScheduleEntry {
    year: number;
    month: number;
    depreciationAmt: number;
    bookValue: number;
}

interface AssetData {
    cost: number;
    salvageValue: number;
    usefulLifeYears: number;
    depreciationMethod: string;
    purchaseDate: Date;
}

export function computeSchedule(asset: AssetData): DepreciationScheduleEntry[] {
    const { cost, salvageValue, usefulLifeYears, depreciationMethod, purchaseDate } = asset;
    const depreciableBase = cost - salvageValue;
    const monthlyEntries: DepreciationScheduleEntry[] = [];

    const startYear = purchaseDate.getFullYear();
    const startMonth = purchaseDate.getMonth() + 1; // 1-12
    const totalMonths = usefulLifeYears * 12;

    let bookValue = cost;
    const monthlyRate = depreciationMethod === 'Straight-Line'
        ? depreciableBase / totalMonths
        : null; // DB uses annual rate applied monthly

    const annualDBRate = depreciationMethod !== 'Straight-Line'
        ? (2 / usefulLifeYears) // 200% Declining Balance
        : 0;

    let month = startMonth;
    let year = startYear;

    for (let i = 0; i < totalMonths; i++) {
        let depAmt: number;

        if (depreciationMethod === 'Straight-Line') {
            depAmt = monthlyRate!;
        } else {
            // Monthly DB rate = annual rate / 12, applied to book value
            depAmt = bookValue * (annualDBRate / 12);
            // Switch to straight-line when it gives higher deduction
            const remaining = totalMonths - i;
            const slAmt = (bookValue - salvageValue) / remaining;
            depAmt = Math.max(depAmt, slAmt);
        }

        // Don't depreciate below salvage value
        if (bookValue - depAmt < salvageValue) {
            depAmt = Math.max(bookValue - salvageValue, 0);
        }

        bookValue = parseFloat((bookValue - depAmt).toFixed(4));

        monthlyEntries.push({
            year,
            month,
            depreciationAmt: parseFloat(depAmt.toFixed(4)),
            bookValue,
        });

        month++;
        if (month > 12) { month = 1; year++; }
        if (bookValue <= salvageValue) break;
    }

    return monthlyEntries;
}

export function currentBookValue(asset: AssetData, asOf: Date): number {
    const schedule = computeSchedule(asset);
    const pastEntries = schedule.filter(e =>
        e.year < asOf.getFullYear() ||
        (e.year === asOf.getFullYear() && e.month <= asOf.getMonth() + 1)
    );
    if (pastEntries.length === 0) return asset.cost;
    return pastEntries[pastEntries.length - 1].bookValue;
}
