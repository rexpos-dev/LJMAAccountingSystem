import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            bankAccountId,
            statementDate,
            statementEndingBalance,
            systemBalance,
            transactionIds
        } = body;

        if (!bankAccountId || !statementDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Reconciliation record
            const recon = await tx.bankReconciliation.create({
                data: {
                    bankAccountId,
                    statementDate: new Date(statementDate),
                    statementBalance: parseFloat(statementEndingBalance) || 0,
                    systemBalance: parseFloat(systemBalance) || 0,
                    difference: (parseFloat(systemBalance) || 0) - (parseFloat(statementEndingBalance) || 0),
                    status: 'CLOSED'
                }
            });

            // 2. Mark transactions as reconciled
            if (transactionIds && Array.isArray(transactionIds)) {
                await tx.bankTransaction.updateMany({
                    where: { id: { in: transactionIds } },
                    data: {
                        status: 'RECONCILED',
                        clearedAt: new Date()
                    }
                });
            }

            return recon;
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Failed to finalize reconciliation:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
