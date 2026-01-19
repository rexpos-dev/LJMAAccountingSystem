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
    HelpCircle,
    Briefcase,
    FileText,
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

    useEffect(() => {
        if (openDialogs['accounts-payable']) {
            fetchPayables();
            fetchSuppliers();
        }
    }, [openDialogs['accounts-payable']]);

    // Fetch Payables (Using Purchase Orders as source for now)
    const fetchPayables = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/purchase-orders');
            if (res.ok) {
                const data = await res.json();
                // Map POs to Payable format
                const mappedData: Payable[] = data.map((po: any) => ({
                    id: po.id,
                    date: po.date,
                    dueDate: new Date(new Date(po.date).setDate(new Date(po.date).getDate() + 30)).toISOString(), // Mock 30 days term
                    reference: po.id.slice(0, 8),
                    poReference: po.orderNumber || po.id.slice(0, 6),
                    payableNo: `PRC${(po.orderNumber || po.id.slice(0, 5)).replace(/\D/g, '')}`,
                    supplierName: po.supplier?.name || 'Unknown',
                    supplierId: po.supplierId || po.supplier?.id || '',
                    amount: po.total,
                    dueAmount: po.total, // Assuming none paid yet
                    status: po.status === 'Approved' ? 'Not Paid' : po.status
                }));
                setPayables(mappedData);
            }
        } catch (error) {
            console.error('Failed to fetch payables', error);
            // Mock data if API fails or is empty for demo
            setPayables([
                {
                    id: '1',
                    date: '2026-01-19',
                    dueDate: '2026-02-18',
                    reference: '',
                    poReference: '10000',
                    payableNo: 'PRC10000',
                    supplierName: 'tete',
                    supplierId: '1',
                    amount: 1680.00,
                    dueAmount: 1680.00,
                    status: 'Not Paid'
                }
            ]);
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
            // Determine what to open, likely the PO edit
            // setDialogData...
            toast({ title: "Edit", description: "Opening edit for " + selectedId });
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
                <DialogHeader className="px-4 py-2 border-b bg-background z-10 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="flex items-center gap-2">
                        Accounts Payable
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => closeDialog('accounts-payable')} className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Toolbar */}
                <div className="flex items-center px-2 py-1 border-b gap-1 bg-background overflow-x-auto">
                    <ToolbarButton icon={Plus} label="New" onClick={handleNew} />
                    <ToolbarButton icon={X} label="Delete" onClick={handleDelete} disabled={!selectedId} />
                    <ToolbarButton icon={Pencil} label="Edit" onClick={handleEdit} disabled={!selectedId} />
                    <div className="w-px h-8 bg-border mx-1" />
                    <ToolbarButton icon={Banknote} label="Payment" onClick={handlePayment} disabled={!selectedId} />

                    <ToolbarButton icon={RefreshCw} label="Refresh" onClick={handleRefresh} />

                    <div className="ml-auto flex items-center">
                        <ToolbarButton icon={HelpCircle} label="Help" />
                    </div>
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
                <div className="bg-background p-2 border-t flex items-center text-sm px-4">
                    <span className="font-medium">{payables.length} Bills. Total ₱{totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
