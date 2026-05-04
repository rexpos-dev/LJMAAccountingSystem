"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from '@/components/layout/dialog-context';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { 
  CalendarIcon, 
  UserPlus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  ShieldCheck, 
  Info, 
  ChevronRight,
  Plus,
  CreditCard,
  Building2,
  FileText,
  Calculator,
  Activity,
  ArrowUpRight,
  ClipboardCheck,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import format from "@/lib/date-format";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAccounts } from "@/hooks/use-accounts";
import { useSuppliers } from "@/hooks/use-suppliers";
import { useToast } from "@/hooks/use-toast";

interface AllocationRow {
  id: string;
  account_no: string;
  account_name: string;
  description: string;
  amount: string;
  type: "CR" | "DR";
}

export function EnterAccountsPayableDialog() {
  const { openDialogs, closeDialog, getDialogData, openDialog } = useDialog();
  const { data: accounts = [] } = useAccounts();
  const { suppliers = [] } = useSuppliers();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [supplierAddress, setSupplierAddress] = useState<string>("");
  const [selectedApAccount, setSelectedApAccount] = useState<string>("");
  const [accountBalance, setAccountBalance] = useState<string>("₱0.00");
  const [amount, setAmount] = useState<string>("₱0.00");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [memo, setMemo] = useState("Purchases");

  useEffect(() => {
    const loadPurchaseOrder = async (id: string) => {
      try {
        const res = await fetch(`/api/purchase-orders/${id}`);
        if (res.ok) {
          const po = await res.json();

          setSelectedSupplierId(po.supplierId);
          handleSupplierChange(po.supplierId);

          setDate(new Date(po.date));
          setAmount(`₱${po.total.toFixed(2)}`);
          setReferenceNumber(po.orderNumber || "");
          setMemo(po.comments || "Purchases");

          if (po.depositAccount) {
            const acc = accounts.find((a: any) => a.id === po.depositAccount);
            if (acc && acc.account_no) {
              setSelectedApAccount(acc.account_no.toString());
              setAccountBalance(`₱${(acc.balance || 0).toFixed(2)}`);
            }
          }

          if (po.items && po.items.length > 0) {
            const newAllocations = po.items.map((item: any, index: number) => ({
              id: `po-item-${item.id || index}`,
              account_no: "",
              account_name: "",
              description: item.itemDescription || item.product?.name || "",
              amount: item.amount ? item.amount.toFixed(2) : (item.total ? item.total.toFixed(2) : "0.00"),
              type: "DR"
            }));
            setAllocations(newAllocations);
          }
        }
      } catch (error) {
        console.error("Failed to fetch purchase order", error);
      }
    };

    if (openDialogs["enter-ap"]) {
      const data = getDialogData("enter-ap");
      if (data?.payableId) {
        loadPurchaseOrder(data.payableId);
      } else {
        setSelectedSupplierId("");
        setSupplierAddress("");
        setDate(new Date());
        setDueDate(new Date());
        setAmount("₱0.00");
        setReferenceNumber("");
        setMemo("Purchases");
        setAllocations([]);
      }
    }
  }, [openDialogs["enter-ap"], getDialogData, accounts]);

  const handleSupplierChange = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    const supplier = suppliers.find((s: any) => s.id === supplierId);
    if (supplier) {
      setSupplierAddress(supplier.address || "");
    }
  };

  const handleAddAllocation = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setAllocations([
      ...allocations,
      {
        id: newId,
        account_no: "",
        account_name: "",
        description: "",
        amount: "0.00",
        type: "DR",
      }
    ]);
  };

  const handleAccountChange = (id: string, accountNumber: string) => {
    const account = accounts.find((acc: any) => acc.account_no?.toString() === accountNumber);
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, account_no: accountNumber, account_name: account?.account_name || "" }
          : allocation
      )
    );
  };

  const handleNameChange = (id: string, accountName: string) => {
    const account = accounts.find((acc: any) => acc.account_name === accountName);
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, account_no: account?.account_no?.toString() ?? "", account_name: accountName }
          : allocation
      )
    );
  };

  const handleAmountChange = (id: string, value: string) => {
    setAllocations(prev =>
      prev.map(allocation => (allocation.id === id ? { ...allocation, amount: value } : allocation))
    );
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setAllocations(prev =>
      prev.map(allocation => (allocation.id === id ? { ...allocation, description: value } : allocation))
    );
  };

  const handleDeleteAllocation = (id: string) => {
    setAllocations(prev => prev.filter(allocation => allocation.id !== id));
  };

  const handleRecord = async () => {
    if (!date || allocations.length === 0) {
      toast({
        title: "Incomplete Data",
        description: "Ensure date is selected and at least one allocation is added.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const currentUser = "admin";
      const ledgerEntries = allocations.map(allocation => {
        const debit = allocation.type === "DR" ? parseFloat(allocation.amount) || 0 : 0;
        const credit = allocation.type === "CR" ? parseFloat(allocation.amount) || 0 : 0;

        return {
          date: date.toISOString(),
          reference: referenceNumber || null,
          ledger: memo || null,
          accountNumber: allocation.account_no || null,
          accountName: allocation.account_name || null,
          accountDescription: allocation.description || null,
          debitAmount: debit,
          creditAmount: credit,
          user: currentUser
        };
      });

      const res = await fetch("/api/payables-ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ledgerEntries),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Accounts Payable recorded successfully." });
        closeDialog("enter-ap");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to record transaction");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApAccountChange = (accountNumber: string) => {
    setSelectedApAccount(accountNumber);
    const account = accounts.find((acc: any) => acc.account_no?.toString() === accountNumber);
    if (account && account.balance !== undefined) {
      setAccountBalance(`₱${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
    } else {
      setAccountBalance("₱0.00");
    }
  };

  const totalAllocated = allocations.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  return (
    <Dialog open={openDialogs["enter-ap"]} onOpenChange={(open) => !open && closeDialog("enter-ap")}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-400/20 text-blue-400 border border-blue-400/20">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">Accounts Payable Entry</DialogTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-400/20 text-blue-400 border border-blue-400/20">Liability Protocol</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Transaction Module v2.0</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => closeDialog("enter-ap")}
            className="relative z-10 p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-8 space-y-8">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calculator className="h-12 w-12 text-blue-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total Obligation</p>
                <p className="text-3xl font-black italic tracking-tighter text-blue-400">{amount}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Building2 className="h-12 w-12 text-amber-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Control Account Balance</p>
                <p className="text-3xl font-black italic tracking-tighter text-amber-400">{accountBalance}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FileText className="h-12 w-12 text-emerald-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Allocated Value</p>
                <p className="text-3xl font-black italic tracking-tighter text-emerald-400">
                  ₱{totalAllocated.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Vendor Intelligence */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-blue-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Vendor Identification</h3>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Invoice Timestamp</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-white/5 border-white/10 hover:bg-white/10 text-white h-11 rounded-xl">
                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                            <span className="font-bold text-xs">{date ? format(date, "MMM dd, yyyy") : "Select Date"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="rounded-xl border-0" />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Settlement Target</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-white/5 border-white/10 hover:bg-white/10 text-white h-11 rounded-xl">
                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                            <span className="font-bold text-xs">{dueDate ? format(dueDate, "MMM dd, yyyy") : "Select Date"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
                          <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="rounded-xl border-0" />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Primary Provider</Label>
                    <div className="flex gap-2">
                      <Select value={selectedSupplierId} onValueChange={handleSupplierChange}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 rounded-xl text-xs font-bold">
                          <SelectValue placeholder="Identify Vendor Node" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {suppliers.map((s: any) => (
                            <SelectItem key={s.id} value={s.id} className="text-xs font-bold uppercase">{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-xl border-white/10 hover:bg-blue-400/20 hover:text-blue-400 transition-all" onClick={() => openDialog("add-customer")}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Entity Node Address</Label>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl min-h-[100px] text-xs font-medium text-white/40 italic">
                      {supplierAddress || "Awaiting vendor identification..."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Fiscal Parameters */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Allocation Protocol</h3>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">System Reference</Label>
                      <Input 
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-11 rounded-xl font-mono text-xs" 
                        placeholder="REF-000000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">AP Control Account</Label>
                      <Select value={selectedApAccount} onValueChange={handleApAccountChange}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 rounded-xl text-xs font-bold uppercase">
                          <SelectValue placeholder="Liability Node" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {accounts.filter((a: any) => a.account_type === "Liability").map((a: any) => (
                            <SelectItem key={a.id} value={a.account_no?.toString() || ""} className="text-xs font-bold uppercase">{a.account_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Transaction Ledger Memo</Label>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Internal Sync</span>
                    </div>
                    <Textarea 
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="bg-white/5 border-white/10 text-white rounded-xl min-h-[142px] resize-none text-sm placeholder:text-white/10"
                      placeholder="Add line-item particulars and audit notes..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Allocation Matrix */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Expense Distribution Matrix</h3>
                </div>
                <Button 
                  onClick={handleAddAllocation}
                  variant="outline" 
                  className="h-10 rounded-xl bg-emerald-400/10 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Add Distribution Node</span>
                </Button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12 w-32">GL Code</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12">Account Node</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12">Particulars</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12 text-right w-40">Allocated Value</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12 text-center w-24">Type</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-white/20 gap-2">
                            <Activity className="h-8 w-8 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Distribution Matrix</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocations.map((row) => (
                        <TableRow key={row.id} className="border-white/5 hover:bg-white/[0.02] group transition-colors">
                          <TableCell className="py-4">
                            <Select value={row.account_no} onValueChange={(v) => handleAccountChange(row.id, v)}>
                              <SelectTrigger className="bg-transparent border-0 shadow-none text-white font-mono focus:ring-0 h-8 text-xs">
                                <SelectValue placeholder="CODE" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10 text-white">
                                {accounts.map((a: any) => (
                                  <SelectItem key={a.id} value={a.account_no?.toString() || ""}>{a.account_no}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-4">
                            <Select value={row.account_name} onValueChange={(v) => handleNameChange(row.id, v)}>
                              <SelectTrigger className="bg-transparent border-0 shadow-none text-white font-black focus:ring-0 h-8 uppercase tracking-tight text-[11px] italic">
                                <SelectValue placeholder="SELECT ACCOUNT" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10 text-white">
                                {accounts.map((a: any) => (
                                  <SelectItem key={a.id} value={a.account_name} className="text-[11px] font-bold uppercase">{a.account_name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-4">
                            <Input 
                              value={row.description}
                              onChange={(e) => handleDescriptionChange(row.id, e.target.value)}
                              className="bg-transparent border-0 shadow-none text-white/60 focus:ring-0 h-8 text-xs placeholder:text-white/10 italic"
                              placeholder="Describe line activity..."
                            />
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <Input 
                              type="number"
                              value={row.amount}
                              onChange={(e) => handleAmountChange(row.id, e.target.value)}
                              className="bg-transparent border-0 shadow-none text-right text-emerald-400 focus:ring-0 h-8 font-black italic text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex justify-center">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                                row.type === "DR" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : "bg-red-400/10 text-red-400 border-red-400/20"
                              )}>
                                {row.type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right pr-6">
                            <button 
                              onClick={() => handleDeleteAllocation(row.id)}
                              className="p-2 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-white/5 bg-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Reconciliation Status</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  totalAllocated > 0 ? "bg-emerald-400 animate-pulse" : "bg-white/10"
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  {totalAllocated > 0 ? "Matrix Validated" : "Awaiting Input"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Allocated Liquidity</span>
              <span className="text-xl font-black italic tracking-tighter text-emerald-400">
                ₱{totalAllocated.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => closeDialog("enter-ap")}
              className="px-6 h-12 rounded-xl border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
            >
              Abort Entry
            </Button>
            <Button 
              onClick={handleRecord}
              disabled={isSubmitting || totalAllocated === 0}
              className="px-10 h-12 rounded-xl bg-blue-400 hover:bg-blue-400/90 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-400/20 transition-all gap-2"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {isSubmitting ? "Finalizing Ledger..." : "Commit To Journal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
