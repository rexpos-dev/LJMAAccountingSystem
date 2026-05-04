
import { Branch } from '@prisma/client';

export type AllocationStrategy = 'none' | 'equal' | 'weighted';

export interface AllocationResult {
    branchId: string;
    branchName: string;
    amount: number;
    profit_center_id?: string | null;
}

export function calculateProration(
    totalAmount: number,
    strategy: AllocationStrategy,
    activeBranches: (Branch & { allocationWeights?: { weight: number } | null })[]
): AllocationResult[] {
    if (strategy === 'none' || activeBranches.length === 0) {
        return [];
    }

    if (strategy === 'equal') {
        const splitAmount = totalAmount / activeBranches.length;
        return activeBranches.map(branch => ({
            branchId: idToString(branch.id),
            branchName: branch.name,
            amount: Number(splitAmount.toFixed(2)),
            profit_center_id: branch.profit_center_id,
        }));
    }

    if (strategy === 'weighted') {
        const totalWeight = activeBranches.reduce((sum, b) => sum + (b.allocationWeights?.weight || 0), 0);
        if (totalWeight === 0) {
            // Fallback to equal if no weights defined
            return calculateProration(totalAmount, 'equal', activeBranches);
        }

        return activeBranches.map(branch => ({
            branchId: idToString(branch.id),
            branchName: branch.name,
            amount: Number(((totalAmount * (branch.allocationWeights?.weight || 0)) / totalWeight).toFixed(2)),
            profit_center_id: branch.profit_center_id,
        }));
    }

    return [];
}

function idToString(id: any): string {
    return typeof id === 'string' ? id : String(id);
}
