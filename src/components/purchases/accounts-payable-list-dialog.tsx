'use client';

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
    Banknote // Using Banknote as valid import if available, or fallback to file-text logic
} from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
                status: 'all', // Can be refined if needed
                supplierId: supplierFilter === 'all' ? '' : supplierFilter,
                startDate: period === 'all' ? '' : startDate,
                endDate: period === 'all' ? '' : endDate,
            });

            const res = await fetch(`/api/purchase-orders?${params.toString()}`);
            if (res.ok) {
                const result = await res.json();
                const data = result.data || [];
                setTotalCount(result.totalCount || 0);

                // Map POs to Payable format
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
        toast({ title: "Refreshed", description: "Data refreshed" });
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
        // Open Enter New Accounts Payable
        openDialog('enter-new-ap' as any);
    };

    const handleDelete = () => {
        toast({ title: "Delete", description: "Not implemented yet" });
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
                    amount: selectedPayable.dueAmount // Optional: could pre-fill amount
                });
            }
        }
        openDialog('enter-payments-of-accounts-payable');
    };

    const handleSuite = () => {
        toast({ title: "Suite", description: "Suite functionality not implemented" });
    };

    const totalAmount = payables.reduce((sum, p) => sum + p.amount, 0);

    return (
        <Dialog open={openDialogs['accounts-payable']} onOpenChange={() => closeDialog('accounts-payable')}>
            <DialogContent className="max-w-[1000px] h-[80vh] flex flex-col p-0 gap-0 sm:rounded-lg overflow-hidden">
                <DialogHeader className="px-4 py-2 border-b bg-background z-10">
                    <DialogTitle className="flex items-center gap-2">
                        Accounts Payable
                    </DialogTitle>
                </DialogHeader>

                {/* Toolbar */}
                <div className="flex items-center px-2 py-1 border-b gap-1 bg-background overflow-x-auto">
                    <ToolbarButton icon={Plus} label="New" onClick={handleNew} />
                    <ToolbarButton icon={X} label="Delete" onClick={handleDelete} disabled={!selectedId} />
                    <ToolbarButton icon={Pencil} label="Edit" onClick={handleEdit} disabled={!selectedId} />
                    <div className="w-px h-8 bg-border mx-1" />
                    <ToolbarButton icon={Banknote} label="Payment" onClick={handlePayment} disabled={!selectedId} />

                    <ToolbarButton icon={RefreshCw} label="Refresh" onClick={handleRefresh} />


                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 bg-muted/20 border-b">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Period:</span>
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="h-8 w-[120px]">
                                <SelectValue placeholder="All" />
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
                        <Input type="date" className="h-8 w-[130px]" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">End:</span>
                        <Input type="date" className="h-8 w-[130px]" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Supplier:</span>
                        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                            <SelectTrigger className="h-8 w-[150px]">
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
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Date</TableHead>
                                <TableHead className="w-[100px]">Due Date</TableHead>
                                <TableHead className="w-[100px]">Reference</TableHead>
                                <TableHead className="w-[120px]">PO Reference</TableHead>
                                <TableHead className="w-[100px]">Payable</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead className="w-[100px] text-right">Amount</TableHead>
                                <TableHead className="w-[100px] text-right">Due</TableHead>
                                <TableHead className="w-[100px] text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payables.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">No accounts payable found.</TableCell>
                                </TableRow>
                            ) : (
                                payables.map((payable) => (
                                    <TableRow
                                        key={payable.id}
                                        className={cn(
                                            "cursor-default",
                                            selectedId === payable.id && "bg-muted/50"
                                        )}
                                        onClick={() => setSelectedId(payable.id)}
                                    >
                                        <TableCell>{format(new Date(payable.date), 'yyyy-MM-dd')}</TableCell>
                                        <TableCell>{format(new Date(payable.dueDate), 'yyyy-MM-dd')}</TableCell>
                                        <TableCell>{payable.reference}</TableCell>
                                        <TableCell>{payable.poReference}</TableCell>
                                        <TableCell>{payable.payableNo}</TableCell>
                                        <TableCell>{payable.supplierName}</TableCell>
                                        <TableCell className="text-right">₱{payable.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">₱{payable.dueAmount.toFixed(2)}</TableCell>
                                        <TableCell className="text-center">{payable.status}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer */}
                <div className="bg-background p-2 border-t flex flex-col sm:flex-row items-center justify-between text-sm px-4 gap-2">
                    <div className="flex items-center gap-4">
                        <span className="font-medium">{totalCount} Bills. Total ₱{totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 mr-4">
                            <span className="text-muted-foreground whitespace-nowrap text-[11px]">Rows per page:</span>
                            <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setPage(1); }}>
                                <SelectTrigger className="h-7 w-[70px] text-[11px]">
                                    <SelectValue placeholder={pageSize.toString()} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50, 100].map(size => (
                                        <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center px-4 h-8 border rounded-md bg-muted/20 min-w-[80px] justify-center text-[12px] font-medium">
                                Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setPage(prev => Math.min(Math.ceil(totalCount / pageSize), prev + 1))}
                                disabled={page >= Math.ceil(totalCount / pageSize)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setPage(Math.ceil(totalCount / pageSize))}
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
