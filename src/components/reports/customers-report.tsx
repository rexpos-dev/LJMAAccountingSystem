'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@/components/ui/menubar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    FileText,
    Printer,
    Save,
    ListVideo,
    ChevronLeft,
    ChevronRight,
    Users,
    Activity,
    CreditCard,
    Loader2,
} from 'lucide-react';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

interface Customer {
    id: string;
    code: string;
    customerName: string;
    contactFirstName: string;
    address: string;
    phonePrimary: string;
    email: string;
    isActive: boolean;
    creditLimit: number;
}

export default function CustomersReport() {
    const { openDialogs, closeDialog } = useDialog();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        if (openDialogs['customers-report']) {
            fetchCustomers();
        }
    }, [openDialogs['customers-report']]);

    const fetchCustomers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/customers');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setCustomers(data);
            }
        } catch (error: any) {
            console.error('Error fetching customers:', error);
            setError(error.message === 'Failed to fetch data' ? 'Failed to fetch customer data.' : 'No connection on API. Please check your network and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return customers.slice(startIndex, startIndex + itemsPerPage);
    }, [customers, currentPage]);

    const totalPages = Math.ceil(customers.length / itemsPerPage);

    const summary = useMemo(() => {
        return {
            total: customers.length,
            active: customers.filter(c => c.isActive).length,
            totalCreditLimit: customers.reduce((sum, c) => sum + (c.creditLimit || 0), 0)
        };
    }, [customers]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <Dialog open={openDialogs['customers-report'] || false} onOpenChange={() => closeDialog('customers-report' as any)}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <Menubar className="rounded-none border-x-0 border-b border-t-0">
                        <MenubarMenu>
                            <MenubarTrigger>Report</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>Print Preview</MenubarItem>
                                <MenubarItem>Print</MenubarItem>
                                <MenubarItem>Save</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('customers-report')}>Close</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>Help</MenubarTrigger>
                        </MenubarMenu>
                    </Menubar>
                    <div className="flex items-center gap-2 p-2 border-b">
                        <Button variant="ghost" size="sm" className="flex-col h-auto"><ListVideo className="h-5 w-5" /><span>Preview</span></Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto"><Printer className="h-5 w-5" /><span>Print</span></Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto"><Save className="h-5 w-5" /><span>Save</span></Button>
                    </div>
                </header>

                <DialogHeader className="p-6 text-left border-b pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 border rounded-md bg-card">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-white text-left">Customers Report</DialogTitle>
                                <p className="text-sm text-muted-foreground">Detailed summary of all registered customers</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Card className="bg-muted/30 border-none">
                                <CardContent className="p-3 flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-full">
                                        <Users className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total Customers</p>
                                        <p className="text-lg font-bold leading-none">{summary.total}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/30 border-none">
                                <CardContent className="p-3 flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-full">
                                        <Activity className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">Active</p>
                                        <p className="text-lg font-bold leading-none">{summary.active}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/30 border-none">
                                <CardContent className="p-3 flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-full">
                                        <CreditCard className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total Credit Limit</p>
                                        <p className="text-lg font-bold leading-none">{formatCurrency(summary.totalCreditLimit)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6 py-4'>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 border-b-2">
                                <TableHead className="w-[100px] font-bold">Code</TableHead>
                                <TableHead className="font-bold">Customer Name</TableHead>
                                <TableHead className="font-bold">Contact Person</TableHead>
                                <TableHead className="font-bold">Address</TableHead>
                                <TableHead className="font-bold text-right">Credit Limit</TableHead>
                                <TableHead className="font-bold text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-red-500 font-medium">{error}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="text-muted-foreground italic">Fetching data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedCustomers.length > 0 ? (
                                paginatedCustomers.map((customer) => (
                                    <TableRow key={customer.id} className="hover:bg-muted/20 transition-colors">
                                        <TableCell className="font-medium text-primary">{customer.code}</TableCell>
                                        <TableCell className="font-bold">{customer.customerName}</TableCell>
                                        <TableCell>{customer.contactFirstName || 'N/A'}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={customer.address}>
                                            {customer.address || 'No address'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs">
                                            {formatCurrency(customer.creditLimit || 0)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${customer.isActive
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                }`}>
                                                {customer.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                        No customer data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>

                <footer className="p-4 border-t flex items-center justify-between bg-muted/20">
                    <p className="text-xs text-muted-foreground font-medium">
                        Showing <span className="text-foreground">{paginatedCustomers.length}</span> of <span className="text-foreground">{customers.length}</span> entries
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || isLoading}
                            className="h-8 gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="h-8 w-8 p-0"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || isLoading || customers.length === 0}
                            className="h-8 gap-1"
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </footer>
            </DialogContent>
        </Dialog>
    );
}
