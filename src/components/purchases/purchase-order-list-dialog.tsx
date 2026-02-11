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
    Filter
} from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
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
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showRestrictedAlert, setShowRestrictedAlert] = useState(false);
    const { toast } = useToast();

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
            fetchOrders(true);
        }
    }, [openDialogs['purchase-order-list']]);


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


    const fetchOrders = async (ignoreFilters = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (!ignoreFilters) {
                if (statusFilter !== 'all') params.append('status', statusFilter);
                if (supplierFilter !== 'all') params.append('supplierId', supplierFilter);

                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
            }

            const res = await fetch(`/api/purchase-orders?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
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

    // Toolbar Component
    const ToolbarButton = ({
        icon: Icon,
        label,
        onClick,
        disabled = false,
        className
    }: {
        icon: any,
        label: string,
        onClick?: () => void,
        disabled?: boolean,
        className?: string
    }) => (
        <Button
            variant="ghost"
            className={cn(
                "flex flex-col items-center h-auto py-2 px-3 gap-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md disabled:opacity-50",
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
        </Button>
    );

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
        if (!confirm('Are you sure you want to delete this order?')) return;

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

    const totalAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    return (
        <Dialog open={openDialogs['purchase-order-list']} onOpenChange={() => closeDialog('purchase-order-list')}>
            <DialogContent className="max-w-[1200px] h-[80vh] flex flex-col p-0 gap-0 sm:rounded-lg overflow-hidden">
                <DialogHeader className="px-4 py-2 border-b bg-background z-10">
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Purchase Orders
                    </DialogTitle>
                </DialogHeader>

                {/* Toolbar */}
                <div className="flex items-center px-2 py-1 border-b gap-1 bg-background overflow-x-auto">
                    <ToolbarButton icon={Plus} label="New" onClick={handleNew} />
                    <ToolbarButton icon={X} label="Delete" onClick={handleDelete} disabled={!selectedOrderId} />
                    <ToolbarButton icon={Pencil} label="Edit" onClick={() => handleEdit()} disabled={!selectedOrderId} />
                    <ToolbarButton icon={History} label="Purchase History" onClick={handlePurchaseHistory} disabled={!selectedOrderId} />
                    <div className="w-px h-8 bg-border mx-1" />
                    <ToolbarButton icon={Search} label="Preview" onClick={() => handleView()} disabled={!selectedOrderId} />
                    <div className="w-px h-8 bg-border mx-1" />
                    <ToolbarButton icon={Upload} label="Bulk Upload" onClick={handleBulkUpload} />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-muted/20 border-b">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Period:</span>
                        <Select value={period} onValueChange={handlePeriodChange}>
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Start:</span>
                        <Input type="date" className="h-8" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">End:</span>
                        <Input type="date" className="h-8" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Supplier:</span>
                        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {suppliers.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Status:</span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                                <SelectItem value="Disapproved">Disapproved</SelectItem>
                                <SelectItem value="Void">Void</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full"
                            onClick={() => fetchOrders()}
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Date</TableHead>
                                <TableHead className="w-[100px]">Order</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[150px] text-right">Amount</TableHead>
                                <TableHead className="w-[120px] text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">Loading orders...</TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No purchase orders found.</TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        className={cn(
                                            "cursor-default",
                                            selectedOrderId === order.id && "bg-muted"
                                        )}
                                        onClick={() => setSelectedOrderId(order.id)}
                                    >
                                        <TableCell>{format(new Date(order.date), 'yyyy-MM-dd')}</TableCell>
                                        <TableCell>{order.orderNumber || order.id.slice(0, 8)}</TableCell>
                                        <TableCell className="font-medium">{order.supplier?.name || 'Unknown'}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell className="text-right">₱{(order.total || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</TableCell>
                                        <TableCell className="flex justify-center items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="View" onClick={() => handleView(order.id)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-600" title="Edit" onClick={() => handleEdit(order.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {order.status === 'Approved' ? (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleAction('Receive', order.id)}>Receive</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('Void', order.id)}>Void</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('Reorder', order.id)}>Reorder</DropdownMenuItem>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleAction('Approve', order.id)}>Approve</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('Disapprove', order.id)}>Disapprove</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('Void', order.id)}>Void</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAction('Reorder', order.id)}>Reorder</DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer */}
                <div className="bg-muted/50 p-2 border-t flex justify-between text-sm text-muted-foreground px-4">
                    <div>{orders.length} Orders</div>
                    <div>Total: ₱{totalAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>
                </div>
            </DialogContent>

            <AlertDialog open={showRestrictedAlert} onOpenChange={setShowRestrictedAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unable to edit</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please contact the admin.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowRestrictedAlert(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}
