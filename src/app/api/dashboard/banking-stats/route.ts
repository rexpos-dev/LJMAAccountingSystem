import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET() {
    try {
        const now = new Date();
        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);

        // 1. Total Bank Balance (from GL accounts linked to bank accounts)
        const bankAccounts = await prisma.bankAccount.findMany({
            include: {
                gl_account: true
            }
        });
        const totalBankBalance = bankAccounts.reduce((sum, ba) => sum + (ba.gl_account.balance || 0), 0);

        // 2. Pending Audit Transactions
        const pendingAudits = await prisma.bankTransaction.count({
            where: {
                status: 'TO_AUDIT'
            }
        });

        // 3. Inflow Today
        const inflowToday = await prisma.bankTransaction.aggregate({
            where: {
                date: {
                    gte: todayStart,
                    lte: todayEnd
                },
                type: {
                    in: ['CASH_IN', 'TRANSFER_IN']
                },
                status: 'POSTED' // Only count posted/finalized transactions for stats? Or maybe all? 
                // Let's stick to posted for accuracy or include all based on UI need.
                // Common practice is to show actual movement.
            },
            _sum: {
                amount: true
            }
        });

        // 4. Outflow Today
        const outflowToday = await prisma.bankTransaction.aggregate({
            where: {
                date: {
                    gte: todayStart,
                    lte: todayEnd
                },
                type: {
                    in: ['CASH_OUT', 'TRANSFER_OUT']
                },
                status: 'POSTED'
            },
            _sum: {
                amount: true
            }
        });

        // 5. Bank-wise balances (bar chart data)
        const bankWiseBalances = bankAccounts.map(ba => ({
            name: ba.bank_name,
            accountName: ba.account_name,
            balance: ba.gl_account.balance || 0,
            code: ba.bank_code
        }));

        // 6. Latest 10 transactions
        const latestTransactions = await prisma.bankTransaction.findMany({
            take: 10,
            orderBy: {
                date: 'desc'
            },
            include: {
                bankAccount: true
            }
        });

        return NextResponse.json({
            totalBankBalance,
            pendingAudits,
            inflowToday: inflowToday._sum.amount || 0,
            outflowToday: outflowToday._sum.amount || 0,
            bankWiseBalances,
            latestTransactions
        });
    } catch (error: any) {
        console.error('Error fetching banking dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed' },
            { status: 500 }
        );
    }
}
