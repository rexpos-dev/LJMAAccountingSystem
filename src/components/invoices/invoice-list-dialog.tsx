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
    Printer,
    Mail,
    Save,
    Briefcase,
    HelpCircle,
    Eye,
    MoreVertical,
    FileText,
    Banknote,
    Phone,
    Copy,
    LogOut,
    RefreshCw
} from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Invoice {
    id: string;
    date: string;
    invoiceNumber: string;
    customerPONumber?: string;
    customerId: string;
    customerName?: string;
    salespersonName?: string;
    status: string;
    total: number;
    dueDate?: string;
}

export default function InvoiceListDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Filters
    const [period, setPeriod] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [customerFilter, setCustomerFilter] = useState('all');
    const [displayInvoices, setDisplayInvoices] = useState('Recorded');
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [keyword, setKeyword] = useState('');

    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        if (openDialogs['invoice-list']) {
            fetchInvoices();
            fetchCustomers();
        }
    }, [openDialogs['invoice-list']]);

    // Re-fetch when creation dialog closes to update list
    useEffect(() => {
        if (!openDialogs['create-invoice'] && openDialogs['invoice-list']) {
            fetchInvoices();
        }
    }, [openDialogs['create-invoice']]);


    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (customerFilter !== 'all') params.append('customerId', customerFilter);
            // Add date filter logic if needed based on period selection

            const res = await fetch(`/api/invoices?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setInvoices(data);
            }
        } catch (error) {
            console.error('Failed to fetch invoices', error);
            toast({ title: 'Error', description: 'Failed to fetch invoices', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/customers');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error('Failed to fetch customers', error);
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

    const handleRefresh = () => {
        fetchInvoices();
        fetchCustomers();
    };

    const handleNew = () => {
        setDialogData('create-invoice', { mode: 'create' });
        openDialog('create-invoice');
    };

    const handleEdit = (id?: string) => {
        const targetId = id || selectedInvoiceId;
        if (!targetId) return;

        setDialogData('create-invoice', { mode: 'edit', invoiceId: targetId });
        openDialog('create-invoice');
    };

    const handleView = (id?: string) => {
        const targetId = id || selectedInvoiceId;
        if (!targetId) return;

        // Assuming there is a view-invoice dialog, otherwise use create-invoice in view mode or similar
        // For now, let's assume create-invoice handles edit/view based on permissions or just edit
        setDialogData('create-invoice', { mode: 'edit', invoiceId: targetId });
        openDialog('create-invoice');
    };

    const handleDelete = async () => {
        if (!selectedInvoiceId) return;
        if (!confirm('Are you sure you want to delete this invoice?')) return;

        try {
            // Check if DELETE endpoint exists first. Assuming it does or will be added.
            // For now, use a simulated delete or call the API if implemented.
            // The API route I saw only had POST and I added GET. DELETE is missing.
            // I should implement DELETE in route.ts next, but for now I'll handle the UI.
            toast({ title: 'Not Implemented', description: 'Delete functionality not yet available on API', variant: 'default' });

            /*
            const res = await fetch(`/api/invoices?id=${selectedInvoiceId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast({ title: 'Invoice Deleted' });
                setInvoices(invoices.filter(i => i.id !== selectedInvoiceId));
                setSelectedInvoiceId(null);
            } else {
                toast({ title: 'Error', description: 'Failed to delete invoice', variant: 'destructive' });
            }
            */
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete invoice', variant: 'destructive' });
        }
    };

    const handleAction = async (action: string, id: string) => {
        // Implement status updates
        toast({ title: 'Action', description: `${action} on invoice ${id}` });
    };

    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const filteredInvoices = invoices.filter(inv => {
        if (keyword && !inv.customerName?.toLowerCase().includes(keyword.toLowerCase()) && !inv.invoiceNumber.toLowerCase().includes(keyword.toLowerCase())) {
            return false;
        }
        return true;
    });

    return (
        <Dialog open={openDialogs['invoice-list']} onOpenChange={() => closeDialog('invoice-list')}>
            <DialogContent className="max-w-[1200px] h-[80vh] flex flex-col p-0 gap-0 sm:rounded-lg overflow-hidden">
                <DialogHeader className="px-4 py-2 border-b bg-background z-10 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Invoices
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => closeDialog('invoice-list')} className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Toolbar */}
                <div className="flex items-center px-2 py-1 border-b gap-1 bg-background overflow-x-auto">
                    <ToolbarButton icon={Plus} label="New" onClick={handleNew} />
                    <ToolbarButton icon={Copy} label="Copy" disabled={!selectedInvoiceId} />
                    <ToolbarButton icon={X} label="Delete" onClick={handleDelete} disabled={!selectedInvoiceId} />
                    <ToolbarButton icon={Pencil} label="Edit" onClick={() => handleEdit()} disabled={!selectedInvoiceId} />
                    <div className="w-px h-8 bg-border mx-1" />
                    <ToolbarButton icon={Search} label="Preview" onClick={() => handleView()} disabled={!selectedInvoiceId} />
                    <ToolbarButton icon={Printer} label="Print" disabled={!selectedInvoiceId} />
                    <ToolbarButton icon={Mail} label="Email" disabled={!selectedInvoiceId} />
                    <ToolbarButton icon={Phone} label="Fax" disabled={!selectedInvoiceId} />
                    <div className="w-px h-8 bg-border mx-1" />
                    <ToolbarButton icon={Save} label="Save" />
                    <ToolbarButton icon={Banknote} label="Export to EDI" />

                    <ToolbarButton icon={RefreshCw} label="Refresh" onClick={handleRefresh} />

                    <div className="ml-auto flex items-center">
                        <ToolbarButton icon={HelpCircle} label="Help" />
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-muted/20 border-b">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Period:</span>
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="h-8 w-[100px]">
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
                        <Input type="date" className="h-8 w-[130px]" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">End:</span>
                        <Input type="date" className="h-8 w-[130px]" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Keyword:</span>
                        <Input className="h-8 w-[150px]" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">Display Invoices:</span>
                        <Select value={displayInvoices} onValueChange={setDisplayInvoices}>
                            <SelectTrigger className="h-8 w-[120px]">
                                <SelectValue placeholder="Recorded" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Recorded">Recorded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Date</TableHead>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead className="w-[100px]">Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Salesperson</TableHead>
                                <TableHead className="w-[150px] text-right">Amount</TableHead>
                                <TableHead className="w-[120px]">Due</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">Loading invoices...</TableCell>
                                </TableRow>
                            ) : filteredInvoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No invoices found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredInvoices.map((inv) => (
                                    <TableRow
                                        key={inv.id}
                                        className={cn(
                                            "cursor-default",
                                            selectedInvoiceId === inv.id && "bg-muted"
                                        )}
                                        onClick={() => setSelectedInvoiceId(inv.id)}
                                        onDoubleClick={() => handleEdit(inv.id)}
                                    >
                                        <TableCell>{format(new Date(inv.date), 'yyyy-MM-dd')}</TableCell>
                                        <TableCell>{inv.invoiceNumber}</TableCell>
                                        <TableCell>{inv.customerPONumber || ''}</TableCell>
                                        <TableCell className="font-medium">{inv.customerName}</TableCell>
                                        <TableCell>{inv.salespersonName}</TableCell>
                                        <TableCell className="text-right">₱{(inv.total || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</TableCell>
                                        <TableCell>{inv.dueDate ? format(new Date(inv.dueDate), 'yyyy-MM-dd') : ''}</TableCell>
                                        <TableCell>{inv.status}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer */}
                <div className="bg-muted/50 p-2 border-t flex justify-between text-sm text-muted-foreground px-4">
                    <div>{filteredInvoices.length} Invoices. Total ₱{totalAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
