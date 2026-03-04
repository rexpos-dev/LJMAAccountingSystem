'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';
import { useCustomerPayments, CustomerPayment } from '@/hooks/use-customer-payments';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, CreditCard, Loader2 } from 'lucide-react';

export default function SalesInvoicePaymentReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const dialogData = getDialogData('sales-invoice-payment-report');
    const fromDate = dialogData?.fromDate ? new Date(dialogData.fromDate) : new Date();
    const toDate = dialogData?.toDate ? new Date(dialogData.toDate) : new Date();
    const selectedPaymentType = dialogData?.paymentType || 'all';

    const { payments, isLoading, error } = useCustomerPayments();

    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            if (!p.payment_date) return false;

            // Filter by Payment Type
            if (selectedPaymentType !== 'all' && p.payment_type !== selectedPaymentType) {
                return false;
            }

            const pDate = new Date(p.payment_date);
            try {
                return isWithinInterval(pDate, {
                    start: startOfDay(fromDate),
                    end: endOfDay(toDate)
                });
            } catch (e) {
                return false;
            }
        });
    }, [payments, fromDate, toDate, selectedPaymentType]);

    const stats = useMemo(() => {
        return {
            totalAmount: filteredPayments.reduce((sum: number, p: CustomerPayment) => sum + Number(p.amount || 0), 0),
            count: filteredPayments.length
        };
    }, [filteredPayments]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <Dialog open={openDialogs['sales-invoice-payment-report']} onOpenChange={() => closeDialog('sales-invoice-payment-report')}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <Menubar className="rounded-none border-x-0 border-b border-t-0">
                        <MenubarMenu>
                            <MenubarTrigger>Report</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>Print Preview</MenubarItem>
                                <MenubarItem>Print</MenubarItem>
                                <MenubarItem>Save</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('sales-invoice-payment-report')}>Close</MenubarItem>
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

                <DialogHeader className="p-6 text-left border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 border rounded-md bg-card">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-white text-left">Customer Payment Report</DialogTitle>
                                <DialogDescription className="text-left">
                                    Period: {format(fromDate, 'MM/dd/yyyy')} - {format(toDate, 'MM/dd/yyyy')} | Type: {selectedPaymentType === 'all' ? 'All' : selectedPaymentType}
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Card className={stats.totalAmount > 0 ? "bg-green-500/10 border-green-500/20" : "bg-muted/30 border-none"}>
                                <CardContent className="p-3 flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-full">
                                        <CreditCard className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total Payments</p>
                                        <p className="text-lg font-bold leading-none">{formatCurrency(stats.totalAmount)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className={stats.count > 0 ? "bg-blue-500/10 border-blue-500/20" : "bg-muted/30 border-none"}>
                                <CardContent className="p-3 flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-full">
                                        <Activity className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">Transactions</p>
                                        <p className="text-lg font-bold leading-none">{stats.count}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6 py-4'>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 border-b-2">
                                <TableHead className="font-bold">Customer</TableHead>
                                <TableHead className="font-bold">Date</TableHead>
                                <TableHead className="font-bold">Method</TableHead>
                                <TableHead className="font-bold">Reference</TableHead>
                                <TableHead className="font-bold text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="text-muted-foreground italic">Fetching payment data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center text-red-500 font-medium">
                                        {error.message}
                                    </TableCell>
                                </TableRow>
                            ) : filteredPayments.length > 0 ? (
                                filteredPayments.map((p: CustomerPayment) => (
                                    <TableRow key={p.id} className="hover:bg-muted/20">
                                        <TableCell className="font-medium">{p.customer_name || 'N/A'}</TableCell>
                                        <TableCell>{p.payment_date ? format(new Date(p.payment_date), 'MM/dd/yyyy') : 'N/A'}</TableCell>
                                        <TableCell>{p.payment_type || 'N/A'}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{p.reference || '-'}</TableCell>
                                        <TableCell className="text-right font-mono font-bold text-green-600">
                                            {formatCurrency(Number(p.amount || 0))}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                        No payments found for the selected period.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
