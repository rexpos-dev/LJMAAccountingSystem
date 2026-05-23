"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/layout/dialog-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarIcon, 
  UserPlus, 
  Pencil, 
  Banknote, 
  X, 
  Wallet, 
  History, 
  ClipboardCheck, 
  Info,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Building2,
  ChevronRight,
  ArrowDownRight,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import format from "@/lib/date-format";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useBankAccounts } from "@/hooks/use-accounts";
import { useSuppliers } from "@/hooks/use-suppliers";
import { useToast } from "@/hooks/use-toast";

export function EnterPaymentsOfAccountsPayableDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [supplier, setSupplier] = useState<string>("");
  const [accountPaidFrom, setAccountPaidFrom] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [checkNumber, setCheckNumber] = useState<string>("1");
  const [method, setMethod] = useState<string>("Cash");
  const [amount, setAmount] = useState<string>("0.00");
  const [journalMemo, setJournalMemo] = useState<string>("");

  const [bills, setBills] = useState<any[]>([]);
  const [loadingBills, setLoadingBills] = useState(false);

  const { suppliers } = useSuppliers();
  const { accounts: bankAccounts } = useBankAccounts();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billId, setBillId] = useState<string | null>(null);
  const [liabilityAccounts, setLiabilityAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLiabilityAccounts = async () => {
      try {
        const res = await fetch("/api/accounts");
        if (res.ok) {
          const data = await res.json();
          const liabilities = data.filter((acc: any) =>
            acc.account_type?.toLowerCase().includes("liabilit") ||
            acc.header?.toLowerCase().includes("liabilit") ||
            acc.account_category?.toLowerCase().includes("liabilit")
          );
          setLiabilityAccounts(liabilities);
        }
      } catch (error) {
        console.error("Failed to fetch liability accounts", error);
      }
    };
    fetchLiabilityAccounts();
  }, []);

  useEffect(() => {
    if (openDialogs["enter-payments-of-accounts-payable"]) {
      const data = getDialogData("enter-payments-of-accounts-payable");
      if (data) {
        if (data.supplierId) {
          setSupplier(data.supplierId);
        }
        if (data.billId) {
          setBillId(data.billId);
        } else {
          setBillId(null);
        }
        if (data.amount !== undefined && data.amount !== null) {
          setAmount(Number(data.amount).toFixed(2));
        }
      }
    }
  }, [openDialogs["enter-payments-of-accounts-payable"], getDialogData]);

  useEffect(() => {
    const fetchBills = async () => {
      if (!supplier) {
        setBills([]);
        return;
      }

      setLoadingBills(true);
      try {
        const res = await fetch(`/api/purchase-orders?supplierId=${supplier}&limit=10000`);
        if (res.ok) {
          const json = await res.json();
          const data = json.data || [];
          let supplierBills = data.filter((po: any) =>
            (po.status === "Approved" || po.status === "Open" || po.id === billId || po.status === "Paid")
          );

          if (billId) {
            supplierBills = supplierBills.filter((po: any) => po.id === billId);
          }

          supplierBills = supplierBills.map((po: any) => ({
            id: po.id,
            date: po.date,
            dueDate: new Date(new Date(po.date).setDate(new Date(po.date).getDate() + 30)).toISOString(),
            total: po.total,
            due: po.status === "Paid" ? 0 : po.total,
            applied: po.status === "Paid" ? 0 : (po.id === billId ? po.total : 0),
            allocationAccount: po.depositAccount || ""
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
  }, [supplier, billId]);

  const handleRecord = async () => {
    if (!accountPaidFrom) {
      toast({ title: "Error", description: "Please select a bank account to pay from.", variant: "destructive" });
      return;
    }

    const appliedBills = bills.filter(b => Number(b.applied) > 0);
    if (appliedBills.length === 0) {
      toast({ title: "Error", description: "Please apply an amount to at least one bill.", variant: "destructive" });
      return;
    }

    const bankAccount = bankAccounts.find(a => a.id === accountPaidFrom);
    if (!bankAccount) return;

    setIsSubmitting(true);
    try {
      const currentUser = "admin";
      const entries = [];
      const totalApplied = appliedBills.reduce((sum, b) => sum + Number(b.applied), 0);

      entries.push({
        date: date ? date.toISOString() : new Date().toISOString(),
        reference: referenceNumber || checkNumber || null,
        ledger: journalMemo || null,
        accountNumber: bankAccount.account_no?.toString() || null,
        accountName: bankAccount.account_name || null,
        accountDescription: bankAccount.account_description || "Bank Payment",
        debitAmount: 0,
        creditAmount: totalApplied,
        user: currentUser
      });

      for (const bill of appliedBills) {
        let liabilityAcc = liabilityAccounts.find(a => a.id === bill.allocationAccount);
        if (!liabilityAcc) {
          liabilityAcc = liabilityAccounts.find(a => a.account_name?.toLowerCase().includes("accounts payable") || a.account_name?.toLowerCase().includes("account payable"));
        }

        if (!liabilityAcc) {
          toast({ title: "Error", description: "Could not find a valid Accounts Payable liability account.", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }

        entries.push({
          date: date ? date.toISOString() : new Date().toISOString(),
          reference: referenceNumber || checkNumber || null,
          ledger: journalMemo || null,
          accountNumber: liabilityAcc?.account_no?.toString() || null,
          accountName: liabilityAcc?.account_name || null,
          accountDescription: `Payment for Bill #${bill.id.slice(0, 8)}`,
          debitAmount: Number(bill.applied),
          creditAmount: 0,
          user: currentUser
        });
      }

      const res = await fetch("/api/payables-ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entries),
      });

      if (!res.ok) throw new Error("Failed to record payment");

      const billIds = appliedBills.map(b => b.id);
      await fetch("/api/purchase-orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: billIds, status: "Paid" }),
      });

      toast({ title: "Success", description: "Payment recorded and status updated." });
      closeDialog("enter-payments-of-accounts-payable");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalApplied = bills.reduce((sum, b) => sum + Number(b.applied || 0), 0);

  return (
    <Dialog open={openDialogs["enter-payments-of-accounts-payable"]} onOpenChange={(open) => !open && closeDialog("enter-payments-of-accounts-payable")}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-400/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/20">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Settlement Protocol</DialogTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-400 border border-amber-400/20">Accounts Payable</span>
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Liability Liquidation</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
               <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Total Liquidation</span>
               <span className="text-xl font-black italic tracking-tighter text-amber-400">
                  {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount || 0))}
               </span>
            </div>
            
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Configuration */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-amber-400 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Target Node</h3>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Identification Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-bold bg-foreground/5 border-foreground/10 rounded-xl" >
                          <CalendarIcon className="mr-2 h-4 w-4 text-amber-400" />
                          {date ? format(date, "MMMM do, yyyy") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card border-foreground/10">
                        <Calendar mode="single" selected={date} onSelect={setDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Select Provider</Label>
                    <Select value={supplier} onValueChange={setSupplier}>
                      <SelectTrigger className="bg-foreground/5 border-foreground/10 rounded-xl">
                        <SelectValue placeholder="Identify provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-foreground/10">
                        {suppliers?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-400 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Funding Source</h3>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Asset Account</Label>
                    <Select value={accountPaidFrom} onValueChange={setAccountPaidFrom}>
                      <SelectTrigger className="bg-foreground/5 border-foreground/10 rounded-xl text-blue-400">
                        <SelectValue placeholder="Debit source" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-foreground/10">
                        {bankAccounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.account_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Method</Label>
                      <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger className="bg-foreground/5 border-foreground/10 rounded-xl">
                          <SelectValue placeholder="Cash" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-foreground/10">
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Check">Check</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Check #</Label>
                      <Input value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)}
                        className="bg-foreground/5 border-foreground/10 h-11 rounded-xl" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Allocation Matrix */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Obligation Allocation</h3>
                  </div>
                  {loadingBills && <Activity className="h-4 w-4 text-primary animate-pulse" />}
                </div>

                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <Table>
                    <TableHeader className="bg-foreground/5">
                      <TableRow className="border-foreground/5 hover:bg-transparent">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Reference</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Age/Date</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right">Total</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right text-red-400/60">Outstanding</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right">Allocation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!supplier ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center text-foreground/10 gap-2">
                              <ShieldCheck className="h-12 w-12 opacity-20" />
                              <p className="text-xs font-black uppercase tracking-widest">Awaiting Provider Selection</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : bills.length === 0 && !loadingBills ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center text-emerald-400/20 gap-2">
                              <ClipboardCheck className="h-12 w-12 opacity-20" />
                              <p className="text-xs font-black uppercase tracking-widest">No Outstanding Liabilities</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        bills.map((bill) => (
                          <TableRow key={bill.id} className="border-foreground/5 hover:bg-foreground/[0.02] group">
                            <TableCell className="font-mono text-[10px] text-foreground/40">
                              #{bill.id.slice(0, 8)}
                            </TableCell>
                            <TableCell className="">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground/60">{format(new Date(bill.date), "MMM dd, yyyy")}</span>
                                <span className="text-[10px] text-foreground/20 uppercase font-black">Due: {format(new Date(bill.dueDate), "MMM dd")}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold text-foreground/60">
                              ₱{Number(bill.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-black italic text-red-400">
                              ₱{Number(bill.due).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Input type="number" className="w-28 text-right bg-foreground/5 border-transparent focus:ring-amber-400/20 text-amber-400 font-black" value={bill.applied} onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setBills(prev => prev.map(b => b.id === bill.id ? { ...b, applied: val } : b));
                                  }}
                                />
                                {Number(bill.applied) >= Number(bill.due) && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl">
                   <div className="flex items-center justify-between mb-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Transaction Documentation</Label>
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Internal Ledger</span>
                   </div>
                   <Textarea value={journalMemo} onChange={(e) => setJournalMemo(e.target.value)}
                      className="bg-foreground/5 border-foreground/10 rounded-xl min-h-[100px] resize-none text-sm"
                      placeholder="Add settlement context, authorization codes, or notes..."
                   />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Allocated Capital</span>
              <span className={cn(
                "text-xl font-black italic tracking-tighter",
                totalApplied > Number(amount || 0) ? "text-red-500" : "text-emerald-400"
              )}>
                ₱{totalApplied.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            {totalApplied > 0 && (
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                  <Activity className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Allocation Ready</span>
               </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => closeDialog("enter-payments-of-accounts-payable")}
              className="px-6 h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-xs"
            >
              Abort
            </Button>
            <Button onClick={handleRecord} disabled={isSubmitting || totalApplied === 0} className="px-10 rounded-xl bg-amber-400 hover:bg-amber-400/90 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-400/20 transition-all gap-2" >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {isSubmitting ? "Finalizing..." : "Execute Settlement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
