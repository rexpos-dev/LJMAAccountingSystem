import { prisma } from './prisma';
import { applyTransactionToAccountBalance } from './database';

export interface JournalEntryLine {
    accountNo: number;          // The integer account_no from the Account table
    debit?: number;
    credit?: number;
}

export interface JournalEntryRequest {
    date: Date;
    referenceId: string;        // e.g. Invoice Number, PO Number, POS Receipt ID
    particulars: string;        // E.g. "Sales from POS", "Payment of Invoice 123"
    user?: string;              // Optional user performing the action
    lines: JournalEntryLine[];
}

/**
 * Creates balanced journal entry lines in the Transaction table and
 * automatically updates the running chart of accounts balances.
 */
export async function postJournalEntry(request: JournalEntryRequest, tx?: any) {
    // Use the provided transaction client, or default to the global prisma client
    const db = tx || prisma;

    const { date, referenceId, particulars, user, lines } = request;

    // Validate double-entry balance
    const totalDebits = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredits = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    // Floating point guard, checking to 2 decimal places
    if (Math.abs(totalDebits - totalCredits) > 0.01) {
        throw new Error(`Journal not balanced: Debits = ${totalDebits}, Credits = ${totalCredits}`);
    }

    const createdTransactions = [];

    for (const line of lines) {
        // Only post lines with non-zero amounts
        const debit = line.debit || 0;
        const credit = line.credit || 0;
        if (debit === 0 && credit === 0) continue;

        // Fetch account details to populate the denormalized journal fields
        const account = await db.account.findUnique({
            where: { account_no: line.accountNo }
        });

        if (!account) {
            throw new Error(`Account not found for number: ${line.accountNo}`);
        }

        const transactionData = {
            date: date,
            transNo: referenceId, // Using reference as the transNo
            invoiceNumber: referenceId, // Store in invoiceNumber for easy lookup
            particulars: particulars,
            accountNumber: account.account_no.toString(),
            code: account.account_no.toString(),
            accountName: account.account_name,
            debit: debit,
            credit: credit,
            user: user || 'System',
        };

        const transaction = await db.transaction.create({
            data: transactionData
        });

        // We still call the original database function. Because applyTransaction updates via its own
        // prisma instance and isn't transactional yet, this is safe to call unless we wrap in heavy TX.
        // If wrapping in TX, we do inline update so it doesn't deadlock.
        if (tx) {
            const baseType = account.accountTypeRel?.baseType || 'Asset';
            let balanceChange = 0;
            if (baseType === 'Asset' || baseType === 'Expense') {
                balanceChange = debit - credit;
            } else {
                balanceChange = credit - debit;
            }

            if (balanceChange !== 0) {
                await tx.account.update({
                    where: { id: account.id },
                    data: { balance: { increment: balanceChange } }
                });
            }
        } else {
            await applyTransactionToAccountBalance(
                account.account_no.toString(),
                debit,
                credit
            );
        }

        createdTransactions.push(transaction);
    }

    return createdTransactions;
}
