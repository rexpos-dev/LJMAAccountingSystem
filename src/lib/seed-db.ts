
'use client';

import { collection, getDocs, writeBatch, Firestore, DocumentReference, doc } from 'firebase/firestore';
import type { Account } from '@/types/account';
import { FirestorePermissionError } from '@/firebase';

// A flag to ensure the seeding logic runs only once per session per user.
const seededUsers = new Set<string>();

const initialAccountsData: { category: string, accounts: Omit<Account, 'id'>[] }[] = [
  {
    category: "Assets",
    accounts: [
      { number: 1110, name: "Checking Account", balance: 0.00, type: "Asset", header: "No", bank: "Yes" },
      { number: 1120, name: "Savings Account", balance: 0.00, type: "Asset", header: "No", bank: "Yes" },
      { number: 1150, name: "Undeposited Funds", balance: 0.00, type: "Asset", header: "No", bank: "Yes" },
      { number: 1190, name: "Petty Cash", balance: 0.00, type: "Asset", header: "No", bank: "Yes" },
      { number: 1210, name: "Accounts Receivable", balance: 0.00, type: "Asset", header: "No", bank: "No" },
      { number: 1310, name: "Inventory", balance: 0.00, type: "Asset", header: "No", bank: "No" },
    ]
  },
  {
    category: "Liabilities",
    accounts: [
      { number: 2110, name: "Credit Card", balance: 0.00, type: "Liability", header: "No", bank: "Yes" },
      { number: 2150, name: "Loan", balance: 0.00, type: "Liability", header: "No", bank: "No" },
      { number: 2210, name: "Accounts Payable", balance: 0.00, type: "Liability", header: "No", bank: "No" },
    ]
  }
];


/**
 * Seeds the 'charts_of_accounts' collection in Firestore for a specific user
 * with default data if the collection is empty for that user. This prevents
 * data duplication on hot reloads or subsequent app loads.
 *
 * @param {Firestore} db - The Firestore database instance.
 * @param {string} userId - The ID of the user for whom to seed the data.
 */
export const seedChartOfAccounts = async (db: Firestore, userId: string) => {
  if (!userId || seededUsers.has(userId)) {
    // console.log(`Database has already been checked for user ${userId} in this session.`);
    return;
  }

  const accountsCollectionRef = collection(db, 'users', userId, 'charts_of_accounts');

  try {
    const snapshot = await getDocs(accountsCollectionRef);

    if (!snapshot.empty) {
      // console.log(`Chart of accounts for user ${userId} already contains data. Seeding skipped.`);
      seededUsers.add(userId); // Mark as checked for this session
      return;
    }

    console.log(`Chart of accounts for user ${userId} is empty. Seeding database...`);
    const batch = writeBatch(db);

    initialAccountsData.forEach(item => {
      if ('category' in item && item.accounts) {
        // This is a category with nested accounts
        item.accounts.forEach(account => {
          const docRef = doc(accountsCollectionRef); // Auto-generate ID in the user's subcollection
          const accountWithCategory: Account & { category: string } = {
            ...account,
            category: item.category,
          };
          batch.set(docRef, accountWithCategory);
        });
      }
    });

    await batch.commit();

    console.log(`Default chart of accounts for user ${userId} has been seeded successfully.`);
    seededUsers.add(userId); // Mark as seeded after successful operation

  } catch (error: any) {
    // Check if the error is a Firestore permission error or something else
    // We assume any error from getDocs or commit could be a permission error
    const permissionError = new FirestorePermissionError({
        path: accountsCollectionRef.path,
        operation: 'write', // Seeding involves both reads and writes, 'write' is a safe bet.
    });
    
    // Throw the contextual error so it can be caught by the global error handler.
    throw permissionError;
  }
};
