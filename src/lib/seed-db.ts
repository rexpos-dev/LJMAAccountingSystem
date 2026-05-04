
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
      { account_no: 1101, account_name: 'Cash on Hand', balance: 50000, account_type: "Asset", header: "No", bank: "Yes", account_type_no: 1 },
      { account_no: 1102, account_name: 'Petty Cash', balance: 5000, account_type: "Asset", header: "No", bank: "Yes", account_type_no: 1 },
      { account_no: 1103, account_name: 'Cash in Bank', balance: 100000, account_type: "Asset", header: "No", bank: "Yes", account_type_no: 1 },
      { account_no: 1104, account_name: 'Accounts Receivable', balance: 25000, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 1105, account_name: 'Allowance for Doubtful Accounts', balance: 0, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 1106, account_name: 'Inventory', balance: 75000, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 1107, account_name: 'Prepaid Expenses', balance: 0, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 1108, account_name: 'Input VAT', balance: 0, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 1201, account_name: 'Property and Equipment', balance: 0, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 1202, account_name: 'Accumulated Depreciation', balance: 0, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 1203, account_name: 'Intangible Assets', balance: 0, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 1204, account_name: 'Security Deposits', balance: 0, account_type: "Asset", header: "No", bank: "No", account_type_no: 1 },
    ]
  },
  {
    category: "Liabilities",
    accounts: [
      { account_no: 2101, account_name: 'Accounts Payable', balance: -30000, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2102, account_name: 'Accrued Expenses', balance: 0, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2103, account_name: 'Salaries Payable', balance: 0, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2104, account_name: 'Withholding Tax Payable', balance: 0, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2105, account_name: 'Output VAT Payable', balance: 0, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2106, account_name: 'SSS Payable', balance: 0, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2107, account_name: 'PhilHealth Payable', balance: 0, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2108, account_name: 'Pag-IBIG Payable', balance: 0, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2201, account_name: 'Bank Loan', balance: -50000, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 2202, account_name: 'Notes Payable', balance: 0, account_type: "Liability", header: "No", bank: "No", account_type_no: 1 },
    ]
  },
  {
    category: "Equity",
    accounts: [
      { account_no: 3101, account_name: 'Owner\'s Capital', balance: 0, account_type: "Equity", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 3102, account_name: 'Retained Earnings', balance: 0, account_type: "Equity", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 3103, account_name: 'Drawings', balance: 0, account_type: "Equity", header: "No", bank: "No", account_type_no: 1 },
    ]
  },
  {
    category: "Income",
    accounts: [
      { account_no: 4101, account_name: 'Sales Revenue', balance: 0, account_type: "Income", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 4102, account_name: 'Service Income', balance: 0, account_type: "Income", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 4103, account_name: 'Other Income', balance: 0, account_type: "Income", header: "No", bank: "No", account_type_no: 1 },
    ]
  },
  {
    category: "Cost of Sales",
    accounts: [
      { account_no: 5101, account_name: 'Cost of Goods Sold', balance: 0, account_type: "Cost of Sales", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 5102, account_name: 'Freight In', balance: 0, account_type: "Cost of Sales", header: "No", bank: "No", account_type_no: 1 },
    ]
  },
  {
    category: "Expenses",
    accounts: [
      { account_no: 6101, account_name: 'Salaries and Wages', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6102, account_name: 'Manager Allowance', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6103, account_name: 'Rent Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6104, account_name: 'Utilities Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6105, account_name: 'Office Supplies Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6106, account_name: 'Transportation Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6107, account_name: 'Fuel Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6108, account_name: 'Repairs and Maintenance', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6109, account_name: 'Depreciation Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6110, account_name: 'Internet Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6201, account_name: 'Professional Fees', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6202, account_name: 'Representation Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
      { account_no: 6203, account_name: 'Miscellaneous Expense', balance: 0, account_type: "Expense", header: "No", bank: "No", account_type_no: 1 },
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
          const accountWithCategory: Account = {
            id: docRef.id,
            ...account,
            account_category: item.category,
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
