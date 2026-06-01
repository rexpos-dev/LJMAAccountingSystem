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

export default function ViewTransactionDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const transaction = getDialogData('view-transaction') as Transaction | null;

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

  const exportToPDF = () => {
    if (!transaction) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export the PDF.');
      return;
    }

    const formattedDate = formatTimestamp(transaction.date);
    const formattedDateMatured = formatTimestamp(transaction.dateMatured);
    const formattedDebit = formatCurrency(transaction.debit);
    const formattedCredit = formatCurrency(transaction.credit);
    const formattedBalance = formatCurrency(transaction.balance);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transaction Voucher - Seq #${transaction.seq || '---'}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            margin: 0;
            padding: 30px;
            font-size: 11px;
            line-height: 1.4;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .logo-section h1 {
            font-size: 20px;
            font-weight: 800;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            color: #0f172a;
          }
          .logo-section p {
            margin: 3px 0 0 0;
            font-size: 9px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .voucher-title {
            text-align: right;
          }
          .voucher-title h2 {
            font-size: 14px;
            font-weight: 800;
            margin: 0;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .voucher-title p {
            margin: 3px 0 0 0;
            font-size: 11px;
            font-family: monospace;
            color: #334155;
            font-weight: bold;
          }
          .section-title {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #334155;
            border-bottom: 1.5px solid #cbd5e1;
            padding-bottom: 3px;
            margin-bottom: 10px;
            margin-top: 15px;
          }
          .grid {
            display: flex;
            gap: 30px;
          }
          .col {
            flex: 1;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
          }
          .info-table td {
            padding: 4px 0;
            vertical-align: top;
            border-bottom: 1px dashed #e2e8f0;
          }
          .info-table tr:last-child td {
            border-bottom: none;
          }
          .info-table td.label {
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            width: 35%;
          }
          .info-table td.value {
            font-weight: 600;
            color: #0f172a;
            padding-left: 10px;
          }
          .particulars-section {
            margin-top: 15px;
          }
          .particulars-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin-top: 5px;
            color: #334155;
            font-size: 11px;
            line-height: 1.5;
            min-height: 45px;
            white-space: pre-wrap;
          }
          .financial-card {
            border: 1px solid #0f172a;
            border-radius: 6px;
            overflow: hidden;
            margin-top: 15px;
          }
          .financial-table {
            width: 100%;
            border-collapse: collapse;
          }
          .financial-table th {
            background-color: #f1f5f9;
            padding: 8px;
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            border-bottom: 1px solid #0f172a;
            text-align: right;
          }
          .financial-table th:first-child {
            text-align: left;
          }
          .financial-table td {
            padding: 10px 8px;
            font-weight: 700;
            text-align: right;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
          }
          .financial-table td:first-child {
            text-align: left;
            color: #475569;
            font-size: 9px;
            text-transform: uppercase;
            font-weight: 800;
          }
          .financial-table tr:last-child td {
            border-bottom: none;
            background-color: #f8fafc;
          }
          .financial-table .debit {
            color: #047857;
          }
          .financial-table .credit {
            color: #b91c1c;
          }
          .financial-table .balance {
            color: #1d4ed8;
            font-size: 13px;
            font-weight: 900;
          }
          .signatures-section {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            margin-top: 45px;
          }
          .signature-block {
            flex: 1;
            text-align: center;
          }
          .signature-line {
            border-bottom: 1.5px solid #0f172a;
            height: 30px;
            margin-bottom: 6px;
          }
          .signature-label {
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
          }
          .signature-name {
            font-size: 11px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 2px;
          }
          .footer {
            margin-top: 45px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
            font-size: 8px;
            color: #94a3b8;
            font-weight: 500;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <h1>LJMA Accounting</h1>
            <p>Financial Intelligence Module</p>
          </div>
          <div class="voucher-title">
            <h2>Transaction Voucher</h2>
            <p>Seq #${transaction.seq || '---'}</p>
          </div>
        </div>

        <div class="grid">
          <div class="col">
            <div class="section-title">Primary & Account Identification</div>
            <table class="info-table">
              <tr>
                <td class="label">Sequence No.</td>
                <td class="value">${transaction.seq || '---'}</td>
              </tr>
              <tr>
                <td class="label">Transaction No.</td>
                <td class="value">${transaction.transNo || '---'}</td>
              </tr>
              <tr>
                <td class="label">Invoice Number</td>
                <td class="value">${transaction.invoiceNumber || '---'}</td>
              </tr>
              <tr>
                <td class="label">Reference Code</td>
                <td class="value">${transaction.code || '---'}</td>
              </tr>
              <tr>
                <td class="label">Account Name</td>
                <td class="value" style="color: #2563eb;">${transaction.accountName || '---'}</td>
              </tr>
              <tr>
                <td class="label">Account Number</td>
                <td class="value">${transaction.accountNumber || '---'}</td>
              </tr>
              <tr>
                <td class="label">Ledger Group</td>
                <td class="value">${transaction.ledger || '---'}</td>
              </tr>
              <tr>
                <td class="label">Coincide Status</td>
                <td class="value">${transaction.isCoincide !== null ? (transaction.isCoincide ? 'Yes' : 'No') : 'N/A'}</td>
              </tr>
            </table>
          </div>

          <div class="col">
            <div class="section-title">Temporal & Banking Routing</div>
            <table class="info-table">
              <tr>
                <td class="label">Transaction Date</td>
                <td class="value">${formattedDate}</td>
              </tr>
              <tr>
                <td class="label">Date Matured</td>
                <td class="value">${formattedDateMatured}</td>
              </tr>
              <tr>
                <td class="label">Daily Closing</td>
                <td class="value">${transaction.dailyClosing || '---'}</td>
              </tr>
              <tr>
                <td class="label">Bank Name</td>
                <td class="value">${transaction.bankName || '---'}</td>
              </tr>
              <tr>
                <td class="label">Bank Branch</td>
                <td class="value">${transaction.bankBranch || '---'}</td>
              </tr>
              <tr>
                <td class="label">Check Account</td>
                <td class="value">${transaction.checkAccountNumber || '---'}</td>
              </tr>
              <tr>
                <td class="label">Check Number</td>
                <td class="value">${transaction.checkNumber || '---'}</td>
              </tr>
              <tr>
                <td class="label">System User</td>
                <td class="value">${transaction.user || '---'}</td>
              </tr>
              <tr>
                <td class="label">FT To Ledger</td>
                <td class="value">${transaction.ftToLedger || '---'}</td>
              </tr>
              <tr>
                <td class="label">FT To Account</td>
                <td class="value">${transaction.ftToAccount || '---'}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="particulars-section">
          <div class="section-title">Transaction Particulars</div>
          <div class="particulars-box">${transaction.particulars || 'No detailed particulars recorded for this transaction.'}</div>
        </div>

        <div class="financial-card">
          <table class="financial-table">
            <thead>
              <tr>
                <th>Classification</th>
                <th>Debit Amount</th>
                <th>Credit Amount</th>
                <th>Running Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Financial Values</td>
                <td class="debit">${formattedDebit}</td>
                <td class="credit">${formattedCredit}</td>
                <td class="balance">${formattedBalance}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="signatures-section">
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">${transaction.user || '---'}</div>
            <div class="signature-label">Prepared By (System User)</div>
          </div>
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">&nbsp;</div>
            <div class="signature-label">Verified By</div>
          </div>
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">${transaction.approval || '---'}</div>
            <div class="signature-label">Approval Status / Approved By</div>
          </div>
        </div>

        <div class="footer">
          <span>Printed on ${new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })}</span>
          <span>Confidential &mdash; LJMA Accounting System</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
              <Button variant="outline" onClick={exportToPDF}
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
