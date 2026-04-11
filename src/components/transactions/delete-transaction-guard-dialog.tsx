'use client';

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, Trash2, AlertTriangle, History, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '@/types/transaction';

// --- Types ---
export interface DeleteGuardPayload {
    error: 'TRANSACTION_HAS_HISTORY';
    message: string;
    transactionRef: string;
    count: number;
    latestAction: string | null;
    latestStatus: string | null;
    latestAt: string | null;
}

type DialogMode = 'confirm' | 'blocked' | null;

interface DeleteTransactionGuardDialogProps {
    mode: DialogMode;
    transaction: Transaction | null;
    blockedPayload?: DeleteGuardPayload | null;
    isDeleting?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

// -----------------------------------------------------------------------
// Main component — renders either the "blocked" view or "confirm" view
// -----------------------------------------------------------------------
export function DeleteTransactionGuardDialog({
    mode,
    transaction,
    blockedPayload,
    isDeleting,
    onConfirm,
    onClose,
}: DeleteTransactionGuardDialogProps) {
    if (!mode) return null;

    const isBlocked = mode === 'blocked';

    return (
        <AlertDialog open={!!mode} onOpenChange={(open) => { if (!open) onClose(); }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    {/* Header icon + title */}
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${isBlocked ? 'bg-destructive/10' : 'bg-amber-500/10'}`}>
                            {isBlocked
                                ? <ShieldAlert className="h-6 w-6 text-destructive" />
                                : <ShieldCheck className="h-6 w-6 text-amber-600" />
                            }
                        </div>
                        <div>
                            <AlertDialogTitle className={isBlocked ? 'text-destructive' : ''}>
                                {isBlocked ? 'Deletion Blocked' : 'Confirm Delete Transaction'}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-1 text-xs text-muted-foreground">
                                {isBlocked
                                    ? 'This transaction is protected by an audit trail.'
                                    : 'This action cannot be undone. Please review before proceeding.'}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                {/* ---- BLOCKED MODE ---- */}
                {isBlocked && blockedPayload && (
                    <div className="space-y-4 mt-2">
                        {/* Audit history summary box */}
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                                <History className="h-4 w-4 shrink-0" />
                                Audit History Detected
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p className="text-muted-foreground font-medium mb-0.5">Reference</p>
                                    <p className="font-mono font-semibold">{blockedPayload.transactionRef}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground font-medium mb-0.5">Audit Records</p>
                                    <Badge variant="destructive" className="text-xs">{blockedPayload.count} records</Badge>
                                </div>
                                {blockedPayload.latestAction && (
                                    <div>
                                        <p className="text-muted-foreground font-medium mb-0.5">Latest Action</p>
                                        <p className="font-medium">{blockedPayload.latestAction}</p>
                                    </div>
                                )}
                                {blockedPayload.latestStatus && (
                                    <div>
                                        <p className="text-muted-foreground font-medium mb-0.5">Audit Status</p>
                                        <Badge variant="outline" className="text-xs">{blockedPayload.latestStatus}</Badge>
                                    </div>
                                )}
                                {blockedPayload.latestAt && (
                                    <div className="col-span-2">
                                        <p className="text-muted-foreground font-medium mb-0.5">Last Audited On</p>
                                        <p className="font-medium">{format(new Date(blockedPayload.latestAt), 'MMM dd, yyyy • h:mm a')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Policy notice */}
                        <div className="flex items-start gap-2 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                Transactions with audit records cannot be deleted to maintain data integrity and compliance.
                                Contact your administrator if removal is absolutely necessary.
                            </p>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </div>
                )}

                {/* ---- CONFIRM MODE ---- */}
                {!isBlocked && transaction && (
                    <div className="space-y-4 mt-2">
                        {/* Transaction detail card */}
                        <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                                <FileText className="h-4 w-4 shrink-0" />
                                Transaction Details
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-muted-foreground font-medium">Reference No.</p>
                                    <p className="font-mono font-semibold">{transaction.transNo || '—'}</p>
                                </div>
                                {transaction.date && (
                                    <div>
                                        <p className="text-muted-foreground font-medium">Date</p>
                                        <p className="font-medium">
                                            {format(
                                                transaction.date instanceof Date ? transaction.date : new Date(transaction.date as any),
                                                'MMM dd, yyyy'
                                            )}
                                        </p>
                                    </div>
                                )}
                                {transaction.accountName && (
                                    <div className="col-span-2">
                                        <p className="text-muted-foreground font-medium">Account</p>
                                        <p className="font-medium">{transaction.accountName}</p>
                                    </div>
                                )}
                                {transaction.particulars && (
                                    <div className="col-span-2">
                                        <p className="text-muted-foreground font-medium">Particulars</p>
                                        <p className="font-medium line-clamp-2">{transaction.particulars}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Warning notice */}
                        <div className="flex items-start gap-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                            <p className="text-xs text-destructive/90 leading-relaxed font-medium">
                                You are about to permanently delete this transaction. This action is <strong>irreversible</strong> and will affect the General Ledger balance.
                            </p>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button variant="outline" onClick={onClose} disabled={isDeleting}>Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    variant="destructive"
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </div>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
}
