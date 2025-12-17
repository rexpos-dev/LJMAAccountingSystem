
'use server';
/**
 * @fileOverview A flow for recording an account transfer.
 *
 * - recordAccountTransfer - A function that handles the account transfer process.
 * - AccountTransferInput - The input type for the recordAccountTransfer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { writeBatch, doc, collection, increment } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const AccountTransferInputSchema = z.object({
  userId: z.string().describe('The ID of the user performing the transfer.'),
  fromAccountId: z.string().describe('The ID of the account to transfer from.'),
  toAccountId: z.string().describe('The ID of the account to transfer to.'),
  fromAccountName: z.string().describe('The name of the account to transfer from.'),
  toAccountName: z.string().describe('The name of the account to transfer to.'),
  amount: z.number().positive().describe('The amount to transfer.'),
  date: z.any().describe('The date of the transfer.'), // Using any for Timestamp
});

export type AccountTransferInput = z.infer<typeof AccountTransferInputSchema>;


/**
 * A server-side utility function to perform the batched Firestore writes for an account transfer.
 * This is called by the Genkit flow.
 */
async function performTransferInFirestore(input: AccountTransferInput): Promise<void> {
    const { firestore } = initializeFirebase();
    const batch = writeBatch(firestore);

    // 1. Debit from the source account
    const fromAccountRef = doc(firestore, 'users', input.userId, 'charts_of_accounts', input.fromAccountId);
    batch.update(fromAccountRef, {
      balance: increment(-input.amount),
    });

    // 2. Credit to the destination account
    const toAccountRef = doc(firestore, 'users', input.userId, 'charts_of_accounts', input.toAccountId);
    batch.update(toAccountRef, {
      balance: increment(input.amount),
    });

    // 3. Create a debit transaction record
    const debitTransactionRef = doc(collection(firestore, 'imported_transactions'));
    batch.set(debitTransactionRef, {
        ledger: 'General',
        transNo: `XFR-${Date.now()}`,
        code: `XFR-${input.fromAccountId}`,
        accountNumber: input.fromAccountId,
        date: input.date,
        invoiceNumber: '',
        particulars: `Transfer to ${input.toAccountName}`,
        debit: input.amount,
        credit: 0,
        balance: 0, // Balance here might need more context, setting to 0 for now.
        user: input.userId,
        checkAccountNumber: null,
        checkNumber: null,
        dateMatured: null,
        accountName: input.fromAccountName,
        bankName: null,
        bankBranch: null,
        isCoincide: null,
        dailyClosing: null,
        approval: 'Auto',
        ftToLedger: null,
        ftToAccount: null,
    });

    // 4. Create a credit transaction record
    const creditTransactionRef = doc(collection(firestore, 'imported_transactions'));
    batch.set(creditTransactionRef, {
        ledger: 'General',
        transNo: `XFR-${Date.now()}`,
        code: `XFR-${input.toAccountId}`,
        accountNumber: input.toAccountId,
        date: input.date,
        invoiceNumber: '',
        particulars: `Transfer from ${input.fromAccountName}`,
        debit: 0,
        credit: input.amount,
        balance: 0,
        user: input.userId,
        checkAccountNumber: null,
        checkNumber: null,
        dateMatured: null,
        accountName: input.toAccountName,
        bankName: null,
        bankBranch: null,
        isCoincide: null,
        dailyClosing: null,
        approval: 'Auto',
        ftToLedger: null,
        ftToAccount: null,
    });

    // 5. Commit the batch
    await batch.commit();
}


// Define the flow that calls the utility function. This flow is NOT exported directly.
const recordAccountTransferFlow = ai.defineFlow(
  {
    name: 'recordAccountTransferFlow',
    inputSchema: AccountTransferInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    // The flow now simply calls the separate async function.
    await performTransferInFirestore(input);
  }
);


// This is the only function exported. It's an async function that can be used as a Server Action.
export async function recordAccountTransfer(input: AccountTransferInput): Promise<void> {
  // We invoke the Genkit flow here.
  await recordAccountTransferFlow(input);
}
