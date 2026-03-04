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
} from 'lucide-react';
import { format } from 'date-fns';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AuditLog {
    id: string;
    date: string;
    actionType: string;
    transactionId: string;
    details: string;
    amount: number;
    status: string;
    assignee: string | null;
    auditedBy: string | null;
}

export function ToAuditReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const [data, setData] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dialogData = getDialogData('to-audit-report' as any);
    const fromDateStr = dialogData?.fromDate;
    const toDateStr = dialogData?.toDate;

    useEffect(() => {
        if (openDialogs['to-audit-report' as any]) {
            fetchReportData();
        }
    }, [openDialogs['to-audit-report' as any], fromDateStr, toDateStr]);

    const fetchReportData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (fromDateStr) params.append('fromDate', fromDateStr);
            if (toDateStr) params.append('toDate', toDateStr);

            const response = await fetch(`/api/reports/to-audit?${params.toString()}`);
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
    const dateDisplay = fromDateStr && toDateStr
        ? `${format(fromDate, 'MM/dd/yyyy')} - ${format(toDate, 'MM/dd/yyyy')}`
        : 'All Time';

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return '-';
        if (value === 0) return '-';
        return `₱ ${value.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")}`;
    };

    return (
        <Dialog open={openDialogs['to-audit-report' as any] || false} onOpenChange={() => closeDialog('to-audit-report' as any)}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <Menubar className="rounded-none border-x-0 border-b border-t-0">
                        <MenubarMenu>
                            <MenubarTrigger>Report</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>Print Preview</MenubarItem>
                                <MenubarItem onClick={() => window.print()}>Print</MenubarItem>
                                <MenubarItem>Save</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('to-audit-report' as any)}>Close</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <div className="flex items-center gap-2 p-2 border-b">
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
                            <DialogTitle className="text-xl font-bold text-white text-left">To Audit Items Report</DialogTitle>
                            <DialogDescription className="text-left mt-1">
                                Period: {dateDisplay}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <span className="text-muted-foreground animate-pulse">Fetching audit records...</span>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-32 text-destructive">
                            {error}
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex justify-center items-center h-32 text-muted-foreground">
                            No records found requiring audit.
                        </div>
                    ) : (
                        <div className="pb-8">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead className="w-[120px]">Date</TableHead>
                                        <TableHead className="w-[180px]">Action Type</TableHead>
                                        <TableHead className="w-[150px]">Reference ID</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead className="text-right w-[150px]">Amount</TableHead>
                                        <TableHead className="w-[150px]">Assignee</TableHead>
                                        <TableHead className="w-[120px]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{format(new Date(log.date), 'MM/dd/yyyy HH:mm')}</TableCell>
                                            <TableCell className="font-medium">{log.actionType}</TableCell>
                                            <TableCell className="font-mono text-xs">{log.transactionId || '-'}</TableCell>
                                            <TableCell className="text-muted-foreground">{log.details}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(log.amount)}</TableCell>
                                            <TableCell>
                                                {log.assignee ? (
                                                    <span className="text-sm font-medium">{log.assignee}</span>
                                                ) : (
                                                    <span className="text-sm italic text-muted-foreground">Unassigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={log.status === 'To Audit' ? 'destructive' : 'default'}>
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
