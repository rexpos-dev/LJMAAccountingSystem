"use client";

import { useState, useMemo, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  Printer,
  Save,
  Search,
  RefreshCw,
  LayoutDashboard,
  Filter,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  Download,
  FileText,
  Info,
  History,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  DeleteTransactionGuardDialog,
  type DeleteGuardPayload,
} from "@/components/transactions/delete-transaction-guard-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import format from "@/lib/date-format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/layout/dialog-context";
import type { Transaction } from "@/types/transaction";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function ViewJournalDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const { toast } = useToast();

  const [selectedEntry, setSelectedEntry] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [referenceFilter, setReferenceFilter] = useState("");
  const [accountNumberFilter, setAccountNumberFilter] = useState("");
  const [accountNameFilter, setAccountNameFilter] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const hasActiveFilters = useMemo(() => {
    return !!(referenceFilter || accountNameFilter || fromDate || toDate);
  }, [referenceFilter, accountNameFilter, fromDate, toDate]);

  // --- Delete guard state ---
  const [deleteGuardMode, setDeleteGuardMode] = useState<"confirm" | "blocked" | null>(null);
  const [deleteGuardPayload, setDeleteGuardPayload] = useState<DeleteGuardPayload | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const [transResponse, payablesResponse] = await Promise.all([
        fetch("/api/transactions").catch(() => null),
        fetch("/api/payables-ledger").catch(() => null),
      ]);

      let combinedData: any[] = [];

      if (transResponse && transResponse.ok) {
        const data = await transResponse.json();
        const transformedData = Array.isArray(data)
          ? data.map((t: any) => ({
              ...t,
              seq: t.seq ?? 0,
              date: t.date ? new Date(t.date) : null,
              dateMatured: t.dateMatured ? new Date(t.dateMatured) : null,
            }))
          : [];
        combinedData = [...combinedData, ...transformedData];
      }

      if (payablesResponse && payablesResponse.ok) {
        const pData = await payablesResponse.json();
        const transformedPayables = Array.isArray(pData)
          ? pData.map((p: any) => ({
              id: p.id,
              seq: 0,
              date: p.date ? new Date(p.date) : null,
              transNo: p.reference,
              ledger: p.ledger,
              accountNumber: p.accountNumber,
              accountName: p.accountName,
              code: "",
              particulars: p.accountDescription,
              debit: p.debitAmount,
              credit: p.creditAmount,
              user: p.user,
            }))
          : [];
        combinedData = [...combinedData, ...transformedPayables];
      }

      // Sort by date descending
      combinedData.sort((a, b) => {
        const dateA = a.date ? a.date.getTime() : 0;
        const dateB = b.date ? b.date.getTime() : 0;
        return dateB - dateA;
      });

      setTransactions(combinedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive",
      });
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (openDialogs["view-journal"]) {
      fetchTransactions();
    }
  }, [openDialogs["view-journal"]]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchTransactions();
    };
    window.addEventListener("journal-refresh", handleRefresh);
    return () => {
      window.removeEventListener("journal-refresh", handleRefresh);
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((transaction) => {
      const refMatch =
        !referenceFilter ||
        (transaction.transNo &&
          transaction.transNo.toLowerCase().includes(referenceFilter.toLowerCase()));
      const accNumMatch =
        !accountNumberFilter ||
        (transaction.accountNumber &&
          transaction.accountNumber.toLowerCase().includes(accountNumberFilter.toLowerCase()));
      const accNameMatch =
        !accountNameFilter ||
        (transaction.accountName &&
          transaction.accountName.toLowerCase().includes(accountNameFilter.toLowerCase()));

      const getSafeDate = (d: any) => {
        if (!d) return null;
        if (d instanceof Date) return d;
        if (d.toDate && typeof d.toDate === "function") return d.toDate();
        return new Date(d);
      };

      const rawDate = getSafeDate(transaction.date);
      const transDate = rawDate ? new Date(rawDate) : null;
      if (transDate) transDate.setHours(0, 0, 0, 0);

      const start = fromDate ? new Date(fromDate) : null;
      if (start) start.setHours(0, 0, 0, 0);

      const end = toDate ? new Date(toDate) : null;
      if (end) end.setHours(0, 0, 0, 0);

      const dateMatch =
        (!start || (transDate && transDate >= start)) &&
        (!end || (transDate && transDate <= end));

      return refMatch && accNumMatch && accNameMatch && dateMatch;
    });
  }, [transactions, referenceFilter, accountNumberFilter, accountNameFilter, fromDate, toDate]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / itemsPerPage);
  }, [filteredTransactions, itemsPerPage]);

  const stats = useMemo(() => {
    const totalDebit = filteredTransactions.reduce((sum, t) => sum + (t.debit || 0), 0);
    const totalCredit = filteredTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
    return { totalDebit, totalCredit };
  }, [filteredTransactions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, referenceFilter, accountNumberFilter, accountNameFilter, fromDate, toDate]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const formatTimestamp = (timestamp: Timestamp | Date | string | null) => {
    if (!timestamp) return "N/A";
    try {
      let date: Date;
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else {
        date = (timestamp as any).toDate();
      }
      if (Number.isNaN(date.getTime())) return "Invalid Date";
      return format(date, "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount?: number | null) => {
    if (amount === undefined || amount === null) return "";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const EDITABLE_LEDGERS = ['General Ledger', 'Payments Ledger', 'Receipts Ledger', 'Sales Ledger', 'Purchases Ledger'];

  const isSelectedEditable = selectedEntry
    ? EDITABLE_LEDGERS.includes(selectedEntry.ledger || '')
    : false;

  const handleRowClick = (entry: Transaction) => {
    setSelectedEntry(entry);
  };

  const handleViewTransaction = (entry: Transaction) => {
    setDialogData('view-transaction', entry);
    openDialog('view-transaction');
  };

  const handleEditClick = () => {
    if (!selectedEntry) return;
    if (!isSelectedEditable) {
      toast({
        title: "Edit Restricted",
        description: `Transactions from "${selectedEntry.ledger}" cannot be edited here. Please use the originating module.`,
        variant: "destructive",
      });
      return;
    }
    setDialogData('edit-transaction', selectedEntry);
    openDialog('edit-transaction');
  };

  const handleRowDoubleClick = (entry: Transaction) => {
    setSelectedEntry(entry);
    if (!EDITABLE_LEDGERS.includes(entry.ledger || '')) {
      toast({
        title: "Edit Restricted",
        description: `Transactions from "${entry.ledger}" cannot be edited here.`,
        variant: "destructive",
      });
      return;
    }
    setDialogData('edit-transaction', entry);
    openDialog('edit-transaction');
  };

  const handleDeleteClick = () => {
    if (!selectedEntry) return;
    setDeleteGuardPayload(null);
    setDeleteGuardMode("confirm");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEntry?.id) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/transactions?id=${selectedEntry.id}`, {
        method: "DELETE",
      });

      if (res.status === 409) {
        const data: DeleteGuardPayload = await res.json();
        setDeleteGuardPayload(data);
        setDeleteGuardMode("blocked");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete transaction");
      }

      toast({
        title: "Transaction Deleted",
        description: `Transaction "${selectedEntry.transNo || selectedEntry.id}" has been successfully removed.`,
      });
      setDeleteGuardMode(null);
      setSelectedEntry(null);
      fetchTransactions();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
      setDeleteGuardMode(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={openDialogs["view-journal"]} onOpenChange={() => closeDialog("view-journal")}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
          {/* Premium Header */}
          <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 backdrop-blur-md flex items-center justify-between relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground">General Journal</DialogTitle>
                <p className="text-sm text-foreground/40 font-medium tracking-wide mt-0.5">Explore and audit financial transactions history</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2">
               <div className="px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block">Total Records</span>
                    <span className="text-sm font-bold text-foreground uppercase tracking-tighter">{filteredTransactions.length} Entries</span>
                  </div>
                  <div className="h-8 w-px bg-foreground/10" />
                  <Button variant="ghost" size="icon" className="w-8 rounded-lg text-foreground/60 hover:bg-foreground/10 hover:text-foreground transition-all" onClick={fetchTransactions} disabled={isLoadingTransactions} >
                    <RefreshCw className={cn("h-4 w-4", isLoadingTransactions && "animate-spin")} />
                  </Button>
               </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Stats & Actions Bar */}
            <div className="px-8 py-4 bg-foreground/[0.02] border-b border-foreground/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 rounded-full bg-blue-500/50" />
                  <div>
                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Total Debit</p>
                    <p className="text-lg font-black text-blue-400 italic tracking-tighter">{formatCurrency(stats.totalDebit)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 rounded-full bg-orange-500/50" />
                  <div>
                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em]">Total Credit</p>
                    <p className="text-lg font-black text-orange-400 italic tracking-tighter">{formatCurrency(stats.totalCredit)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => openDialog('journal-entry')}
                  className="bg-primary text-black font-black px-4 rounded-xl hover:bg-primary/90 transition-all h-10 text-xs uppercase tracking-widest"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
                
                <div className="h-6 w-px bg-foreground/10 mx-2" />
                
                <div className="flex bg-foreground/5 p-1 rounded-xl border border-foreground/10">
                  <Button variant="ghost" size="sm" disabled={!selectedEntry} onClick={() => selectedEntry && handleViewTransaction(selectedEntry)}
                    className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground hover:bg-foreground/10"
                  >
                    <Eye className="h-3.5 w-3.5 mr-2" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" disabled={!selectedEntry || !isSelectedEditable} onClick={handleEditClick}
                    className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground hover:bg-foreground/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={selectedEntry && !isSelectedEditable ? `Cannot edit: transactions from "${selectedEntry.ledger}" are read-only` : undefined}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" disabled={!selectedEntry} onClick={handleDeleteClick} className="rounded-lg px-3 text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-500/10" >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="px-8 py-4 bg-foreground/[0.01] flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-all duration-200 group"
                >
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest">System Filter</span>
                  <div className="flex items-center justify-center w-5 h-5 rounded-md bg-foreground/5 border border-foreground/10 group-hover:bg-foreground/10 transition-colors">
                    {isFilterExpanded ? (
                      <ChevronUp className="h-3 w-3 text-foreground/60" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-foreground/60" />
                    )}
                  </div>
                </button>

                {!isFilterExpanded && hasActiveFilters && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md animate-pulse">
                      Filters Active
                    </span>
                    <span className="text-[10px] font-bold text-foreground/45 max-w-[400px] truncate">
                      {[
                        referenceFilter && `Ref: ${referenceFilter}`,
                        accountNameFilter && `Account: ${accountNameFilter}`,
                        fromDate && `From: ${fromDate}`,
                        toDate && `To: ${toDate}`
                      ].filter(Boolean).join(" | ")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"
                      onClick={() => {
                        setFromDate("");
                        setToDate("");
                        setReferenceFilter("");
                        setAccountNumberFilter("");
                        setAccountNameFilter("");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {isFilterExpanded && (
                <div className="glass-card p-6 border-foreground/5 grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Reference No.</Label>
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                      <Input placeholder="Search ID..." className="pl-9 bg-foreground/5 border-foreground/10 focus:border-primary/50 transition-all rounded-xl" value={referenceFilter} onChange={(e) => setReferenceFilter(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Account Name</Label>
                    <div className="relative group">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                      <Input placeholder="Find account..." className="pl-9 bg-foreground/5 border-foreground/10 focus:border-primary/50 transition-all rounded-xl" value={accountNameFilter} onChange={(e) => setAccountNameFilter(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">From Date</Label>
                    <Input type="date" className="bg-foreground/5 border-foreground/10 focus:border-primary/50 transition-all rounded-xl text-foreground/80" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">To Date</Label>
                    <Input type="date" className="bg-foreground/5 border-foreground/10 focus:border-primary/50 transition-all rounded-xl text-foreground/80" value={toDate} onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" className="w-full rounded-xl border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground" onClick={() => {
                          setFromDate("");
                          setToDate("");
                          setReferenceFilter("");
                          setAccountNumberFilter("");
                          setAccountNameFilter("");
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Table Area */}
            <div className="flex-1 px-8 pb-4 min-h-0">
              <div className="h-full border border-foreground/5 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="relative w-full rounded-xl border border-foreground/5 bg-card/20 backdrop-blur-sm">
                    <table className="w-full caption-bottom text-sm">
                      <TableHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-foreground/10">
                        <TableRow className="border-foreground/5 hover:bg-transparent">
                          <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Date</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Reference</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Ledger</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Account Name</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Particulars</TableHead>
                          <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Debit</TableHead>
                          <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Credit</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">User</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingTransactions ? (
                          <TableRow className="border-foreground/5">
                            <TableCell colSpan={8} className="h-64 text-center">
                               <div className="flex flex-col items-center gap-4 opacity-40">
                                 <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                 <span className="text-xs font-black uppercase tracking-widest">Querying database...</span>
                               </div>
                            </TableCell>
                          </TableRow>
                        ) : paginatedTransactions.length > 0 ? (
                          paginatedTransactions.map((entry) => (
                            <TableRow
                              key={entry.id}
                              onClick={() => handleRowClick(entry)}
                              onDoubleClick={() => handleRowDoubleClick(entry)}
                              className={cn(
                                "border-foreground/5 group cursor-pointer transition-all duration-200",
                                selectedEntry?.id === entry.id ? "bg-primary/10" : "hover:bg-foreground/5"
                              )}
                            >
                              <TableCell className="text-xs text-foreground/60 group-hover:text-foreground">{formatTimestamp(entry.date)}</TableCell>
                              <TableCell className="text-xs font-bold text-foreground tracking-tighter uppercase">{entry.transNo}</TableCell>
                              <TableCell className="text-[10px] text-foreground/40 uppercase font-bold">{entry.ledger}</TableCell>
                              <TableCell className="max-w-[180px]">
                                <p className="text-xs font-bold text-foreground/80 truncate group-hover:text-foreground transition-colors">{entry.accountName || "N/A"}</p>
                                <p className="text-[10px] text-foreground/30 font-mono tracking-tighter">{entry.accountNumber}</p>
                              </TableCell>
                              <TableCell className="max-w-[200px]">
                                <p className="text-xs text-foreground/40 truncate group-hover:text-foreground/60 transition-colors">{entry.particulars}</p>
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-blue-400 italic">
                                 {entry.debit ? `₱${entry.debit.toLocaleString()}` : "—"}
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-orange-400 italic">
                                 {entry.credit ? `₱${entry.credit.toLocaleString()}` : "—"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-foreground/5 flex items-center justify-center text-[8px] font-black text-foreground/40 uppercase border border-foreground/10 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                                    {entry.user?.[0] || "?"}
                                  </div>
                                  <span className="text-[10px] font-black uppercase text-foreground/30 tracking-widest">{entry.user || "System"}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="border-foreground/5">
                            <TableCell colSpan={8} className="h-64 text-center">
                              <div className="flex flex-col items-center gap-3 opacity-20">
                                <History className="h-12 w-12" />
                                <p className="text-xs font-black tracking-widest uppercase">No matching journal entries found</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </table>
                  </div>
                </ScrollArea>

                {/* Custom Pagination */}
                <div className="px-6 py-4 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Density</span>
                        <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                           <SelectTrigger className="h-8 w-20 bg-foreground/5 border-foreground/10 rounded-lg text-xs font-bold">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-card border-foreground/10">
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                           </SelectContent>
                        </Select>
                      </div>
                      <div className="h-4 w-px bg-foreground/10" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                      </span>
                   </div>

                   <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="w-8 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground/60 hover:bg-foreground/10 disabled:opacity-20" onClick={handlePreviousPage} disabled={currentPage === 1} >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="px-4 h-8 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                         <span className="text-xs font-black text-primary">PAGE {currentPage}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="w-8 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground/60 hover:bg-foreground/10 disabled:opacity-20" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteTransactionGuardDialog
        mode={deleteGuardMode}
        transaction={selectedEntry}
        blockedPayload={deleteGuardPayload}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteGuardMode(null)}
      />
    </>
  );
}
