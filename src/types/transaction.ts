import type { Timestamp } from 'firebase/firestore';

export interface Transaction {
  id?: string;
  seq: number;
  ledger: string;
  transNo: string;
  code: string;
  accountNumber: string;
  date: Timestamp | null;
  invoiceNumber: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
  checkAccountNumber: string | null;
  checkNumber: string | null;
  dateMatured: Timestamp | null;
  accountName: string | null;
  bankName: string | null;
  bankBranch: string | null;
  user: string;
  isCoincide: boolean | null;
  dailyClosing: number | null;
  approval: string | null;
  ftToLedger: string | null;
  ftToAccount: string | null;
  ssma_timestamp?: Timestamp | null;
}
