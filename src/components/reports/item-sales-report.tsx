'use client';

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
    DialogDescription,
} from '@/components/ui/dialog';
import {
    FileText,
    Printer,
    Save,
    ListVideo,
    Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';
import { useSalesTransactions } from '@/hooks/use-sales';
import { useState } from 'react';
import { Input } from '../ui/input';

export default function ItemSalesReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const dialogData = getDialogData('item-sales-report');
    const fromDate = dialogData?.fromDate || new Date();
    const toDate = dialogData?.toDate || new Date();

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const { transactions, isLoading, pagination } = useSalesTransactions(
        page,
        100, // Show more items for report
        searchTerm,
        format(fromDate, 'yyyy-MM-dd'),
        format(toDate, 'yyyy-MM-dd')
    );

    // Calculate totals for the visible transactions
    const totalSales = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalProfit = transactions.reduce((sum, t) => sum + (t.profit || 0), 0);

    return (
        <Dialog open={openDialogs['item-sales-report']} onOpenChange={() => closeDialog('item-sales-report')}>
            <DialogContent className="max-w-7xl h-[95vh] flex flex-col p-0 gap-0">
                <header>
                    <Menubar className="rounded-none border-x-0 border-b border-t-0">
                        <MenubarMenu>
                            <MenubarTrigger>Report</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>Print Preview</MenubarItem>
                                <MenubarItem>Print</MenubarItem>
                                <MenubarItem>Save</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('item-sales-report')}>Close</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>Help</MenubarTrigger>
                        </MenubarMenu>
                    </Menubar>
                    <div className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="flex-col h-auto"><ListVideo className="h-5 w-5" /><span>Preview</span></Button>
                            <Button variant="ghost" size="sm" className="flex-col h-auto"><Printer className="h-5 w-5" /><span>Print</span></Button>
                            <Button variant="ghost" size="sm" className="flex-col h-auto"><Save className="h-5 w-5" /><span>Save</span></Button>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search transaction..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <DialogHeader className="p-6 text-left">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border rounded-md bg-card">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white text-left">Item Sales Report (Details)</DialogTitle>
                            <DialogDescription className="text-left">
                                Period: {format(fromDate, 'MM/dd/yyyy')} - {format(toDate, 'MM/dd/yyyy')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <div className="min-w-max">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-card">
                                <TableRow className="bg-muted/30">
                                    <TableHead className="w-[150px] sticky top-0 bg-card z-10">Date</TableHead>
                                    <TableHead className="w-[100px] sticky top-0 bg-card z-10">Receipt #</TableHead>
                                    <TableHead className="w-[150px] sticky top-0 bg-card z-10">Customer</TableHead>
                                    <TableHead className="sticky top-0 bg-card z-10">Items Sold</TableHead>
                                    <TableHead className="text-right w-[100px] sticky top-0 bg-card z-10">Subtotal</TableHead>
                                    <TableHead className="text-right w-[100px] sticky top-0 bg-card z-10">Tax</TableHead>
                                    <TableHead className="text-right w-[100px] sticky top-0 bg-card z-10">Total</TableHead>
                                    <TableHead className="text-right w-[100px] sticky top-0 bg-card z-10">Cost</TableHead>
                                    <TableHead className="text-right w-[120px] sticky top-0 bg-card z-10">Profit/Margin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-32 text-center text-muted-foreground italic">
                                            Loading sales transaction data...
                                        </TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-32 text-center text-muted-foreground italic">
                                            No sales transactions found for this period.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {transactions.map((transaction, index) => (
                                            <TableRow key={`${transaction.id}-${index}`} className="align-top">
                                                <TableCell className="text-sm">
                                                    {format(new Date(transaction.date), 'MM/dd/yyyy HH:mm')}
                                                </TableCell>
                                                <TableCell className="font-medium text-blue-400">
                                                    #{transaction.receiptNo || transaction.orderNumber}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {transaction.customer?.name || 'Walk-in Customer'}
                                                </TableCell>
                                                <TableCell className="p-0">
                                                    <div className="flex flex-col gap-1 p-2">
                                                        {transaction.items.map((item, idx) => (
                                                            <div key={item.id || idx} className="text-xs flex justify-between gap-4 border-b border-muted last:border-0 pb-1">
                                                                <span className="text-muted-foreground">
                                                                    {item.quantity} x {item.productName}
                                                                </span>
                                                                <span className="font-mono">
                                                                    ₱{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-sm">
                                                    ₱{transaction.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className="text-right text-sm">
                                                    ₱{transaction.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    ₱{transaction.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    ₱{transaction.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className={`text-right font-medium ${transaction.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    ₱{transaction.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="bg-muted/50 font-bold border-t-2">
                                            <TableCell colSpan={6} className="text-right">GRAND TOTAL</TableCell>
                                            <TableCell className="text-right">
                                                ₱{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className={`text-right ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                ₱{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </ScrollArea>

                {pagination && pagination.totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages} ({pagination.totalRecords} records)
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                disabled={page === pagination.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
