"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDialog } from '@/components/layout/dialog-context';
import { useToast } from '@/hooks/use-toast';
import { useCustomerPayments, CustomerPayment } from '@/hooks/use-customer-payments';
import { 
    Plus, 
    Search, 
    RefreshCw, 
    MoreVertical, 
    Printer, 
    Ban, 
    ClipboardCheck, 
    Wallet, 
    ArrowUpRight, 
    History, 
    Calendar,
    Activity,
    ShieldCheck,
    TrendingUp,
    MoreHorizontal,
    FileText,
    ChevronLeft,
    ChevronRight,
    X,
    Filter
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export default function CustomerPaymentDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [customerFilter, setCustomerFilter] = useState('all');
    const [paymentType, setPaymentType] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const { payments, isLoading, error: apiError, refreshPayments } = useCustomerPayments();

    const filteredPayments = payments.filter((p) => {
        if (!p) return false;
        const name = (p.customer_name || '').toLowerCase();
        const ref = (p.reference || '').toLowerCase();
        const query = (searchQuery || '').toLowerCase();
        return name.includes(query) || ref.includes(query);
    });

    const totalAmountPaid = filteredPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const recentPaymentCount = filteredPayments.filter(p => {
        const date = p.payment_date ? new Date(p.payment_date) : new Date();
        return date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }).length;

    useEffect(() => {
        if (openDialogs['customer-payment']) {
            if (!fromDate) setFromDate(new Date().toISOString().slice(0, 10));
            if (!toDate) setToDate(new Date().toISOString().slice(0, 10));
            refreshPayments();
        }

        const handleRefresh = () => refreshPayments();
        window.addEventListener('payment-saved', handleRefresh);
        return () => window.removeEventListener('payment-saved', handleRefresh);
    }, [openDialogs['customer-payment'], refreshPayments]);

    const handleAdd = () => openDialog('add-customer-payment');

    const handleShowReport = () => {
        if (!fromDate || !toDate) {
            toast({ title: 'Date Required', description: 'Please select both dates.', variant: 'destructive' });
            return;
        }
        setDialogData('sales-invoice-payment-report', {
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
            paymentType: paymentType
        });
        openDialog('sales-invoice-payment-report');
    };

    const handleVoid = async (paymentId: string) => {
        if (!confirm('Are you sure you want to void this payment?')) return;
        try {
            const response = await fetch(`/api/customers/payments/${paymentId}/void`, { method: 'POST' });
            if (response.ok) {
                toast({ title: 'Payment Voided', description: 'Success' });
                refreshPayments();
            }
        } catch (err) {
            toast({ title: 'Error', description: 'Failed to void', variant: 'destructive' });
        }
    };

    const handlePrintReceipt = (payment: CustomerPayment) => {
        toast({ title: 'Printing Receipt', description: `Generating for ${payment.reference}` });
        window.print();
    };

    const handleAllocate = (payment: CustomerPayment) => {
        setDialogData('add-customer-payment' as any, {
            customerId: payment.customer_id,
            amount: payment.amount,
            reference: payment.reference,
            paymentType: payment.payment_type,
            date: payment.payment_date,
            note: payment.note
        });
        openDialog('add-customer-payment');
    };

    return (
        <Dialog open={openDialogs['customer-payment']} onOpenChange={() => closeDialog('customer-payment')}>
            <DialogContent className="max-w-[1200px] p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
                {/* Premium Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-400/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-400/20 text-emerald-400 border border-emerald-400/20">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">Customer Payment Matrix</DialogTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-400 border border-emerald-400/20">Accounts Receivable</span>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Inbound Liquidity Management</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total Collected</span>
                            <span className="text-xl font-black italic tracking-tighter text-emerald-400">
                                ₱{totalAmountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <button 
                            onClick={() => closeDialog('customer-payment')}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Advanced Toolbar */}
                <div className="px-8 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <Button 
                            onClick={handleAdd}
                            className="bg-emerald-400 hover:bg-emerald-400/90 text-black font-black uppercase tracking-widest text-[10px] px-4 h-9 rounded-xl transition-all gap-2"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Capture Receipt
                        </Button>
                        <div className="w-px h-6 bg-white/10 mx-2" />
                        <Button 
                            variant="ghost" 
                            onClick={handleShowReport}
                            className="text-white/60 hover:text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] px-4 h-9 rounded-xl transition-all gap-2"
                        >
                            <FileText className="h-3.5 w-3.5" />
                            Payment Protocol
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={refreshPayments}
                            className="text-white/60 hover:text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] px-4 h-9 rounded-xl transition-all gap-2"
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                            Sync Node
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                            <Input 
                                placeholder="Search Transaction..." 
                                className="pl-9 h-9 w-64 bg-white/5 border-white/10 rounded-xl text-xs font-bold text-white placeholder:text-white/20 focus:ring-emerald-400/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Intelligence Filters */}
                <div className="px-8 py-3 border-b border-white/5 bg-white/[0.01] grid grid-cols-4 gap-6 shrink-0">
                    <div className="space-y-1.5 col-span-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Observation Window</Label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="pl-9 h-9 bg-white/5 border-white/10 rounded-xl text-xs font-bold" />
                            </div>
                            <div className="text-white/10">/</div>
                            <div className="relative flex-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="pl-9 h-9 bg-white/5 border-white/10 rounded-xl text-xs font-bold" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Liquidation Channel</Label>
                        <Select value={paymentType} onValueChange={setPaymentType}>
                            <SelectTrigger className="h-9 bg-white/5 border-white/10 rounded-xl text-xs font-bold uppercase">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="all">Global Channels</SelectItem>
                                <SelectItem value="Cash">Cash Transaction</SelectItem>
                                <SelectItem value="Check">Check Clearing</SelectItem>
                                <SelectItem value="Bank Transfer">Digital Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                         <Label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Entity Segment</Label>
                         <div className="h-9 flex items-center px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40">
                            {customerFilter === 'all' ? 'Unified Matrix' : 'Filtered Segment'}
                         </div>
                    </div>
                </div>

                {/* Analytical Table */}
                <div className="flex-1 overflow-hidden relative">
                    <ScrollArea className="h-full">
                        <Table>
                            <TableHeader className="bg-white/[0.02] sticky top-0 z-20 backdrop-blur-md">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12 pl-8">Inflow Date</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12">Entity Name</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12">Reference</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12">Channel</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12 text-right">Credit Value</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-12 pr-8 text-right">Protocol</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <Activity className="h-10 w-10 text-emerald-400 animate-pulse" />
                                                <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">Synchronizing Ledger...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-white/10 gap-3">
                                                <ShieldCheck className="h-16 w-16 opacity-20" />
                                                <div>
                                                    <p className="text-sm font-black uppercase tracking-widest">No Active Inflows</p>
                                                    <p className="text-[10px] font-bold text-white/5 uppercase mt-1">Matrix Clear</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment: CustomerPayment) => (
                                        <TableRow key={payment.id} className="border-white/5 hover:bg-white/[0.02] group transition-all cursor-pointer">
                                            <TableCell className="pl-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-8 rounded-full bg-white/5 group-hover:bg-emerald-400 transition-all group-hover:shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                                    <span className="text-xs font-bold text-white/60">{payment.payment_date ? format(new Date(payment.payment_date), 'MMM dd, yyyy') : 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="text-xs font-black uppercase tracking-tight text-white/80">{payment.customer_name || 'Anonymous Entity'}</span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="text-[10px] font-mono font-bold text-emerald-400/80">#{payment.reference || '-'}</span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border bg-white/5 text-white/40 border-white/5 group-hover:bg-emerald-400/10 group-hover:text-emerald-400 group-hover:border-emerald-400/20 transition-all">
                                                    {payment.payment_type || 'N/A'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <span className="text-sm font-black italic text-emerald-400">
                                                    ₱{Number(payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 pr-8 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/20 hover:text-white transition-all">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 p-2 rounded-xl min-w-[180px]">
                                                        <DropdownMenuItem onClick={() => handleAllocate(payment)} className="rounded-lg gap-3 font-black uppercase tracking-widest text-[9px] focus:bg-emerald-400/10 focus:text-emerald-400">
                                                            <ClipboardCheck className="h-4 w-4" /> Allocation Matrix
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handlePrintReceipt(payment)} className="rounded-lg gap-3 font-black uppercase tracking-widest text-[9px]">
                                                            <Printer className="h-4 w-4" /> Print Document
                                                        </DropdownMenuItem>
                                                        <div className="my-2 h-[1px] bg-white/5" />
                                                        <DropdownMenuItem onClick={() => handleVoid(payment.id)} className="rounded-lg gap-3 font-black uppercase tracking-widest text-[9px] text-red-500 focus:bg-red-500/10 focus:text-red-500">
                                                            <Ban className="h-4 w-4" /> Void Protocol
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>

                {/* Intelligence Footer */}
                <div className="px-8 py-4 border-t border-white/5 bg-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Aggregate Inbound</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black italic text-emerald-400">
                                    ₱{totalAmountPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-[10px] font-bold text-white/20">({filteredPayments.length} Flows)</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Recent Activity</span>
                            <span className="text-sm font-black italic text-white/60">{recentPaymentCount} <span className="text-[10px] not-italic opacity-40 ml-1">Current Cycle</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/40 disabled:opacity-20"><ChevronLeft className="h-4 w-4" /></Button>
                            <div className="flex items-center px-4 text-[10px] font-black uppercase tracking-widest text-emerald-400 border-x border-white/5 min-w-[80px] justify-center italic">Cycle 01</div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/40 disabled:opacity-20"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
