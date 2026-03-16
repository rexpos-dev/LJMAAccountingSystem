'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-provider';
import { CalendarIcon, Printer, BookOpen, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CustomerLedgerDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const [fromDate, setFromDate] = useState<Date | undefined>(() => {
        const d = new Date();
        d.setDate(1); // Start of month
        return d;
    });
    const [toDate, setToDate] = useState<Date | undefined>(new Date());
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const data = getDialogData('customer-ledger' as any);
    const customer = data?.customer;

    useEffect(() => {
        if (openDialogs['customer-ledger'] && customer?.id) {
            fetchLedger();
        }
    }, [openDialogs['customer-ledger'], customer?.id, fromDate, toDate]);

    const fetchLedger = async () => {
        if (!customer?.id) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({
                accountNumber: customer.id,
            });
            const response = await fetch(`/api/transactions?${params.toString()}`);
            if (response.ok) {
                const results = await response.json();
                const filtered = results.filter((tx: any) => {
                    const txDate = new Date(tx.date);
                    return (!fromDate || txDate >= fromDate) && (!toDate || txDate <= toDate);
                });
                setTransactions(filtered);
            }
        } catch (error) {
            console.error('Error fetching ledger:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        if (value === 0) return '-';
        return `₱ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    return (
        <Dialog open={openDialogs['customer-ledger']} onOpenChange={() => closeDialog('customer-ledger')}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
                <div className="flex items-center justify-between p-4 border-b shrink-0 bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Customer Ledger</DialogTitle>
                            <DialogDescription className="text-xs">
                                {customer?.name} ({customer?.id})
                            </DialogDescription>
                        </div>
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

                <div className="p-4 border-b bg-muted/10 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label className="text-xs font-semibold">From:</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[140px] justify-start text-left h-8 text-xs font-normal">
                                        <CalendarIcon className="mr-2 h-3 w-3" />
                                        {fromDate ? format(fromDate, "MM/dd/yyyy") : "Start Date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs font-semibold">To:</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[140px] justify-start text-left h-8 text-xs font-normal">
                                        <CalendarIcon className="mr-2 h-3 w-3" />
                                        {toDate ? format(toDate, "MM/dd/yyyy") : "End Date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-0">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            <TableRow>
                                <TableHead className="w-[100px]">Date</TableHead>
                                <TableHead className="w-[120px]">Reference</TableHead>
                                <TableHead>Particulars</TableHead>
                                <TableHead className="text-right w-[120px]">Debit</TableHead>
                                <TableHead className="text-right w-[120px]">Credit</TableHead>
                                <TableHead className="text-right w-[150px]">Running Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground animate-pulse">Running ledger analysis...</TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No ledger entries found for this customer.</TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx, idx) => {
                                    const prevTxs = transactions.slice(0, idx + 1);
                                    const runningBal = prevTxs.reduce((sum, t) => sum + (t.debit || 0) - (t.credit || 0), 0);

                                    return (
                                        <TableRow key={tx.id} className="hover:bg-muted/50">
                                            <TableCell className="text-xs">{format(new Date(tx.date), 'MM/dd/yyyy')}</TableCell>
                                            <TableCell className="font-mono text-xs font-semibold">{tx.transNo || tx.invoiceNumber || '-'}</TableCell>
                                            <TableCell className="text-xs">{tx.particulars}</TableCell>
                                            <TableCell className="text-right text-xs text-blue-600">{tx.debit ? formatCurrency(tx.debit) : '-'}</TableCell>
                                            <TableCell className="text-right text-xs text-red-600">{tx.credit ? formatCurrency(tx.credit) : '-'}</TableCell>
                                            <TableCell className="text-right font-bold text-xs">{formatCurrency(runningBal)}</TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>

                <div className="p-4 border-t bg-muted/30 shrink-0">
                    <div className="flex justify-end gap-6 text-sm font-bold">
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">Total Debits:</span>
                            <span className="text-blue-600 font-mono">{formatCurrency(transactions.reduce((s, t) => s + (t.debit || 0), 0))}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-muted-foreground">Total Credits:</span>
                            <span className="text-red-600 font-mono">{formatCurrency(transactions.reduce((s, t) => s + (t.credit || 0), 0))}</span>
                        </div>
                        <div className="flex gap-2 border-l pl-6">
                            <span className="text-muted-foreground">Net Balance:</span>
                            <span className="text-primary font-mono">{formatCurrency(transactions.reduce((s, t) => s + (t.debit || 0) - (t.credit || 0), 0))}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
