import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const fromDateParam = searchParams.get('fromDate');
        const toDateParam = searchParams.get('toDate');
        const accountIdParam = searchParams.get('accountId');

        if (!fromDateParam || !toDateParam) {
            return NextResponse.json({ error: "Missing fromDate or toDate" }, { status: 400 });
        }

        const fromDate = new Date(fromDateParam);
        const toDate = new Date(toDateParam);
        toDate.setHours(23, 59, 59, 999); // Include the whole end day

        // 1. Fetch all matching accounts
        const accountWhereClause: any = {};
        if (accountIdParam && accountIdParam !== 'all') {
            accountWhereClause.id = accountIdParam;
        }

        const accounts = await prisma.account.findMany({
            where: accountWhereClause,
            include: {
                accountTypeRel: true,
            },
            orderBy: {
                account_no: 'asc'
            }
        });

        const generalLedgerData = [];

        for (const account of accounts) {
            // Normalize account number to string for searching transactions
            const accNoStr = account.account_no.toString();

            // 2. Calculate beginning balance
            // Find all transactions for this account BEFORE the fromDate
            const priorTransactions = await prisma.transaction.findMany({
                where: {
                    OR: [
                        { accountNumber: accNoStr },
                        { code: accNoStr }
                    ],
                    date: {
                        lt: fromDate
                    }
                }
            });

            // Calculate beginning balance based on account base type
            // Base Types are generally Asset, Liability, Equity, Revenue, Expense
            const baseType = account.accountTypeRel?.baseType || 'Asset';
            const isDebitNormal = ['Asset', 'Expense'].includes(baseType);

            let beginningBalanceDebit = 0;
            let beginningBalanceCredit = 0;

            for (const tx of priorTransactions) {
                beginningBalanceDebit += (tx.debit || 0);
                beginningBalanceCredit += (tx.credit || 0);
            }

            let beginningBalance = 0;
            if (isDebitNormal) {
                beginningBalance = beginningBalanceDebit - beginningBalanceCredit;
            } else {
                beginningBalance = beginningBalanceCredit - beginningBalanceDebit;
            }

            // 3. Fetch transactions within the date range
            const periodTransactions = await prisma.transaction.findMany({
                where: {
                    OR: [
                        { accountNumber: accNoStr },
                        { code: accNoStr }
                    ],
                    date: {
                        gte: fromDate,
                        lte: toDate
                    }
                },
                orderBy: {
                    date: 'asc'
                }
            });

            // If no prior or current transactions, we could skip this account if preferred,
            // but usually GL shows accounts with activity or non-zero balances.
            if (priorTransactions.length === 0 && periodTransactions.length === 0) {
                continue;
            }

            // 4. Compute running balance for each transaction
            let currentBalance = beginningBalance;
            const processedTransactions = periodTransactions.map((tx: any) => {
                const debit = tx.debit || 0;
                const credit = tx.credit || 0;

                if (isDebitNormal) {
                    currentBalance += (debit - credit);
                } else {
                    currentBalance += (credit - debit);
                }

                return {
                    id: tx.id,
                    date: tx.date,
                    transNo: tx.transNo || tx.invoiceNumber || '-',
                    particulars: tx.particulars || tx.ledger || '-',
                    debit: debit,
                    credit: credit,
                    runningBalance: currentBalance,
                    user: tx.user
                };
            });

            generalLedgerData.push({
                accountId: account.id,
                accountNo: account.account_no,
                accountName: account.account_name,
                accountType: account.account_type,
                baseType: baseType,
                beginningBalance: Math.max(0, beginningBalance),
                beginningBalanceIsDebit: beginningBalance >= 0 ? isDebitNormal : !isDebitNormal,
                rawBeginningBalance: beginningBalance, // Keep raw value for easier deb/cred specific displays
                transactions: processedTransactions,
                endingBalance: currentBalance,
                totalDebits: periodTransactions.reduce((sum: number, tx: any) => sum + (tx.debit || 0), 0),
                totalCredits: periodTransactions.reduce((sum: number, tx: any) => sum + (tx.credit || 0), 0),
            });
        }

        return NextResponse.json(generalLedgerData);
    } catch (error: any) {
        console.error("Error fetching general ledger:", error);
        return NextResponse.json({ error: "Failed to fetch general ledger data", details: error.message }, { status: 500 });
    }
}
