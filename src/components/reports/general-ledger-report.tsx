'use client';

import { useEffect, useState } from 'react';
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
    ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';

interface GLTransaction {
    id: string;
    date: string;
    transNo: string;
    particulars: string;
    debit: number;
    credit: number;
    runningBalance: number;
    user: string;
}

interface GLAccount {
    accountId: string;
    accountNo: number;
    accountName: string;
    accountType: string;
    baseType: string;
    beginningBalance: number;
    beginningBalanceIsDebit: boolean;
    rawBeginningBalance: number;
    transactions: GLTransaction[];
    endingBalance: number;
    totalDebits: number;
    totalCredits: number;
}

export default function GeneralLedgerReport() {
    const { openDialogs, closeDialog, getDialogData, openDialog } = useDialog();
    const [data, setData] = useState<GLAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dialogData = getDialogData('general-ledger-report' as any);
    const fromDateStr = dialogData?.fromDate;
    const toDateStr = dialogData?.toDate;
    const accountId = dialogData?.accountId || 'all';

    useEffect(() => {
        if (openDialogs['general-ledger-report'] && fromDateStr && toDateStr) {
            fetchReportData();
        }
    }, [openDialogs['general-ledger-report'], fromDateStr, toDateStr, accountId]);

    const fetchReportData = async () => {
        if (!fromDateStr || !toDateStr) return;

        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                fromDate: fromDateStr,
                toDate: toDateStr,
            });
            if (accountId && accountId !== 'all') {
                params.append('accountId', accountId);
            }

            const response = await fetch(`/api/reports/general-ledger?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Failed to fetch report data");
            }
            const result = await response.json();
            setData(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fromDate = fromDateStr ? new Date(fromDateStr) : new Date();
    const toDate = toDateStr ? new Date(toDateStr) : new Date();

    const formatCurrency = (value: number) => {
        if (value === 0) return '-';
        return `₱ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    const handleBack = () => {
        closeDialog('general-ledger-report' as any);
        openDialog('general-ledger-dialog' as any);
    };

    return (
        <Dialog open={openDialogs['general-ledger-report'] || false} onOpenChange={() => closeDialog('general-ledger-report' as any)}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <Menubar className="rounded-none border-x-0 border-b border-t-0">
                        <MenubarMenu>
                            <MenubarTrigger>Report</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4" />Back to Options</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Print Preview</MenubarItem>
                                <MenubarItem>Print</MenubarItem>
                                <MenubarItem>Save</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('general-ledger-report' as any)}>Close</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>Help</MenubarTrigger>
                        </MenubarMenu>
                    </Menubar>
                    <div className="flex items-center gap-2 p-2 border-b">
                        <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={handleBack}>
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back</span>
                        </Button>
                        <div className="w-px h-8 bg-border mx-1" />
                        <Button variant="ghost" size="sm" className="flex-col h-auto"><ListVideo className="h-5 w-5" /><span>Preview</span></Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => window.print()}><Printer className="h-5 w-5" /><span>Print</span></Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto"><Save className="h-5 w-5" /><span>Save</span></Button>
                    </div>
                </header>

                <DialogHeader className="p-6 text-left shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border rounded-md bg-card">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white text-left">General Ledger</DialogTitle>
                            <DialogDescription className="text-left mt-1">
                                {accountId !== 'all' ? 'Filtered Account' : 'All Accounts'} | Period: {format(fromDate, 'MM/dd/yyyy')} - {format(toDate, 'MM/dd/yyyy')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <span className="text-muted-foreground animate-pulse">Running report...</span>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-32 text-destructive">
                            {error}
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex justify-center items-center h-32 text-muted-foreground">
                            No transactions found for the selected period.
                        </div>
                    ) : (
                        <div className="space-y-8 pb-8 print:space-y-6">
                            {data.map((account) => (
                                <div key={account.accountId} className="border rounded-md overflow-hidden bg-card/50 break-inside-avoid">
                                    <div className="bg-muted px-4 py-2 border-b flex justify-between items-center">
                                        <h3 className="font-bold text-lg">{account.accountNo} - {account.accountName}</h3>
                                        <span className="text-sm text-muted-foreground uppercase">{account.accountType}</span>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-transparent hover:bg-transparent">
                                                <TableHead className="w-[120px]">Date</TableHead>
                                                <TableHead className="w-[150px]">Reference</TableHead>
                                                <TableHead>Particulars</TableHead>
                                                <TableHead className="text-right w-[120px]">Debit</TableHead>
                                                <TableHead className="text-right w-[120px]">Credit</TableHead>
                                                <TableHead className="text-right w-[150px]">Balance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Beginning Balance Row */}
                                            <TableRow className="bg-transparent hover:bg-transparent">
                                                <TableCell colSpan={3} className="font-medium text-right italic text-muted-foreground">
                                                    Beginning Balance
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {account.beginningBalanceIsDebit ? formatCurrency(account.beginningBalance) : '-'}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {!account.beginningBalanceIsDebit ? formatCurrency(account.beginningBalance) : '-'}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(account.rawBeginningBalance)}
                                                </TableCell>
                                            </TableRow>

                                            {/* Transactions */}
                                            {account.transactions.map((tx) => (
                                                <TableRow key={tx.id}>
                                                    <TableCell>{format(new Date(tx.date), 'MM/dd/yyyy')}</TableCell>
                                                    <TableCell className="font-mono text-xs">{tx.transNo}</TableCell>
                                                    <TableCell>{tx.particulars}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(tx.debit)}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(tx.credit)}</TableCell>
                                                    <TableCell className="text-right font-medium">{formatCurrency(tx.runningBalance)}</TableCell>
                                                </TableRow>
                                            ))}

                                            {/* Ending / Totals Row */}
                                            <TableRow className="bg-muted/30 font-bold hover:bg-muted/30">
                                                <TableCell colSpan={3} className="text-right">
                                                    Ending Balance / Totals
                                                </TableCell>
                                                <TableCell className="text-right text-primary">
                                                    {formatCurrency(account.totalDebits)}
                                                </TableCell>
                                                <TableCell className="text-right text-primary">
                                                    {formatCurrency(account.totalCredits)}
                                                </TableCell>
                                                <TableCell className="text-right text-primary">
                                                    {formatCurrency(account.endingBalance)}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
