"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
    Loader2,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCcw,
    Settings2,
    Eye,
    CheckCircle2,
    Clock,
    FileText,
    MoreHorizontal,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BankTransaction {
    id: string;
    bankAccountId: string;
    bankAccount: {
        bank_name: string;
        account_number: string;
        account_name?: string;
        gl_account?: {
            account_no: string;
            account_name: string;
        };
    };
    date: string;
    type: 'CASH_IN' | 'CASH_OUT' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ADJUSTMENT';
    status: 'DRAFT' | 'TO_AUDIT' | 'APPROVED' | 'POSTED' | 'RECONCILED' | 'CANCELLED';
    amount: number;
    balanceAfter: number;
    reference?: string;
    particulars?: string;
    isCleared: boolean;
}

interface BankTransactionsTableProps {
    bankAccountId?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export function BankTransactionsTable({
    bankAccountId,
    type,
    status,
    startDate,
    endDate,
    search
}: BankTransactionsTableProps) {
    const [data, setData] = useState<BankTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (bankAccountId) params.append('bankAccountId', bankAccountId);
                if (type && type !== 'ALL') params.append('type', type);
                if (status && status !== 'ALL') params.append('status', status);
                if (search) params.append('search', search);
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);

                const res = await fetch(`/api/bank-transactions?${params.toString()}`);
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch bank history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [bankAccountId, type, status, startDate, endDate, search]);

    const getTypeBadge = (type: BankTransaction['type']) => {
        switch (type) {
            case 'CASH_IN':
                return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 border-emerald-500/20 gap-1 font-medium"><ArrowDownLeft className="h-3 w-3" /> Cash In</Badge>;
            case 'CASH_OUT':
                return <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/15 border-rose-500/20 gap-1 font-medium"><ArrowUpRight className="h-3 w-3" /> Cash Out</Badge>;
            case 'TRANSFER_IN':
            case 'TRANSFER_OUT':
                return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 border-blue-500/20 gap-1 font-medium"><RefreshCcw className="h-3 w-3" /> Transfer</Badge>;
            case 'ADJUSTMENT':
                return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 border-amber-500/20 gap-1 font-medium"><Settings2 className="h-3 w-3" /> Adjustment</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getStatusBadge = (status: BankTransaction['status']) => {
        switch (status) {
            case 'DRAFT':
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15 gap-1 font-medium"><Clock className="h-3 w-3" /> Draft</Badge>;
            case 'TO_AUDIT':
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/15 gap-1 font-medium"><Loader2 className="h-3 w-3 animate-spin" /> To Audit</Badge>;
            case 'APPROVED':
                return <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/15 gap-1 font-medium"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>;
            case 'POSTED':
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15 gap-1 font-medium"><FileText className="h-3 w-3" /> Posted</Badge>;
            case 'RECONCILED':
                return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/15 gap-1 font-medium"><CheckCircle2 className="h-3 w-3" /> Reconciled</Badge>;
            case 'CANCELLED':
                return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/15 gap-1 font-medium"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="h-48 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[120px] font-bold">Date</TableHead>
                        <TableHead className="w-[150px] font-bold">Transaction No</TableHead>
                        <TableHead className="font-bold">Bank</TableHead>
                        <TableHead className="text-center font-bold w-[120px]">Type</TableHead>
                        <TableHead className="w-[120px] font-bold">Ref</TableHead>
                        <TableHead className="text-right font-bold w-[130px]">Amount</TableHead>
                        <TableHead className="text-center font-bold w-[120px]">Status</TableHead>
                        <TableHead className="text-center font-bold w-[100px]">Audit</TableHead>
                        <TableHead className="text-center font-bold w-[100px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center text-muted-foreground italic">
                                No bank transactions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((tx) => (
                            <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="text-[10px] font-medium">
                                    {format(new Date(tx.date), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell className="font-mono text-[10px] text-muted-foreground uppercase tracking-tighter">
                                    {tx.id.substring(0, 8)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-[11px] leading-none mb-0.5">
                                            {tx.bankAccount.account_name || tx.bankAccount.bank_name}
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-mono">
                                            {tx.bankAccount.account_number}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {getTypeBadge(tx.type)}
                                </TableCell>
                                <TableCell className="text-[11px] max-w-[150px] truncate" title={tx.particulars}>
                                    {tx.reference || tx.particulars || "-"}
                                </TableCell>
                                <TableCell className={cn(
                                    "text-right font-bold text-[11px] font-mono",
                                    (tx.type === 'CASH_IN' || tx.type === 'TRANSFER_IN') ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {formatCurrency(tx.amount)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {getStatusBadge(tx.status)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {(tx.status === 'POSTED' || tx.status === 'RECONCILED') ? (
                                        <div className="flex items-center justify-center text-emerald-500 font-bold text-[10px] gap-1">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <span>CLEAR</span>
                                        </div>
                                    ) : tx.status === 'CANCELLED' ? (
                                        <div className="flex items-center justify-center text-rose-500 font-bold text-[10px] gap-1">
                                            <XCircle className="h-3.5 w-3.5" />
                                            <span>VOID</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center text-slate-300">
                                            <Clock className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10 hover:text-primary">
                                        <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
