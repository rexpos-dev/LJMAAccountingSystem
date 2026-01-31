"use client";

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, UserPlus, Pencil, Banknote, HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import format from '@/lib/date-format';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useSuppliers } from '@/hooks/use-suppliers';
import { useBankAccounts } from '@/hooks/use-accounts';

export function EnterPaymentsOfAccountsPayableDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [supplier, setSupplier] = useState<string>('');
  const [accountPaidFrom, setAccountPaidFrom] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [checkNumber, setCheckNumber] = useState<string>('1');
  const [method, setMethod] = useState<string>('Cash');
  const [amount, setAmount] = useState<string>('0.00');
  const [journalMemo, setJournalMemo] = useState<string>('');

  const [bills, setBills] = useState<any[]>([]);
  const [loadingBills, setLoadingBills] = useState(false);

  const { suppliers } = useSuppliers();
  const { accounts: bankAccounts } = useBankAccounts();

  useEffect(() => {
    if (openDialogs['enter-payments-of-accounts-payable']) {
      const data = getDialogData('enter-payments-of-accounts-payable');
      if (data) {
        if (data.supplierId) {
          setSupplier(data.supplierId);
        }
        if (data.amount !== undefined && data.amount !== null) {
          setAmount(Number(data.amount).toFixed(2));
        }
      }
    }
  }, [openDialogs['enter-payments-of-accounts-payable'], getDialogData]);

  useEffect(() => {
    const fetchBills = async () => {
      if (!supplier) {
        setBills([]);
        return;
      }

      setLoadingBills(true);
      try {
        // Fetch Purchase Orders for this supplier
        // In a real app, query by supplierId. e.g. /api/purchase-orders?supplierId=${supplier}
        const res = await fetch('/api/purchase-orders');
        if (res.ok) {
          const data = await res.json();
          // Filter client-side for now as we might not have backend filter
          const supplierBills = data.filter((po: any) =>
            (po.supplierId === supplier || po.supplier?.id === supplier) &&
            po.status === 'Approved' // Only approved (unpaid) bills
          ).map((po: any) => ({
            id: po.id,
            date: po.date,
            dueDate: new Date(new Date(po.date).setDate(new Date(po.date).getDate() + 30)).toISOString(),
            total: po.total,
            due: po.total, // Assuming no partial payments yet
            applied: 0
          }));
          setBills(supplierBills);
        }
      } catch (error) {
        console.error("Failed to fetch bills", error);
      } finally {
        setLoadingBills(false);
      }
    };

    fetchBills();
  }, [supplier]);

  return (
    <Dialog open={openDialogs['enter-payments-of-accounts-payable']} onOpenChange={() => closeDialog('enter-payments-of-accounts-payable')}>
      <DialogContent className="max-w-3xl h-auto flex flex-col p-0 gap-0 sm:rounded-lg overflow-hidden border-0 shadow-lg bg-background text-foreground">

        {/* Header */}
        <div className="px-4 py-2 border-b flex flex-row items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="text-primary">
              <Banknote className="h-5 w-5" />
            </div>
            <DialogTitle className="text-sm font-semibold">
              Enter Payments of Accounts Payable
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => closeDialog('enter-payments-of-accounts-payable')} className="h-6 w-6 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-background">
          <div className="space-y-6">

            {/* Payment Section */}
            <fieldset className="border rounded-md p-4 bg-muted/10 shadow-sm">
              <legend className="text-sm font-semibold px-2 -ml-2 text-foreground">Payment</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">

                {/* Left Column */}
                <div className="grid grid-cols-[120px_1fr] gap-y-3 items-center">
                  <Label htmlFor="date" className="text-right pr-4">Date:</Label>
                  <div className="flex items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          id="date"
                          className={cn(
                            'w-full justify-between text-left font-normal bg-background h-8',
                            !date && 'text-muted-foreground'
                          )}
                        >
                          {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Label htmlFor="supplier" className="text-right pr-4">Supplier:</Label>
                  <div className="flex items-center gap-2">
                    <Select value={supplier} onValueChange={setSupplier}>
                      <SelectTrigger id="supplier" className="w-full h-8 bg-background">
                        <SelectValue placeholder="Select Supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.filter(s => s.id).map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><UserPlus className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Pencil className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <Label htmlFor="account-paid-from" className="text-right pr-4">Account paid from:</Label>
                  <Select value={accountPaidFrom} onValueChange={setAccountPaidFrom}>
                    <SelectTrigger id="account-paid-from" className="w-full h-8 bg-background">
                      <SelectValue placeholder="Select Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.filter(acc => acc.id).map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.account_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label htmlFor="ref-num" className="text-right pr-4">Reference number:</Label>
                  <div className="flex items-center w-full gap-2">
                    <Input id="ref-num" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} className="flex-1 h-8 bg-background" />
                    <Label htmlFor="check-no" className="whitespace-nowrap">Check no.:</Label>
                    <Input id="check-no" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)} className="w-16 h-8 bg-background" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="grid grid-cols-[120px_1fr] gap-y-3 items-center content-start">
                  <Label htmlFor="method" className="text-right pr-4">Method:</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger id="method" className="w-full h-8 bg-background">
                      <SelectValue placeholder="Cash" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label htmlFor="amount" className="text-right pr-4">Amount:</Label>
                  <div className="relative w-full">
                    <span className="absolute left-2 top-1.5 text-xs">₱</span>
                    <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-6 h-8 text-right bg-background" />
                  </div>

                  <Label htmlFor="memo" className="text-right pr-4 self-start pt-2">Journal memo:</Label>
                  <Textarea id="memo" value={journalMemo} onChange={(e) => setJournalMemo(e.target.value)} className="w-full min-h-[60px] bg-background" />
                </div>

              </div>
            </fieldset>

            {/* Bills Section */}
            <fieldset className="border rounded-md p-4 bg-muted/10 shadow-sm h-[300px] flex flex-col">
              <legend className="text-sm font-semibold px-2 -ml-2 text-foreground">Bills</legend>

              <div className="mb-2 text-sm">
                Unapplied amount remaining: <span className="font-bold">₱{amount}</span>
              </div>

              <div className="flex-1 border rounded overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[80px]">Bill #</TableHead>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead className="w-[100px]">Date Due</TableHead>
                      <TableHead className="w-[100px] text-right">Total</TableHead>
                      <TableHead className="w-[100px] text-right">Due</TableHead>
                      <TableHead className="w-[100px] text-right">Applied</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingBills ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          Loading bills...
                        </TableCell>
                      </TableRow>
                    ) : bills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No bills found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>{bill.id.slice(0, 8)}</TableCell>
                          <TableCell>{format(new Date(bill.date), 'MM/dd/yyyy')}</TableCell>
                          <TableCell>{format(new Date(bill.dueDate), 'MM/dd/yyyy')}</TableCell>
                          <TableCell className="text-right">₱{Number(bill.total).toFixed(2)}</TableCell>
                          <TableCell className="text-right">₱{Number(bill.due).toFixed(2)}</TableCell>
                          <TableCell className="text-right">₱{Number(bill.applied).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </fieldset>

          </div>
        </ScrollArea>
        <DialogFooter className="p-2 border-t bg-background flex justify-center sm:justify-center gap-2">
          <Button className="w-[100px] h-8 border-blue-500 text-blue-600 hover:bg-blue-50" variant="outline">Record</Button>
          <Button className="w-[100px] h-8" variant="outline" onClick={() => closeDialog('enter-payments-of-accounts-payable')}>Cancel</Button>
          <Button className="w-[100px] h-8" variant="outline">Help</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
