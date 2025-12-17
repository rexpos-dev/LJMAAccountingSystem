
'use client';

import { collection, getDocs, writeBatch, Firestore, doc, Timestamp } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase';

// A flag to ensure the seeding logic runs only once.
let hasSeeded = false;

const csvData = `
6066,Cash & Checks,1,Cash & Checks1-8/8/2021,1080002,1/1/2000 0:00,1,Opening Transaction,0,0,0,Cash,NULL,NULL,NULL,NULL,NULL,JYR,8/8/2021 12:56,NULL,0,NULL,NULL,NULL,0x00000000000646EE
6067,Cash & Checks,2,Cash & Checks2-10/1/2021,1080001,1/1/2000 0:00,-,Opening Transaction,0,0,0,Cash,NULL,NULL,NULL,NULL,NULL,JYR,10/1/2021 9:32,NULL,1,NULL,NULL,NULL,0x00000000000646EF
6068,Cash & Checks,3,Cash & Checks5-1/4/2023,1080003,1/4/2023 0:00,1,Opening Transaction,0,0,0,Cash,NULL,NULL,NULL,NULL,NULL,JYR,1/4/2023 22:18,NULL,1,NULL,NULL,NULL,0x00000000000646F0
6069,Cash & Checks,4,Cash & Checks16-9/15/2023,1080004,9/15/2023 0:00,1,Opening Transaction,0,0,0,Cash,NULL,NULL,NULL,NULL,NULL,JYR,1899-12-30 16:02:02,NULL,1,NULL,NULL,NULL,0x00000000000646F1
6070,Cash & Checks,5,Cash & Checks5-05/16/2024,1080005,5/16/2024 0:00,1,Opening Transaction,0,0,0,Cash,NULL,NULL,NULL,NULL,NULL,Gang,1899-12-30 16:18:57,NULL,1,NULL,NULL,NULL,0x00000000000646F2
6071,Cash & Checks,5,Cash & Checrerks5-05/16/2024,1080006,5/16/2024 0:00,1,Opening Transaction,0,0,0,Cash,NULL,NULL,NULL,NULL,NULL,Gang,1899-12-30 16:18:57,NULL,1,NULL,NULL,NULL,0x00000000000646F3
6072,Cash & Checks,6,Cash & Checks6-05/16/2024,1080004,5/16/2024 0:00,20561,daily savings 5/14/24,5000,0,5000,1,NULL,NULL,Cash,Cash,-,Gang,1899-12-30 16:24:20,NULL,1,NULL,NULL,NULL,0x00000000000646F4
6073,Cash & Checks,7,Cash & Checks7-05/16/2024,1080006,5/16/2024 0:00,20560,BIR daily Allocation,5200,0,5200,1,NULL,NULL,Cash,Cash,-,Gang,1899-12-30 16:27:21,NULL,1,NULL,NULL,NULL,0x00000000000646F5
`;

const parseDate = (dateStr: string, timeStr?: string): Date | null => {
    try {
        if (dateStr.includes('1899')) {
             if (timeStr) {
                const timePart = timeStr.split(' ')[0];
                return new Date(`1970-01-01T${timePart}`);
             }
             const datePart = dateStr.split(' ')[0];
             return new Date(datePart);
        }
        
        const dateTimeStr = timeStr ? `${dateStr.split(' ')[0]} ${timeStr}` : dateStr;
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) {
            const alternativeDate = new Date(dateStr);
            if(isNaN(alternativeDate.getTime())) return null;
            return alternativeDate;
        }
        return date;
    } catch (e) {
        console.error("Could not parse date:", dateStr, timeStr);
        return null;
    }
};

// Function to convert hex to a sortable timestamp representation
const hexToTimestamp = (hex: string): Timestamp | null => {
  try {
    const hexValue = hex.startsWith('0x') ? hex.substring(2) : hex;
    // This is a simplification. A real conversion from SQL Server's timestamp/rowversion
    // to a date is not direct as it's not a datetime value.
    // For demonstration, we'll use the current time.
    return Timestamp.now();
  } catch (e) {
    console.error("Could not convert hex to timestamp:", hex);
    return null;
  }
}

export const seedImportedTransactions = async (db: Firestore) => {
    if (hasSeeded) {
        return;
    }

    const transactionsCollectionRef = collection(db, 'imported_transactions');

    try {
        const snapshot = await getDocs(transactionsCollectionRef);
        if (!snapshot.empty) {
            console.log('Imported transactions collection already has data. Seeding skipped.');
            hasSeeded = true;
            return;
        }

        console.log('Seeding imported_transactions...');
        const batch = writeBatch(db);

        const rows = csvData.trim().split('\n');

        rows.forEach(row => {
            const columns = row.split(',');
            const [
                seq, ledger, transNo, code, accountNumber, dateStr, invoiceNumber, particulars,
                debit, credit, balance, checkAccountNumber, checkNumber, dateMaturedStr,
                accountName, bankName, bankBranch, user, timeStr, isCoincide, dailyClosing,
                approval, ftToLedger, ftToAccount, ssma_timestamp_hex
            ] = columns;

            const transactionDate = parseDate(dateStr, timeStr);
            const dateMatured = dateMaturedStr !== 'NULL' ? parseDate(dateMaturedStr) : null;
            const ssma_timestamp = ssma_timestamp_hex ? hexToTimestamp(ssma_timestamp_hex) : null;

            const docRef = doc(transactionsCollectionRef);
            batch.set(docRef, {
                seq: parseInt(seq, 10) || null,
                ledger: ledger || null,
                transNo: transNo || null,
                code: code || null,
                accountNumber: accountNumber || null,
                date: transactionDate ? Timestamp.fromDate(transactionDate) : null,
                invoiceNumber: invoiceNumber || null,
                particulars: particulars || null,
                debit: parseFloat(debit) || 0,
                credit: parseFloat(credit) || 0,
                balance: parseFloat(balance) || 0,
                checkAccountNumber: checkAccountNumber === 'NULL' ? null : checkAccountNumber,
                checkNumber: checkNumber === 'NULL' ? null : checkNumber,
                dateMatured: dateMatured ? Timestamp.fromDate(dateMatured) : null,
                accountName: accountName === 'NULL' ? null : accountName,
                bankName: bankName === 'NULL' ? null : bankName,
                bankBranch: bankBranch === 'NULL' ? null : bankBranch,
                user: user || null,
                isCoincide: isCoincide === 'NULL' ? null : (isCoincide === '1'),
                dailyClosing: dailyClosing ? parseInt(dailyClosing, 10) : null,
                approval: approval === 'NULL' ? null : approval,
                ftToLedger: ftToLedger === 'NULL' ? null : ftToLedger,
                ftToAccount: ftToAccount === 'NULL' ? null : ftToAccount,
                ssma_timestamp: ssma_timestamp
            });
        });

        await batch.commit();
        console.log('Imported transactions have been seeded successfully.');
        hasSeeded = true;

    } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: transactionsCollectionRef.path,
            operation: 'write',
        });
        throw permissionError;
    }
};

