"use client";

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Plus,
    X,
    Pencil,
    Search,
    Eye,
    MoreVertical,
    FileText,
    Upload,
    History,
    Filter,
    ArrowDownToLine,
    RefreshCw,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useConfirm } from '@/hooks/use-confirm';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { format } from 'date-fns';

interface PurchaseOrder {
    id: string;
    date: string;
    orderNumber: string; // This might be auto-generated ID or specific field
    supplierId: string;
    supplier?: { name: string };
    status: string;
    total: number;
}

export default function PurchaseOrderListDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRestrictedAlert, setShowRestrictedAlert] = useState(false);
    const { toast } = useToast();
    const { confirm, open: confirmOpen, options: confirmOptions, handleConfirm, handleCancel } = useConfirm();

    // Filters
    const [period, setPeriod] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [suppliers, setSuppliers] = useState<any[]>([]);

    useEffect(() => {
        if (openDialogs['purchase-order-list']) {
            fetchSuppliers();
            fetchOrders(true, true);
        }
    }, [openDialogs['purchase-order-list']]);

    useEffect(() => {
        if (openDialogs['purchase-order-list']) {
            fetchOrders();
        }
    }, [page]);


    // Re-fetch when creation dialog closes to update list
    useEffect(() => {
        if (!openDialogs['create-purchase-order'] && openDialogs['purchase-order-list']) {
            fetchOrders();
        }
    }, [openDialogs['create-purchase-order']]);

    // Re-fetch when bulk upload dialog closes to update list
    useEffect(() => {
        if (!openDialogs['bulk-upload-purchase-order'] && openDialogs['purchase-order-list']) {
            fetchOrders();
        }
    }, [openDialogs['bulk-upload-purchase-order']]);


    const fetchOrders = async (ignoreFilters = false, resetPage = false) => {
        setLoading(true);
        setError(null);
        try {
            const currentPage = resetPage ? 1 : page;
            if (resetPage && page !== 1) {
                setPage(1);
                return; // useEffect will trigger fetchOrders(false, false)
            }

            const params = new URLSearchParams();
            if (!ignoreFilters) {
                if (statusFilter !== 'all') params.append('status', statusFilter);
                if (supplierFilter !== 'all') params.append('supplierId', supplierFilter);

                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
            }

            params.append('limit', pageSize.toString());
            params.append('offset', ((currentPage - 1) * pageSize).toString());

            const res = await fetch(`/api/purchase-orders?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch purchase orders');
            const data = await res.json();
            // API returns paginated object: { data: PurchaseOrder[], totalCount: number, ... }
            setOrders(Array.isArray(data.data) ? data.data : []);
            setTotalCount(data.totalCount || 0);
        } catch (error: any) {
            console.error('Failed to fetch orders', error);
            setError(error.message === 'Failed to fetch purchase orders' ? 'Failed to fetch purchase orders.' : 'No connection on API. Please check your network and try again.');
            toast({ title: 'Error', description: 'Failed to fetch purchase orders', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = (val: string) => {
        setPeriod(val);
        const now = new Date();
        let start = now;
        let end = now;

        switch (val) {
            case 'today':
                start = now;
                end = now;
                break;
            case 'week':
                // Get start of week (Sunday)
                start = new Date(now.setDate(now.getDate() - now.getDay()));
                end = new Date();
                break;
            case 'month':
                // Get start of month
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date();
                break;
            case 'all':
                // Clear filters or set to very early date if needed
                setStartDate('');
                setEndDate('');
                return;
            default:
                return;
        }

        setStartDate(format(start, 'yyyy-MM-dd'));
        setEndDate(format(end, 'yyyy-MM-dd'));
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

    const handleNew = () => {
        setDialogData('create-purchase-order', { mode: 'create' });
        openDialog('create-purchase-order');
    };

    const handleEdit = (id?: string) => {
        const targetId = id || selectedOrderId;
        if (!targetId) return;

        // Check if order is editable based on status
        const order = orders.find(o => o.id === targetId);
        if (order && (order.status === 'Approved' || order.status === 'Disapproved' || order.status === 'Rejected' || order.status === 'Void')) {
            setShowRestrictedAlert(true);
            return;
        }

        setDialogData('create-purchase-order', { mode: 'edit', orderId: targetId });
        openDialog('create-purchase-order');
    };

    const handleView = (id?: string) => {
        const targetId = id || selectedOrderId;
        if (!targetId) return;

        setDialogData('view-purchase-order', { orderId: targetId });
        openDialog('view-purchase-order');
    };

    const handleBulkUpload = () => {
        openDialog('bulk-upload-purchase-order');
    };

    const handlePurchaseHistory = () => {
        if (!selectedOrderId) {
            toast({
                title: "No Order Selected",
                description: "Please select a purchase order to view history.",
                variant: "destructive"
            });
            return;
        }

        setDialogData('purchase-history', { orderId: selectedOrderId });
        openDialog('purchase-history');
    };


    const handleDelete = async () => {
        if (!selectedOrderId) return;
        const ok = await confirm({ description: 'Are you sure you want to delete this order?', title: 'Delete Order', variant: 'destructive' });
        if (!ok) return;

        try {
            const res = await fetch(`/api/purchase-orders?id=${selectedOrderId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast({ title: 'Order Deleted' });
                setOrders(orders.filter(o => o.id !== selectedOrderId));
                setSelectedOrderId(null);
            } else {
                toast({ title: 'Error', description: 'Failed to delete order', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete order', variant: 'destructive' });
        }
    };

    const handleAction = async (action: string, id: string) => {
        let newStatus = '';
        switch (action) {
            case 'Approve': newStatus = 'Approved'; break;
            case 'Disapprove': newStatus = 'Disapproved'; break;
            case 'Receive': newStatus = 'Closed'; break;
            case 'Void': newStatus = 'Void'; break;
            case 'Reorder':
                // Reorder logic might be different (clone order), for now just ignore
                toast({ title: 'Reorder', description: 'Reorder functionality coming soon' });
                return;
            default: return;
        }

        try {
            const res = await fetch('/api/purchase-orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (res.ok) {
                toast({ title: `Order ${newStatus}`, description: `Order has been marked as ${newStatus}.` });
                fetchOrders(); // Refresh list to show new status
            } else {
                toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
        }
    };

    const handleFetchPOS = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sync/pos/purchase-orders', {
                method: 'POST',
            });
            const data = await res.json();

            if (res.ok) {
                toast({
                    title: 'POS Sync Successful',
                    description: data.message || `Successfully synced ${data.results?.synced || 0} orders.`
                });
                fetchOrders();
            } else {
                toast({
                    title: 'POS Sync Failed',
                    description: data.error || 'Failed to fetch orders from POS.',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('POS Sync error:', error);
            toast({
                title: 'Network Error',
                description: 'Could not connect to the system. Please check your network.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = Array.isArray(orders) ? orders.reduce((sum, order) => sum + (order.total || 0), 0) : 0;

    return (
        <Dialog open={openDialogs['purchase-order-list']} onOpenChange={() => closeDialog('purchase-order-list')}>
            <DialogContent className="max-w-[1450px] w-[95vw] p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
                {/* Premium Glassmorphism Header */}
                <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Purchase Procurement</DialogTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/20">Procurement Matrix</span>
                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{totalCount} Orders Logged</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-4">
                        
                    </div>
                </div>

                {/* Tactical Control Strip */}
                <div className="px-8 py-4 bg-foreground/[0.02] border-b border-foreground/5 flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar">
                    <Button onClick={handleNew} className="bg-blue-500 hover:bg-blue-400 text-black font-black uppercase tracking-widest text-[10px] rounded-xl px-6 gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all" >
                        <Plus className="h-4 w-4" />
                        New Order
                    </Button>
                    <div className="w-px h-6 bg-foreground/10 mx-2" />
                    
                    <Button variant="outline" disabled={!selectedOrderId} onClick={() => handleEdit()}
                        className="border-foreground/10 bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-4 gap-2 disabled:opacity-20 transition-all"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Modify
                    </Button>

                    <Button variant="outline" disabled={!selectedOrderId} onClick={() => handleView()}
                        className="border-foreground/10 bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-4 gap-2 disabled:opacity-20 transition-all"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                    </Button>

                    <Button variant="outline" disabled={!selectedOrderId} onClick={handlePurchaseHistory} className="border-foreground/10 bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground font-black uppercase tracking-widest text-[10px] rounded-xl px-4 gap-2 disabled:opacity-20 transition-all" >
                        <History className="h-3.5 w-3.5" />
                        History
                    </Button>

                    <Button variant="outline" disabled={!selectedOrderId} onClick={handleDelete} className="border-foreground/10 bg-foreground/5 text-red-400/60 hover:bg-red-400/10 hover:text-red-400 font-black uppercase tracking-widest text-[10px] rounded-xl px-4 gap-2 disabled:opacity-20 transition-all" >
                        <X className="h-3.5 w-3.5" />
                        Terminate
                    </Button>

                    <div className="w-px h-6 bg-foreground/10 mx-2" />

                    <Button variant="outline" onClick={handleBulkUpload} className="border-foreground/10 bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground font-black uppercase tracking-widest text-[10px] rounded-xl px-4 gap-2 transition-all" >
                        <Upload className="h-3.5 w-3.5" />
                        Bulk Upload
                    </Button>

                    <Button variant="outline" onClick={handleFetchPOS} disabled={loading} className="border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 font-black uppercase tracking-widest text-[10px] rounded-xl px-4 gap-2 disabled:opacity-20 transition-all" >
                        <ArrowDownToLine className={cn("h-3.5 w-3.5", loading && "animate-bounce")} />
                        Fetch POS
                    </Button>

                    <button 
                        onClick={() => fetchOrders(false, true)}
                        className="ml-auto p-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-foreground transition-all active:scale-95"
                    >
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </button>
                </div>

                {/* Intelligence Filters */}
                <div className="px-8 py-4 bg-foreground/5 border-b border-foreground/5 flex flex-wrap items-center gap-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Temporal Period</span>
                        <Select value={period} onValueChange={handlePeriodChange}>
                            <SelectTrigger className="w-40 bg-foreground/5 border-foreground/10 text-foreground text-[10px] font-bold uppercase tracking-wider rounded-lg focus:ring-blue-500/20">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-foreground/10 text-foreground">
                                <SelectItem value="all">Cumulative Archive</SelectItem>
                                <SelectItem value="today">Current Cycle (Today)</SelectItem>
                                <SelectItem value="week">Weekly Span</SelectItem>
                                <SelectItem value="month">Monthly Interval</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Input type="date" className="w-36 bg-foreground/5 border-foreground/10 text-foreground text-[10px] rounded-lg" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                        />
                        <span className="text-foreground/20">/</span>
                        <Input type="date" className="w-36 bg-foreground/5 border-foreground/10 text-foreground text-[10px] rounded-lg" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Provider</span>
                        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                            <SelectTrigger className="w-48 bg-foreground/5 border-foreground/10 text-foreground text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                <SelectValue placeholder="All Providers" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-foreground/10 text-foreground max-h-[300px]">
                                <SelectItem value="all">Global Network</SelectItem>
                                {suppliers.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Status</span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40 bg-foreground/5 border-foreground/10 text-foreground text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                <SelectValue placeholder="Global Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-foreground/10 text-foreground">
                                <SelectItem value="all">All States</SelectItem>
                                <SelectItem value="Open">Pending / Open</SelectItem>
                                <SelectItem value="Approved">Verified / Approved</SelectItem>
                                <SelectItem value="Closed">Terminated / Closed</SelectItem>
                                <SelectItem value="Void">Invalidated / Void</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground text-[10px] font-black uppercase tracking-widest px-6 ml-auto rounded-lg gap-2 transition-all" onClick={() => fetchOrders(false, true)}
                    >
                        <Filter className="h-3.5 w-3.5" />
                        Execute Filter
                    </Button>
                </div>

                {/* Data Matrix Table */}
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <div className="p-8">
                            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <Table>
                                    <TableHeader className="bg-foreground/5">
                                        <TableRow className="border-foreground/5 hover:bg-transparent">
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 pl-6">Temporal Stamp</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14">Order Identifier</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14">Provider Entity</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14">Status State</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 text-right">Fiscal Quantum</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 text-center pr-6">Operational Control</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {error ? (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center text-red-400 gap-4">
                                                        <X className="h-12 w-12 opacity-20" />
                                                        <p className="text-sm font-black uppercase tracking-widest">{error}</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : loading ? (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center text-blue-400 gap-4">
                                                        <RefreshCw className="h-12 w-12 animate-spin opacity-20" />
                                                        <p className="text-sm font-black uppercase tracking-widest">Scanning Procurement Matrix...</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : orders.length === 0 ? (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center text-foreground/20 gap-4">
                                                        <Search className="h-12 w-12 opacity-20" />
                                                        <p className="text-sm font-black uppercase tracking-widest">No Procurement Data Detected</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            orders.map((order) => (
                                                <TableRow
                                                    key={order.id}
                                                    className={cn(
                                                        "border-foreground/5 transition-all duration-300 group",
                                                        selectedOrderId === order.id ? "bg-blue-500/10" : "hover:bg-foreground/[0.02]"
                                                    )}
                                                    onClick={() => setSelectedOrderId(order.id)}
                                                >
                                                    <TableCell className="pl-6">
                                                        <span className="text-[10px] font-black text-foreground/60 tracking-wider">
                                                            {format(new Date(order.date), 'yyyy.MM.dd')}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="">
                                                        <span className="text-xs font-black uppercase tracking-tight text-foreground group-hover:text-blue-400 transition-colors">
                                                            {order.orderNumber || order.id.slice(0, 8)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-foreground/80 group-hover:translate-x-1 transition-transform">
                                                                {order.supplier?.name || 'Unknown Provider'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="">
                                                        <div className={cn(
                                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
                                                            order.status === 'Approved' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                                            order.status === 'Open' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                                            order.status === 'Void' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                                            "bg-foreground/5 border-foreground/10 text-foreground/40"
                                                        )}>
                                                            <div className={cn(
                                                                "h-1.5 w-1.5 rounded-full animate-pulse",
                                                                order.status === 'Approved' ? "bg-emerald-400" :
                                                                order.status === 'Open' ? "bg-amber-400" :
                                                                order.status === 'Void' ? "bg-red-400" : "bg-foreground/40"
                                                            )} />
                                                            {order.status}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="text-sm font-black italic tracking-tighter text-blue-400">
                                                            ₱{(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center pr-6" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex justify-center items-center gap-1">
                                                            <Button variant="ghost" size="icon" className="w-8 rounded-lg hover:bg-blue-500/20 text-blue-400/60 hover:text-blue-400 transition-all" title="View Details" onClick={() => handleView(order.id)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="w-8 rounded-lg hover:bg-amber-500/20 text-amber-400/60 hover:text-amber-400 transition-all" title="Edit Matrix" onClick={() => handleEdit(order.id)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="w-8 rounded-lg hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-all">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-background border-foreground/10 text-foreground">
                                                                    {order.status === 'Approved' ? (
                                                                        <>
                                                                            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest focus:bg-emerald-500/20 focus:text-emerald-400" onClick={() => handleAction('Receive', order.id)}>Initialize Receipt</DropdownMenuItem>
                                                                            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest focus:bg-red-500/20 focus:text-red-400" onClick={() => handleAction('Void', order.id)}>Invalidate Order</DropdownMenuItem>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest focus:bg-blue-500/20 focus:text-blue-400" onClick={() => handleAction('Approve', order.id)}>Verify & Approve</DropdownMenuItem>
                                                                            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest focus:bg-amber-500/20 focus:text-amber-400" onClick={() => handleAction('Disapprove', order.id)}>Reject Order</DropdownMenuItem>
                                                                            <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest focus:bg-red-500/20 focus:text-red-400" onClick={() => handleAction('Void', order.id)}>Invalidate Order</DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intelligence Summary Footer */}
                <div className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Operational Count</span>
                            <span className="text-xl font-black italic tracking-tighter text-foreground">{totalCount} <span className="text-[10px] not-italic text-foreground/40 ml-1">ENTRIES</span></span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Cumulative Exposure</span>
                            <span className="text-xl font-black italic tracking-tighter text-blue-400">₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-foreground/5 border border-foreground/10 rounded-xl p-1">
                            <Button variant="ghost" size="sm" className="px-4 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/10 text-[10px] font-black uppercase tracking-widest disabled:opacity-20" onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>
                            <div className="w-px h-4 bg-foreground/10" />
                            <span className="px-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                                Sector {page} <span className="text-foreground/20 mx-1">/</span> {Math.ceil(totalCount / pageSize) || 1}
                            </span>
                            <div className="w-px h-4 bg-foreground/10" />
                            <Button variant="ghost" size="sm" className="px-4 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/10 text-[10px] font-black uppercase tracking-widest disabled:opacity-20" onClick={() => setPage(p => p + 1)}
                                disabled={page >= Math.ceil(totalCount / pageSize) || loading}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>

            <ConfirmDialog
                open={confirmOpen}
                {...confirmOptions}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
            <AlertDialog open={showRestrictedAlert} onOpenChange={setShowRestrictedAlert}>
                <AlertDialogContent className="bg-background border-foreground/10 text-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter text-red-400">Security Restriction</AlertDialogTitle>
                        <AlertDialogDescription className="text-foreground/60 font-bold uppercase tracking-widest text-xs">
                            This procurement node is locked due to its current status. Please contact administrative oversight for override authorization.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction 
                            onClick={() => setShowRestrictedAlert(false)}
                            className="bg-foreground/10 hover:bg-foreground/20 text-foreground font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-8"
                        >
                            Acknowledge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}
