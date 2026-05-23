'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
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
    ChevronLeft,
    ChevronRight,
    Search,
    RefreshCw,
} from 'lucide-react';
import { ReportToolbar } from './report-toolbar';
import { format } from 'date-fns';
import { useDialog } from '../layout/dialog-context';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    const contentRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 15;

    const dialogData = getDialogData('to-audit-report' as any);

    // Initial dates from dialog provider or current date
    const [localFromDate, setLocalFromDate] = useState<string>(
        dialogData?.fromDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    );
    const [localToDate, setLocalToDate] = useState<string>(
        dialogData?.toDate || new Date().toISOString().split('T')[0]
    );
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (openDialogs['to-audit-report' as any]) {
            fetchReportData();
            setCurrentPage(1);
        }
    }, [openDialogs['to-audit-report' as any], localFromDate, localToDate]);

    const fetchReportData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (localFromDate) params.append('fromDate', localFromDate);
            if (localToDate) params.append('toDate', localToDate);

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

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lowerSearch = searchTerm.toLowerCase();
        return data.filter(log =>
            log.actionType.toLowerCase().includes(lowerSearch) ||
            (log.transactionId && log.transactionId.toLowerCase().includes(lowerSearch)) ||
            (log.details && log.details.toLowerCase().includes(lowerSearch)) ||
            (log.assignee && log.assignee.toLowerCase().includes(lowerSearch))
        );
    }, [data, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    const dateDisplay = localFromDate && localToDate
        ? `${format(new Date(localFromDate), 'MM/dd/yyyy')} - ${format(new Date(localToDate), 'MM/dd/yyyy')}`
        : 'All Time';

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return '-';
        if (value === 0) return '-';
        return `₱ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };

    return (
        <Dialog open={openDialogs['to-audit-report' as any] || false} onOpenChange={() => closeDialog('to-audit-report' as any)}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <ReportToolbar
                        contentRef={contentRef as any}
                        title="To Audit Items Report"
                        subtitle={`Period: ${dateDisplay}`}
                        closeKey="to-audit-report"
                        extra={
                            <>
                                <div className="w-px h-8 bg-border mx-1" />
                                <Button variant="ghost" size="sm" className="flex-col h-auto gap-0.5 px-3" onClick={() => fetchReportData()}>
                                    <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                                    <span className="text-[10px]">Refresh</span>
                                </Button>
                                <div className="flex items-center gap-2 ml-2">
                                    <Label htmlFor="from-date" className="text-xs font-medium uppercase text-muted-foreground whitespace-nowrap">From</Label>
                                    <Input id="from-date" type="date" className="w-[150px]" value={localFromDate} onChange={(e) => setLocalFromDate(e.target.value)} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="to-date" className="text-xs font-medium uppercase text-muted-foreground whitespace-nowrap">To</Label>
                                    <Input id="to-date" type="date" className="w-[150px]" value={localToDate} onChange={(e) => setLocalToDate(e.target.value)} />
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search action, ID, or details..." className="pl-9" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                                </div>
                            </>
                        }
                    />
                </header>

                <DialogHeader className="p-6 text-left shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border rounded-md bg-card">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-foreground text-left">To Audit Items Report</DialogTitle>
                            <DialogDescription className="text-left mt-1">
                                Period: {dateDisplay}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <div ref={contentRef}>
                    {loading && data.length === 0 ? (
                        <div className="flex justify-center items-center h-32">
                            <span className="text-muted-foreground animate-pulse">Fetching audit records...</span>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-32 text-destructive">
                            {error}
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="flex justify-center items-center h-32 text-muted-foreground">
                            {searchTerm ? `No records found matching "${searchTerm}"` : "No records found requiring audit for this period."}
                        </div>
                    ) : (
                        <div className="pb-8">
                            <Table>
                                <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
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
                                    {paginatedData.map((log) => (
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
                    </div>
                </ScrollArea>

                {/* Pagination Footer */}
                {!loading && filteredData.length > 0 && (
                    <div className="p-4 border-t bg-muted/20 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing <span className="text-foreground font-medium">{Math.min(filteredData.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="text-foreground font-medium">{Math.min(filteredData.length, currentPage * ITEMS_PER_PAGE)}</span> of <span className="text-foreground font-medium">{filteredData.length}</span> records
                            {searchTerm && <span className="ml-2">(filtered from {data.length} total)</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <div className="px-3 text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

