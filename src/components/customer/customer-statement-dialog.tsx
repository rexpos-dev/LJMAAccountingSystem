'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-provider';
import { CalendarIcon, Printer, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CustomerStatementDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const [fromDate, setFromDate] = useState<Date | undefined>(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d;
    });
    const [toDate, setToDate] = useState<Date | undefined>(new Date());
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const customer = getDialogData('customer-statement' as any);

    useEffect(() => {
        if (openDialogs['customer-statement'] && customer?.id) {
            fetchTransactions();
        }
    }, [openDialogs['customer-statement'], customer?.id, fromDate, toDate]);

    const fetchTransactions = async () => {
        if (!customer?.id) return;
        setLoading(true);
        try {
            // Using the existing transactions API with accountNumber (customer code)
            const params = new URLSearchParams({
                accountNumber: customer.id,
            });
            const response = await fetch(`/api/transactions?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                // Filter by date range locally if API doesn't support it directly
                const filtered = data.filter((tx: any) => {
                    const txDate = new Date(tx.date);
                    return (!fromDate || txDate >= fromDate) && (!toDate || txDate <= toDate);
                });
                setTransactions(filtered);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
    };

    const totalDebits = transactions.reduce((sum, tx) => sum + (tx.debit || 0), 0);
    const totalCredits = transactions.reduce((sum, tx) => sum + (tx.credit || 0), 0);
    const balance = totalDebits - totalCredits;

    return (
        <Dialog open={openDialogs['customer-statement']} onOpenChange={() => closeDialog('customer-statement')}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <DialogTitle>Statement of Account</DialogTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()}>
                            <Printer className="h-4 w-4 mr-2" /> Print
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                <div className="p-6 space-y-6 flex-1 flex flex-col overflow-hidden">
                    <div className="grid grid-cols-2 gap-8 shrink-0">
                        <div>
                            <h3 className="text-lg font-bold mb-2">{customer?.name || 'Customer Name'}</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer?.address || 'Customer Address'}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">From Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left h-8 px-2 font-normal text-xs">
                                                <CalendarIcon className="mr-2 h-3 w-3" />
                                                {fromDate ? format(fromDate, "MM/dd/yyyy") : <span>Pick date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">To Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left h-8 px-2 font-normal text-xs">
                                                <CalendarIcon className="mr-2 h-3 w-3" />
                                                {toDate ? format(toDate, "MM/dd/yyyy") : <span>Pick date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold">Current Balance:</span>
                                    <span className="text-lg font-bold text-primary">{formatCurrency(balance)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 border rounded-md">
                        <Table>
                            <TableHeader className="bg-muted/50 sticky top-0">
                                <TableRow>
                                    <TableHead className="w-[100px]">Date</TableHead>
                                    <TableHead className="w-[120px]">Reference</TableHead>
                                    <TableHead>Particulars</TableHead>
                                    <TableHead className="text-right w-[120px]">Charge</TableHead>
                                    <TableHead className="text-right w-[120px]">Payment</TableHead>
                                    <TableHead className="text-right w-[120px]">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground animate-pulse">Loading transactions...</TableCell>
                                    </TableRow>
                                ) : transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No transactions found for this period.</TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((tx, idx) => {
                                        // Calculate running balance for this view
                                        const prevTxs = transactions.slice(0, idx + 1);
                                        const runningBal = prevTxs.reduce((sum, t) => sum + (t.debit || 0) - (t.credit || 0), 0);

                                        return (
                                            <TableRow key={tx.id}>
                                                <TableCell className="text-xs">{format(new Date(tx.date), 'MM/dd/yyyy')}</TableCell>
                                                <TableCell className="font-mono text-xs">{tx.transNo || tx.invoiceNumber || '-'}</TableCell>
                                                <TableCell className="text-xs">{tx.particulars}</TableCell>
                                                <TableCell className="text-right text-xs">{tx.debit ? formatCurrency(tx.debit) : '-'}</TableCell>
                                                <TableCell className="text-right text-xs text-green-600">{tx.credit ? formatCurrency(tx.credit) : '-'}</TableCell>
                                                <TableCell className="text-right font-medium text-xs">{formatCurrency(runningBal)}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
