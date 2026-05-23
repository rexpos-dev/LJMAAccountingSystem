'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import format from '@/lib/date-format';
import type { Transaction } from '@/types/transaction';
import { 
  FileText, 
  Calendar, 
  User, 
  CreditCard, 
  Hash, 
  Activity, 
  ShieldCheck, 
  Banknote,
  Navigation,
  Info,
  X,
  Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      return format(date, 'MMMM dd, yyyy');
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

  const dataGroups = [
    {
      title: 'Primary Identification',
      icon: <Hash className="h-4 w-4 text-primary" />,
      fields: [
        { label: 'Sequence No.', value: transaction.seq, icon: <Activity className="h-3 w-3" /> },
        { label: 'Transaction No.', value: transaction.transNo, icon: <Navigation className="h-3 w-3" /> },
        { label: 'Invoice Number', value: transaction.invoiceNumber, icon: <FileText className="h-3 w-3" /> },
        { label: 'Reference Code', value: transaction.code, icon: <Hash className="h-3 w-3" /> },
      ]
    },
    {
      title: 'Account Information',
      icon: <Banknote className="h-4 w-4 text-blue-400" />,
      fields: [
        { label: 'Account Name', value: transaction.accountName, highlight: true },
        { label: 'Account Number', value: transaction.accountNumber },
        { label: 'Ledger Group', value: transaction.ledger },
        { label: 'Coincide Status', value: transaction.isCoincide !== null ? (transaction.isCoincide ? 'Yes' : 'No') : 'N/A' },
      ]
    },
    {
      title: 'Financial Values',
      icon: <CreditCard className="h-4 w-4 text-emerald-400" />,
      fields: [
        { label: 'Debit Amount', value: formatCurrency(transaction.debit), className: 'text-emerald-400 font-bold' },
        { label: 'Credit Amount', value: formatCurrency(transaction.credit), className: 'text-rose-400 font-bold' },
        { label: 'Running Balance', value: formatCurrency(transaction.balance), className: 'text-primary font-black italic' },
      ]
    },
    {
      title: 'Temporal Data',
      icon: <Calendar className="h-4 w-4 text-orange-400" />,
      fields: [
        { label: 'Transaction Date', value: formatTimestamp(transaction.date) },
        { label: 'Date Matured', value: formatTimestamp(transaction.dateMatured) },
        { label: 'Daily Closing', value: transaction.dailyClosing },
      ]
    },
    {
      title: 'Banking Details',
      icon: <Info className="h-4 w-4 text-purple-400" />,
      fields: [
        { label: 'Bank Name', value: transaction.bankName },
        { label: 'Bank Branch', value: transaction.bankBranch },
        { label: 'Check Account', value: transaction.checkAccountNumber },
        { label: 'Check Number', value: transaction.checkNumber },
      ]
    },
    {
      title: 'Audit & Routing',
      icon: <ShieldCheck className="h-4 w-4 text-cyan-400" />,
      fields: [
        { label: 'System User', value: transaction.user, icon: <User className="h-3 w-3" /> },
        { label: 'Approval Status', value: transaction.approval, highlight: true },
        { label: 'FT To Ledger', value: transaction.ftToLedger },
        { label: 'FT To Account', value: transaction.ftToAccount },
      ]
    }
  ];

  return (
    <Dialog open={openDialogs['view-transaction']} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Transaction Intelligence</DialogTitle>
              <p className="text-sm text-foreground/40 font-medium tracking-wide mt-0.5">Deep view analysis of financial record #{transaction.seq || '---'}</p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Particulars Hero Section */}
          <div className="glass-card p-6 mb-8 border-foreground/5 bg-foreground/[0.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Info className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-2 block">Transaction Particulars</span>
              <p className="text-xl font-medium text-foreground/90 leading-relaxed max-w-3xl">
                {transaction.particulars || "No detailed particulars recorded for this transaction."}
              </p>
            </div>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataGroups.map((group, idx) => (
              <div key={idx} className="glass-card p-5 border-foreground/5 space-y-4 flex flex-col">
                <div className="flex items-center gap-2 border-b border-foreground/5 pb-3 mb-1">
                  {group.icon}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">{group.title}</span>
                </div>
                <div className="space-y-4 flex-1">
                  {group.fields.map((field, fIdx) => (
                    <div key={fIdx} className="space-y-1">
                      <div className="flex items-center gap-1.5 opacity-40">
                        {'icon' in field && field.icon}
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground">{field.label}</span>
                      </div>
                      <div className={cn(
                        "text-sm font-semibold tracking-tight truncate",
                        'highlight' in field && field.highlight ? "text-primary italic font-black" : "text-foreground/80",
                        'className' in field ? field.className : ""
                      )}>
                        {field.value || '---'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Read Only Mode</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.print()}
                className="h-11 border-foreground/10 bg-foreground/5 hover:bg-foreground/10 rounded-xl px-6 text-xs font-black uppercase tracking-widest text-foreground/60"
              >
                <Printer className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={handleClose} className="bg-primary text-black hover:bg-primary/90 font-black rounded-xl px-8 text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-95" >
                Close View
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
