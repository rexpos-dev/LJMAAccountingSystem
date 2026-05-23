'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    History,
    Search,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Download,
    User,
    Activity,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AuditLogEntry {
    id: string;
    date: string;
    actionType: string;
    transactionId?: string;
    details?: string;
    amount?: number;
    status: string;
    assignee?: string;
    remarks?: string;
    auditedBy?: string;
    auditedAt?: string;
    bankName?: string;
    initiatedBy?: string;
    createdAt: string;
    updatedAt: string;
}

interface LogsResponse {
    data: AuditLogEntry[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    distinctUsers: string[];
    distinctActionTypes: string[];
}

const STATUS_STYLES: Record<string, string> = {
    'To Audit': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-700',
    'Audited': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700',
    'Ongoing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700',
    'Cancelled': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-700',
};

function StatusBadge({ status }: { status: string }) {
    const style = STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground border-muted-foreground/20';
    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border', style)}>
            {status}
        </span>
    );
}

export default function HistoryLogsDialog() {
    const { openDialogs, closeDialog } = useDialog();

    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedActionType, setSelectedActionType] = useState('ALL');
    const [selectedUser, setSelectedUser] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    const [distinctUsers, setDistinctUsers] = useState<string[]>([]);
    const [distinctActionTypes, setDistinctActionTypes] = useState<string[]>([]);

    const isOpen = openDialogs['history-logs'];

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(handler);
    }, [search]);

    const fetchLogs = useCallback(async () => {
        if (!isOpen) return;
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                search: debouncedSearch,
                actionType: selectedActionType,
                user: selectedUser,
                status: selectedStatus,
                startDate,
                endDate,
            });
            const res = await fetch(`/api/history-logs?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const json: LogsResponse = await res.json();
            setLogs(json.data);
            setTotal(json.total);
            setTotalPages(json.totalPages);
            if (json.distinctUsers.length) setDistinctUsers(json.distinctUsers);
            if (json.distinctActionTypes.length) setDistinctActionTypes(json.distinctActionTypes);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, page, pageSize, debouncedSearch, selectedActionType, selectedUser, selectedStatus, startDate, endDate]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, selectedActionType, selectedUser, selectedStatus, startDate, endDate]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setPage(1);
            fetchLogs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClear = () => {
        setSearch('');
        setDebouncedSearch('');
        setStartDate('');
        setEndDate('');
        setSelectedActionType('ALL');
        setSelectedUser('ALL');
        setSelectedStatus('ALL');
        setPage(1);
    };

    const handleExport = () => {
        if (!logs.length) return;
        const headers = ['Date', 'Action Type', 'Initiated By', 'Details', 'Amount', 'Status', 'Remarks'];
        const rows = logs.map(l => [
            l.date ? format(new Date(l.date), 'yyyy-MM-dd HH:mm') : '',
            l.actionType,
            l.initiatedBy ?? '',
            (l.details ?? '').replace(/,/g, ';'),
            l.amount != null ? String(l.amount) : '',
            l.status,
            (l.remarks ?? '').replace(/,/g, ';'),
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `history-logs-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => closeDialog('history-logs' as any)}>
            <DialogContent className="max-w-[1400px] h-[92vh] flex flex-col p-6 overflow-hidden bg-background/95 backdrop-blur-sm">

                {/* ── Header ── */}
                <DialogHeader className="flex-none pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl shadow-inner border border-primary/5">
                                <History className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    History Logs
                                </DialogTitle>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Complete audit trail of all user actions and system events.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-64 mr-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                                <Input placeholder="Search actions, users, details…" className="pl-9 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm" value={search} onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            <Button variant="outline" size="icon" className="w-10 border-primary/10 bg-primary/5 hover:bg-primary/10" onClick={fetchLogs} title="Refresh" >
                                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                            </Button>

                            <Button variant="outline" className="gap-2 border-primary/10 bg-primary/5 hover:bg-primary/10" onClick={handleExport} >
                                <Download className="h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* ── Filters ── */}
                <div className="flex-none">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6 py-4 bg-muted/20 rounded-2xl border border-foreground/5 shadow-inner">
                        {/* Action Type */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">
                                <Activity className="inline h-3 w-3 mr-1" />Action Type
                            </label>
                            <Select value={selectedActionType} onValueChange={setSelectedActionType}>
                                <SelectTrigger className=" bg-card border-foreground/5 shadow-sm font-medium">
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent className="p-1 max-h-60">
                                    <SelectItem value="ALL">All types</SelectItem>
                                    {distinctActionTypes.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* User */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">
                                <User className="inline h-3 w-3 mr-1" />User
                            </label>
                            <Select value={selectedUser} onValueChange={setSelectedUser}>
                                <SelectTrigger className=" bg-card border-foreground/5 shadow-sm font-medium">
                                    <SelectValue placeholder="All users" />
                                </SelectTrigger>
                                <SelectContent className="p-1 max-h-60">
                                    <SelectItem value="ALL">All users</SelectItem>
                                    {distinctUsers.map(u => (
                                        <SelectItem key={u} value={u}>{u}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">Status</label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className=" bg-card border-foreground/5 shadow-sm font-medium">
                                    <SelectValue placeholder="All status" />
                                </SelectTrigger>
                                <SelectContent className="p-1">
                                    <SelectItem value="ALL">All status</SelectItem>
                                    <SelectItem value="To Audit">To Audit</SelectItem>
                                    <SelectItem value="Audited">Audited</SelectItem>
                                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date From */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">Date From</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                    className="h-10 pl-9 bg-card border-foreground/5 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Date To */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">Date To</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                    className="h-10 pl-9 bg-card border-foreground/5 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="flex-1 overflow-hidden rounded-2xl border border-foreground/5 bg-card shadow-2xl relative">
                    <div className="absolute inset-0 overflow-auto">
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
                                <TableRow className="border-b border-foreground/5 hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider whitespace-nowrap w-40">Date & Time</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider whitespace-nowrap">Action Type</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider whitespace-nowrap">Initiated By</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Details</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider text-right whitespace-nowrap w-32">Amount</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider whitespace-nowrap w-28">Status</TableHead>
                                    <TableHead className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Remarks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: pageSize }).map((_, i) => (
                                        <TableRow key={i} className="border-b border-foreground/5">
                                            {Array.from({ length: 7 }).map((_, j) => (
                                                <TableCell key={j}>
                                                    <div className="h-4 bg-muted/50 rounded animate-pulse" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-40 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <History className="h-10 w-10 opacity-20" />
                                                <p className="text-sm font-medium">No history logs found</p>
                                                <p className="text-xs">Try adjusting your filters or date range.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log, idx) => (
                                        <TableRow
                                            key={log.id}
                                            className={cn(
                                                'border-b border-foreground/5 transition-colors hover:bg-muted/10',
                                                idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'
                                            )}
                                        >
                                            <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                                                {log.date ? format(new Date(log.date), 'MMM dd, yyyy') : '—'}
                                                <br />
                                                <span className="text-[10px] opacity-60">
                                                    {log.date ? format(new Date(log.date), 'hh:mm a') : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-semibold bg-primary/8 text-primary px-2 py-0.5 rounded-md border border-primary/15 whitespace-nowrap">
                                                    {log.actionType}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-none">
                                                        <span className="text-[9px] font-bold text-primary uppercase">
                                                            {(log.initiatedBy ?? '?').charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-medium whitespace-nowrap">{log.initiatedBy ?? '—'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-xs text-muted-foreground max-w-[320px] truncate" title={log.details ?? ''}>
                                                    {log.details ?? '—'}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {log.amount != null ? (
                                                    <span className="text-xs font-mono font-semibold">
                                                        ₱{log.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={log.status} />
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-xs text-muted-foreground max-w-[200px] truncate" title={log.remarks ?? ''}>
                                                    {log.remarks ?? '—'}
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* ── Footer / Pagination ── */}
                <DialogFooter className="flex-none pt-4 border-t mt-2 gap-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full text-[10px] font-bold text-primary border border-primary/20">
                            <History className="h-3 w-3" />
                            {total.toLocaleString()} total {total === 1 ? 'log' : 'logs'}
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-wider hover:bg-rose-500/10 hover:text-rose-500" onClick={handleClear} >
                            Reset filters
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                            Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong>
                        </span>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="w-8" onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1 || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="w-8" onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages || isLoading}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" onClick={() => closeDialog('history-logs' as any)} className="font-semibold text-muted-foreground">
                            Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
