'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import {
    Plus,
    X,
    Pencil,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    RefreshCw,
    Banknote,
    Search,
    Filter,
    Calendar as CalendarIcon,
    ArrowUpRight,
    Activity,
    ShieldCheck,
    MoreHorizontal,
    Download,
    Eye,
    Trash2
} from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Payable {
    id: string;
    date: string;
    dueDate: string;
    reference: string;
    poReference: string;
    payableNo: string;
    supplierName: string;
    supplierId: string;
    amount: number;
    dueAmount: number;
    status: string;
}

export default function AccountsPayableListDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const [payables, setPayables] = useState<Payable[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Filters
    const [period, setPeriod] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [suppliers, setSuppliers] = useState<any[]>([]);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        if (openDialogs['accounts-payable']) {
            fetchPayables();
            fetchSuppliers();
        }
    }, [openDialogs['accounts-payable'], page, pageSize, period, supplierFilter, startDate, endDate]);

    // Fetch Payables
    const fetchPayables = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: pageSize.toString(),
                offset: ((page - 1) * pageSize).toString(),
                status: 'all',
                supplierId: supplierFilter === 'all' ? '' : supplierFilter,
                startDate: period === 'all' ? '' : startDate,
                endDate: period === 'all' ? '' : endDate,
            });

            const res = await fetch(`/api/purchase-orders?${params.toString()}`);
            if (res.ok) {
                const result = await res.json();
                const data = result.data || [];
                setTotalCount(result.totalCount || 0);

                const mappedData: Payable[] = data.map((po: any) => ({
                    id: po.id,
                    date: po.date,
                    dueDate: new Date(new Date(po.date).setDate(new Date(po.date).getDate() + 30)).toISOString(),
                    reference: po.id.slice(0, 8),
                    poReference: po.orderNumber || po.id.slice(0, 6),
                    payableNo: `PRC${(po.orderNumber || po.id.slice(0, 5)).replace(/\D/g, '')}`,
                    supplierName: po.supplier?.name || 'Unknown',
                    supplierId: po.supplierId || po.supplier?.id || '',
                    amount: po.total,
                    dueAmount: po.status === 'Paid' ? 0 : po.total,
                    status: po.status === 'Approved' ? 'Not Paid' : po.status
                }));
                setPayables(mappedData);
            }
        } catch (error) {
            console.error('Failed to fetch payables', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('/api/suppliers');
            if (res.ok) {
                const data = await res.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error('Failed to fetch suppliers', error);
        }
    };

    const handleRefresh = () => {
        fetchPayables();
        fetchSuppliers();
        toast({ title: "Refreshed", description: "Data matrix updated" });
    };

    const handleNew = () => {
        openDialog('enter-ap' as any);
    };

    const handleDelete = () => {
        toast({ title: "Command Locked", description: "Deletion protocol restricted." });
    };

    const handleEdit = () => {
        if (selectedId) {
            setDialogData('enter-ap', { payableId: selectedId });
            openDialog('enter-ap' as any);
        }
    };

    const handlePayment = () => {
        if (selectedId) {
            const selectedPayable = payables.find(p => p.id === selectedId);
            if (selectedPayable) {
                setDialogData('enter-payments-of-accounts-payable', {
                    supplierId: selectedPayable.supplierId,
                    billId: selectedId,
                    amount: selectedPayable.dueAmount
                });
            }
        }
        openDialog('enter-payments-of-accounts-payable');
    };

    const totalAmount = payables.reduce((sum, p) => sum + p.amount, 0);
    const totalDue = payables.reduce((sum, p) => sum + p.dueAmount, 0);

    return (
        <Dialog open={openDialogs['accounts-payable']} onOpenChange={() => closeDialog('accounts-payable')}>
            <DialogContent className="max-w-[1200px] p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
                {/* Premium Header */}
                <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-400/20 text-blue-400 border border-blue-400/20">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Accounts Payable Matrix</DialogTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-400/20 text-blue-400 border border-blue-400/20">Supply Chain Finance</span>
                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Real-time Obligation Tracking</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Total Outstanding</span>
                            <span className="text-xl font-black italic tracking-tighter text-red-400">
                                ₱{totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        
                    </div>
                </div>

                {/* Advanced Toolbar */}
                <div className="px-8 py-4 border-b border-foreground/5 bg-foreground/[0.02] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <Button onClick={handleNew} className="bg-blue-400 hover:bg-blue-400/90 text-black font-black uppercase tracking-widest text-[10px] px-4 rounded-xl transition-all gap-2" >
                            <Plus className="h-3.5 w-3.5" />
                            Record Obligation
                        </Button>
                        <div className="w-px h-6 bg-foreground/10 mx-2" />
                        <Button variant="ghost" disabled={!selectedId} onClick={handlePayment} className="text-foreground/60 hover:text-foreground hover:bg-foreground/10 font-black uppercase tracking-widest text-[10px] px-4 rounded-xl transition-all gap-2" >
                            <Banknote className="h-3.5 w-3.5" />
                            Settle Selected
                        </Button>
                        <Button variant="ghost" disabled={!selectedId} onClick={handleEdit} className="text-foreground/60 hover:text-foreground hover:bg-foreground/10 font-black uppercase tracking-widest text-[10px] px-4 rounded-xl transition-all gap-2" >
                            <Pencil className="h-3.5 w-3.5" />
                            Modify
                        </Button>
                        <Button variant="ghost" disabled={!selectedId} onClick={handleDelete} className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10 font-black uppercase tracking-widest text-[10px] px-4 rounded-xl transition-all gap-2" >
                            <Trash2 className="h-3.5 w-3.5" />
                            Purge
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/20 group-focus-within:text-blue-400 transition-colors" />
                            <Input placeholder="Search Reference..." className="pl-9 w-64 bg-foreground/5 border-foreground/10 rounded-xl text-xs font-bold text-foreground placeholder:text-foreground/20 focus:ring-blue-400/20 transition-all" />
                        </div>
                        <Button variant="outline" onClick={handleRefresh} className="w-9 border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-foreground rounded-xl transition-all" >
                            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        </Button>
                    </div>
                </div>

                {/* Intelligence Filters */}
                <div className="px-8 py-3 border-b border-foreground/5 bg-foreground/[0.01] grid grid-cols-4 gap-6 shrink-0">
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/20 ml-1">Temporal Scope</Label>
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className=" bg-foreground/5 border-foreground/10 rounded-xl text-xs font-bold">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-foreground/10">
                                <SelectItem value="all">Full History</SelectItem>
                                <SelectItem value="today">Today's Cycles</SelectItem>
                                <SelectItem value="week">Current Week</SelectItem>
                                <SelectItem value="month">Current Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/20 ml-1">Provider Node</Label>
                        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                            <SelectTrigger className=" bg-foreground/5 border-foreground/10 rounded-xl text-xs font-bold">
                                <SelectValue placeholder="All Providers" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-foreground/10">
                                <SelectItem value="all">Global Inventory</SelectItem>
                                {suppliers.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/20 ml-1">Date Start</Label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/20" />
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-9 h-9 bg-foreground/5 border-foreground/10 rounded-xl text-xs font-bold" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/20 ml-1">Date End</Label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/20" />
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-9 h-9 bg-foreground/5 border-foreground/10 rounded-xl text-xs font-bold" />
                        </div>
                    </div>
                </div>

                {/* Analytical Table */}
                <div className="flex-1 overflow-hidden relative">
                    <ScrollArea className="h-full">
                        <Table>
                            <TableHeader className="bg-foreground/[0.02] sticky top-0 z-20 backdrop-blur-md">
                                <TableRow className="border-foreground/5 hover:bg-transparent">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 pl-8">Issue Date</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Maturity</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Reference ID</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Provider</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right">Obligation</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right">Residual</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-center">Status</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 pr-8 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payables.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-foreground/10 gap-3">
                                                <ShieldCheck className="h-16 w-16 opacity-20" />
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-widest">No Active Obligations</p>
                                                    <p className="text-[10px] font-bold text-foreground/5 uppercase mt-1">Matrix Clear</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payables.map((payable) => (
                                        <TableRow
                                            key={payable.id}
                                            className={cn(
                                                "border-foreground/5 hover:bg-foreground/[0.02] group transition-all cursor-pointer relative",
                                                selectedId === payable.id && "bg-blue-400/5"
                                            )}
                                            onClick={() => setSelectedId(payable.id)}
                                        >
                                            <TableCell className="pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-1 h-8 rounded-full transition-all",
                                                        selectedId === payable.id ? "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" : "bg-foreground/5"
                                                    )} />
                                                    <span className="text-xs font-bold text-foreground/60">{format(new Date(payable.date), 'MMM dd, yyyy')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                                                    {format(new Date(payable.dueDate), 'MMM dd')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono font-bold text-blue-400/80">#{payable.reference}</span>
                                                    <span className="text-[10px] font-black text-foreground/20 uppercase">{payable.payableNo}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                <span className="text-xs font-black uppercase tracking-tight text-foreground/80">{payable.supplierName}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-xs font-bold text-foreground/60">₱{payable.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={cn(
                                                    "text-xs font-black italic",
                                                    payable.dueAmount > 0 ? "text-red-400" : "text-emerald-400"
                                                )}>
                                                    ₱{payable.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border",
                                                    payable.status === 'Paid' 
                                                        ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" 
                                                        : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                                                )}>
                                                    {payable.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="pr-8 text-right">
                                                <Button variant="ghost" size="icon" className="w-8 rounded-lg hover:bg-foreground/10 text-foreground/20 hover:text-foreground transition-all">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>

                {/* Intelligence Footer */}
                <div className="px-8 py-4 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Total Asset Outflow</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black italic text-foreground/80">
                                    ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-[10px] font-bold text-foreground/20">({totalCount} Items)</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Page Depth</span>
                                <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setPage(1); }}>
                                    <SelectTrigger className="h-7 w-20 bg-foreground/5 border-foreground/10 rounded-lg text-[10px] font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-foreground/10">
                                        {[20, 50, 100].map(size => (
                                            <SelectItem key={size} value={size.toString()}>{size} Rows</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-foreground/5 p-1 rounded-xl border border-foreground/10">
                            <Button variant="ghost" size="icon" className="w-8 rounded-lg hover:bg-foreground/10 text-foreground/40" onClick={() => setPage(1)}
                                disabled={page === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 rounded-lg hover:bg-foreground/10 text-foreground/40" onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center px-4 text-[10px] font-black uppercase tracking-widest text-blue-400 border-x border-foreground/5 min-w-[120px] justify-center">
                                Fragment {page} / {Math.max(1, Math.ceil(totalCount / pageSize))}
                            </div>

                            <Button variant="ghost" size="icon" className="w-8 rounded-lg hover:bg-foreground/10 text-foreground/40" onClick={() => setPage(prev => Math.min(Math.ceil(totalCount / pageSize), prev + 1))}
                                disabled={page >= Math.ceil(totalCount / pageSize)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 rounded-lg hover:bg-foreground/10 text-foreground/40" onClick={() => setPage(Math.ceil(totalCount / pageSize))}
                                disabled={page >= Math.ceil(totalCount / pageSize)}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
