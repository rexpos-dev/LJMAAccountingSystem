"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    CheckCircle2,
    XCircle,
    MessageSquare,
    User,
    Calendar,
    Banknote,
    FileText,
    History,
    ShieldCheck,
    AlertTriangle,
    Loader2,
    Map,
    ArrowRight,
    UserCheck,
    Activity,
    CheckCircle,
    Clock
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AuditItem } from "./audit-column";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AuditReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: AuditItem | null;
    onActionComplete?: () => void;
}

export function AuditReviewDialog({
    open,
    onOpenChange,
    item,
    onActionComplete
}: AuditReviewDialogProps) {
    const { toast } = useToast();
    const [remarks, setRemarks] = useState(item?.remarks || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assignee, setAssignee] = useState<string>(item?.assignee || "");
    const [users, setUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    useEffect(() => {
        if (open) {
            setRemarks(item?.remarks || "");
            setAssignee(item?.assignee || "");
        }
    }, [open, item]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!open) return;
            setIsLoadingUsers(true);
            try {
                const res = await fetch('/api/user-permissions');
                if (res.ok) {
                    const data = await res.json();
                    const filtered = data.filter((u: any) =>
                        u.accountType?.toLowerCase() === 'auditor'
                    );
                    setUsers(filtered);
                }
            } catch (err) {
                console.error("Failed to load users", err);
            } finally {
                setIsLoadingUsers(false);
            }
        };
        fetchUsers();
    }, [open]);

    const handleAction = async (decision: 'APPROVE' | 'REJECT' | 'ASSIGN_ONLY') => {
        if (!item) return;
        setIsSubmitting(true);

        try {
            // Find the selected user to get their ID for notifications
            const selectedUser = users.find(u => (u.username || `${u.firstName} ${u.lastName}`) === assignee);
            const assigneeId = selectedUser?.id || null;

            const res = await fetch(`/api/audit/${item.id}/review`, {
                method: "POST",
                body: JSON.stringify({
                    decision,
                    remarks,
                    assignee,
                    assigneeId
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.details || "Failed to process audit review");
            }

            let title = "Transaction Approved";
            let description = "The transaction has been posted to the ledger.";
            let variant: "default" | "destructive" = "default";

            if (decision === 'REJECT') {
                title = "Transaction Rejected";
                description = "The transaction has been returned to draft status.";
                variant = "destructive";
            } else if (decision === 'ASSIGN_ONLY') {
                title = "Assignee Saved";
                description = "The assigned auditor has been updated successfully.";
                variant = "default";
            }

            toast({
                title,
                description,
                variant
            });

            onActionComplete?.();
            if (decision !== 'ASSIGN_ONLY') {
                onOpenChange(false);
            }
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error?.message || "Failed to process request. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!item) return null;

    const isHistory = item.status.toLowerCase().includes('history') ||
        item.status.toLowerCase().includes('approve') ||
        item.status.toLowerCase().includes('reject') ||
        item.status.toLowerCase().includes('done');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl bg-background/95 backdrop-blur-lg border-primary/10 shadow-2xl overflow-hidden p-0 gap-0">
                <DialogHeader className="p-6 bg-muted/30 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">Audit Review Flow</DialogTitle>
                                <p className="text-xs text-muted-foreground font-medium">Carefully review the transaction details below.</p>
                            </div>
                        </div>
                        <Badge variant="outline" className={cn(
                            "h-7 font-bold text-[10px] uppercase tracking-widest px-3",
                            item.status.includes('Ongoing') ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                item.status.includes('Done') ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                    "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        )}>
                            {item.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex divide-x">
                    {/* Left side: Transaction Details */}
                    <div className="flex-1 p-6 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <History className="h-3 w-3" /> Transaction Information
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem
                                    icon={FileText}
                                    label="Reference No"
                                    value={item.transactionId || 'N/A'}
                                    mono
                                />
                                <DetailItem
                                    icon={Calendar}
                                    label="Period Date"
                                    value={item.date ? format(new Date(item.date), 'MMM dd, yyyy') : 'N/A'}
                                />
                                <DetailItem
                                    icon={Banknote}
                                    label="Bank Account"
                                    value={item.bankName || 'No Bank Assigned'}
                                />
                                <DetailItem
                                    icon={User}
                                    label="Initiated By"
                                    value={item.initiatedBy || 'System'}
                                />
                                <DetailItem
                                    icon={ShieldCheck}
                                    label="Assigned To"
                                    value={item.assignee || 'Unassigned'}
                                />
                            </div>

                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mt-6 text-center">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Audit Amount</div>
                                <div className="text-3xl font-mono font-black text-primary">
                                    ₱{item.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Transaction Details</h4>
                            <div className="p-3 bg-muted/30 rounded-lg text-sm leading-relaxed border border-border/50 max-h-[100px] overflow-auto">
                                {item.details || 'No additional details provided.'}
                            </div>
                        </div>
                        <div className="space-y-4 pt-6 mt-6 border-t border-border/50">
                            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <FileText className="h-3 w-3" /> Transaction Ledger History
                            </h4>
                            <TransactionLedgerHistory transactionId={item.transactionId || ''} />
                        </div>
                    </div>

                    {/* Right side: Auditor Actions */}
                    <div className="w-[300px] p-6 bg-muted/10 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                    <User className="h-3 w-3" /> Assignee
                                </Label>
                                <div className="flex gap-2">
                                    <Select value={assignee} onValueChange={setAssignee} disabled={isHistory}>
                                        <SelectTrigger className="flex-1 bg-background text-xs h-9">
                                            <SelectValue placeholder="Select auditor..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={u.username || `${u.firstName} ${u.lastName}`}>
                                                    {u.firstName} {u.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 px-3 shrink-0 text-xs font-semibold"
                                        onClick={() => handleAction('ASSIGN_ONLY')}
                                        disabled={isSubmitting || isLoadingUsers || (!assignee || assignee === item?.assignee) || isHistory}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>

                            <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2 pt-4">
                                <MessageSquare className="h-3 w-3" /> Auditor Findings
                            </h4>
                            <Textarea
                                placeholder="Add internal notes or reasons for rejection..."
                                className="min-h-[150px] text-xs leading-relaxed resize-none focus-visible:ring-primary"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                disabled={isHistory}
                            />
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-bold"
                                size="lg"
                                onClick={() => handleAction('APPROVE')}
                                disabled={isSubmitting || isHistory}
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                Approve & Post
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold"
                                size="lg"
                                onClick={() => handleAction('REJECT')}
                                disabled={isSubmitting || isHistory}
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                Reject & Revise
                            </Button>

                            <div className="flex items-start gap-2 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20 mt-4">
                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] leading-tight text-amber-700 font-medium italic">
                                    Approved transactions will be automatically posted to the General Ledger.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DetailItem({ icon: Icon, label, value, mono = false }: { icon: any, label: string, value: string, mono?: boolean }) {
    return (
        <div className="space-y-1 overflow-hidden">
            <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Icon className="h-2.5 w-2.5" /> {label}
            </div>
            <div className={cn("text-xs font-semibold truncate", mono && "font-mono")}>
                {value}
            </div>
        </div>
    );
}

function TransactionLedgerHistory({ transactionId }: { transactionId: string }) {
    const [ledgers, setLedgers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!transactionId) {
            setLoading(false);
            return;
        }

        async function fetchLedger() {
            try {
                setLoading(true);
                const res = await fetch(`/api/transactions/by-reference?ref=${transactionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setLedgers(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchLedger();
    }, [transactionId]);

    // calculate totals
    const totalDebit = ledgers.reduce((sum, item) => sum + (item.debit || 0), 0);
    const totalCredit = ledgers.reduce((sum, item) => sum + (item.credit || 0), 0);
    const isBalanced = Math.round(Math.abs(totalDebit - totalCredit) * 100) === 0;

    return (
        <div className="space-y-3">
            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px] text-[10px] font-bold text-muted-foreground uppercase">Date</TableHead>
                            <TableHead className="text-[10px] font-bold text-muted-foreground uppercase">Account</TableHead>
                            <TableHead className="text-[10px] font-bold text-muted-foreground text-right w-[100px] uppercase">Debit (₱)</TableHead>
                            <TableHead className="text-[10px] font-bold text-muted-foreground text-right w-[100px] uppercase">Credit (₱)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : ledgers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-xs text-muted-foreground">
                                    No ledger details found for this transaction.
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {ledgers.map((l) => (
                                    <TableRow key={l.id}>
                                        <TableCell className="text-[9px] py-1.5 align-top whitespace-nowrap">{l.date ? format(new Date(l.date), 'MMM dd, yyyy') : '-'}</TableCell>
                                        <TableCell className="text-[11px] py-1.5 font-medium leading-tight">
                                            <div className="line-clamp-2">{l.accountName || l.particulars || 'G/L Adjustment'}</div>
                                            {l.accountNumber && <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{l.accountNumber}</div>}
                                        </TableCell>
                                        <TableCell className="text-[11px] py-1.5 text-right tabular-nums font-mono align-top">{l.debit > 0 ? l.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</TableCell>
                                        <TableCell className="text-[11px] py-1.5 text-right tabular-nums font-mono align-top">{l.credit > 0 ? l.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/30">
                                    <TableCell colSpan={2} className="text-[10px] uppercase font-black text-right py-2">
                                        Total
                                    </TableCell>
                                    <TableCell className={cn("text-[11px] font-black text-right tabular-nums font-mono py-2", !isBalanced && "text-destructive")}>
                                        {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className={cn("text-[11px] font-black text-right tabular-nums font-mono py-2", !isBalanced && "text-destructive")}>
                                        {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
            {!loading && ledgers.length > 0 && !isBalanced && (
                <div className="text-xs text-destructive flex items-center gap-1.5 font-medium p-2 bg-destructive/10 rounded-md">
                    <AlertTriangle className="h-4 w-4" /> Unbalanced transaction detected. Difference: ₱{Math.abs(totalDebit - totalCredit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            )}
        </div>
    )
}
