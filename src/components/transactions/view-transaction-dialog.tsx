'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import format from '@/lib/date-format';
import type { Transaction } from '@/types/transaction';

export default function ViewTransactionDialog({ transaction }: { transaction?: Transaction | null }) {
  const { openDialogs, closeDialog } = useDialog();

  const handleClose = () => {
    closeDialog('view-transaction');
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (Number.isNaN(date.getTime())) return 'Invalid Date';
      return format(date, 'MM/dd/yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount?: number | null) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  if (!transaction) return null;

  return (
    <Dialog open={openDialogs['view-transaction']} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>View Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Seq</Label>
                <span className="col-span-2">{transaction.seq || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Ledger</Label>
                <span className="col-span-2">{transaction.ledger || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Trans No</Label>
                <span className="col-span-2">{transaction.transNo || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Code</Label>
                <span className="col-span-2">{transaction.code || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Account Number</Label>
                <span className="col-span-2">{transaction.accountNumber || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Account Name</Label>
                <span className="col-span-2">{transaction.accountName || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Date</Label>
                <span className="col-span-2">{formatTimestamp(transaction.date)}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Invoice Number</Label>
                <span className="col-span-2">{transaction.invoiceNumber || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Particulars</Label>
                <span className="col-span-2">{transaction.particulars || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Debit</Label>
                <span className="col-span-2">{formatCurrency(transaction.debit)}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Credit</Label>
                <span className="col-span-2">{formatCurrency(transaction.credit)}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Balance</Label>
                <span className="col-span-2">{formatCurrency(transaction.balance)}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Check Account Number</Label>
                <span className="col-span-2">{transaction.checkAccountNumber || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Check Number</Label>
                <span className="col-span-2">{transaction.checkNumber || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Date Matured</Label>
                <span className="col-span-2">{formatTimestamp(transaction.dateMatured)}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">User</Label>
                <span className="col-span-2">{transaction.user || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Approval</Label>
                <span className="col-span-2">{transaction.approval || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Bank Name</Label>
                <span className="col-span-2">{transaction.bankName || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Bank Branch</Label>
                <span className="col-span-2">{transaction.bankBranch || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Is Coincide</Label>
                <span className="col-span-2">{transaction.isCoincide !== null ? (transaction.isCoincide ? 'Yes' : 'No') : 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Daily Closing</Label>
                <span className="col-span-2">{transaction.dailyClosing || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">FT To Ledger</Label>
                <span className="col-span-2">{transaction.ftToLedger || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">FT To Account</Label>
                <span className="col-span-2">{transaction.ftToAccount || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
