import { prisma } from './prisma';
import { postJournalEntry, JournalEntryRequest } from './journal-helper';
import { BankTransactionType, BankTransactionStatus } from '@prisma/client';

/**
 * Posts an approved bank transaction to the General Ledger.
 */
export async function postBankTransactionToGL(bankTransactionId: string, user: string = 'System') {
    return await prisma.$transaction(async (tx) => {
        // 1. Fetch the bank transaction with its account details
        const bt = await tx.bankTransaction.findUnique({
            where: { id: bankTransactionId },
            include: {
                bankAccount: {
                    include: {
                        gl_account: true
                    }
                }
            }
        });

        if (!bt) throw new Error('Bank Transaction not found');
        if (bt.status !== 'APPROVED') throw new Error(`Transaction status is ${bt.status}, expected APPROVED`);

        const bankGlAccountNo = bt.bankAccount.gl_account.account_no;
        const amount = bt.amount;
        const date = bt.date || new Date();
        const particulars = bt.particulars || `Bank Transaction: ${bt.type}`;
        const referenceId = bt.reference || bt.id;

        let lines = [];

        // 2. Determine the double-entry lines based on type and source
        // This logic needs to be expanded as more source types are integrated
        const offsetAccountNo = bt.offsetGlAccountId ? parseInt(bt.offsetGlAccountId) : 9999;

        switch (bt.type) {
            case 'CASH_IN':
            case 'TRANSFER_IN':
                // Debit Bank, Credit Source
                lines.push({ accountNo: bankGlAccountNo, debit: amount });
                lines.push({ accountNo: offsetAccountNo, credit: amount });
                break;

            case 'CASH_OUT':
            case 'TRANSFER_OUT':
                // Credit Bank, Debit Source
                lines.push({ accountNo: bankGlAccountNo, credit: amount });
                lines.push({ accountNo: offsetAccountNo, debit: amount });
                break;

            case 'ADJUSTMENT':
                if (amount > 0) {
                    lines.push({ accountNo: bankGlAccountNo, debit: amount });
                    lines.push({ accountNo: offsetAccountNo, credit: amount });
                } else {
                    lines.push({ accountNo: bankGlAccountNo, credit: Math.abs(amount) });
                    lines.push({ accountNo: offsetAccountNo, debit: Math.abs(amount) });
                }
                break;
        }

        // 3. Post to Journal
        const journalRequest: JournalEntryRequest = {
            date,
            referenceId,
            particulars,
            user,
            lines
        };

        const createdTransactions = await postJournalEntry(journalRequest, tx);

        // 4. Update Bank Transaction status and link
        await tx.bankTransaction.update({
            where: { id: bt.id },
            data: {
                status: 'POSTED',
                transactionId: createdTransactions[0].id // Link to the first leg
            }
        });

        return { success: true, journalEntries: createdTransactions };
    });
}
