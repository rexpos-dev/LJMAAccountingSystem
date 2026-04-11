'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    CalendarIcon,
    Loader2,
    ArrowRightLeft,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    AlertCircle,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBankAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const formatCurrency = (amount: number | string | undefined) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(num || 0);
};

export default function ReconcileAccountDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { accounts: bankAccounts } = useBankAccounts();
    const { toast } = useToast();

    // Top Section State
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [statementDate, setStatementDate] = useState<Date | undefined>(new Date());
    const [statementBalance, setStatementBalance] = useState<string>('0.00');

    // Transactions State
    const [systemTransactions, setSystemTransactions] = useState<any[]>([]);
    const [bankTransactions, setBankTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Matching State
    const [selectedSystemIds, setSelectedSystemIds] = useState<Set<string>>(new Set());
    const [selectedBankIds, setSelectedBankIds] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch transactions when account changes
    useEffect(() => {
        if (selectedAccountId && openDialogs['reconcile-account']) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/bank-transactions?bankAccountId=${selectedAccountId}`);
                    if (response.ok) {
                        const data = await response.json();
                        // Only "POSTED" transactions are available for reconciliation
                        setSystemTransactions(data.filter((t: any) => t.status === 'POSTED'));

                        // Mock bank transactions for demonstration (in real app, this comes from bank feed/upload)
                        setBankTransactions(data.filter((t: any) => t.status === 'POSTED').map((t: any) => ({
                            ...t,
                            id: `bank-${t.id}`,
                            source: 'BANK_STATEMENT'
                        })));

                        setSelectedSystemIds(new Set());
                        setSelectedBankIds(new Set());
                    }
                } catch (error) {
                    toast({ title: "Error", description: "Failed to load transactions", variant: "destructive" });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [selectedAccountId, openDialogs['reconcile-account']]);

    // Totals Calculation
    const systemBalance = useMemo(() =>
        systemTransactions
            .filter(t => selectedSystemIds.has(t.id))
            .reduce((sum, t) => sum + (t.type.includes('IN') ? t.amount : -t.amount), 0)
        , [systemTransactions, selectedSystemIds]);

    const bankBalance = useMemo(() =>
        bankTransactions
            .filter(t => selectedBankIds.has(t.id))
            .reduce((sum, t) => sum + (t.type.includes('IN') ? t.amount : -t.amount), 0)
        , [bankTransactions, selectedBankIds]);

    const targetBalance = parseFloat(statementBalance) || 0;
    const systemToStatementDiff = systemBalance - targetBalance;
    const systemToBankDiff = systemBalance - bankBalance;

    const handleReconcile = async () => {
        if (Math.abs(systemToStatementDiff) > 0.01) {
            toast({ title: "Out of Balance", description: "System balance must match statement balance.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            toast({ title: "Success", description: "Reconciliation completed successfully!" });
            setIsSubmitting(false);
            closeDialog('reconcile-account');
        }, 1500);
    };

    const toggleSystemItem = (id: string) => {
        const next = new Set(selectedSystemIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedSystemIds(next);
    };

    const toggleBankItem = (id: string) => {
        const next = new Set(selectedBankIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedBankIds(next);
    };

    return (
        <Dialog open={openDialogs['reconcile-account']} onOpenChange={() => closeDialog('reconcile-account')}>
            <DialogContent className="max-w-[1500px] h-[95vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-md">
                {/* Header Section */}
                <div className="p-6 border-b bg-card/50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">Bank Reconciliation</DialogTitle>
                                <p className="text-xs text-muted-foreground font-medium">Match internal ledger against bank statements.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className={cn(
                                "h-8 px-4 font-bold text-xs uppercase tracking-wider",
                                Math.abs(systemToStatementDiff) < 0.01 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            )}>
                                {Math.abs(systemToStatementDiff) < 0.01 ? "Balanced" : "Out of Balance"}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-6">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Select Bank</Label>
                            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                                <SelectTrigger className="h-10 bg-background">
                                    <SelectValue placeholder="Choose account..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {bankAccounts.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id || ''}>
                                            {acc.bank_name} {acc.bank_account_no ? `- ${acc.bank_account_no}` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Statement Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start h-10 bg-background font-medium">
                                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                        {statementDate ? format(statementDate, 'MMM dd, yyyy') : "Pick date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={statementDate} onSelect={setStatementDate} /></PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Statement Balance</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₱</span>
                                <Input
                                    className="pl-7 h-10 bg-background font-mono font-bold"
                                    value={statementBalance}
                                    onChange={(e) => setStatementBalance(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">System Balance</Label>
                            <div className="h-10 px-3 flex items-center bg-muted/50 rounded-md border border-white/5 font-mono font-bold text-primary">
                                {formatCurrency(systemBalance)}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Difference</Label>
                            <div className={cn(
                                "h-10 px-3 flex items-center rounded-md border font-mono font-bold",
                                Math.abs(systemToStatementDiff) < 0.01
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            )}>
                                {formatCurrency(systemToStatementDiff)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Split Content */}
                <div className="flex-1 flex min-h-0 divide-x divide-border">
                    {/* Left Panel: System Transactions */}
                    <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
                        <div className="px-4 h-[60px] border-b flex items-center justify-between bg-card/30">
                            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> System Transactions (Ledger)
                            </h3>
                            <Badge variant="secondary" className="font-mono h-6 px-2 text-[10px]">
                                {systemTransactions.length} items
                            </Badge>
                        </div>
                        <ScrollArea className="flex-1">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    <TableRow className="hover:bg-transparent border-b h-10">
                                        <TableHead className="w-12 text-center"></TableHead>
                                        <TableHead className="w-[85px] text-[10px] font-bold uppercase">Date</TableHead>
                                        <TableHead className="w-[100px] text-[10px] font-bold uppercase">Ref</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase">Particulars</TableHead>
                                        <TableHead className="w-[140px] text-right text-[10px] font-bold uppercase">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Loading ledger...</TableCell></TableRow>
                                    ) : systemTransactions.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No posted transactions found.</TableCell></TableRow>
                                    ) : (
                                        systemTransactions.map(t => (
                                            <TableRow
                                                key={t.id}
                                                className={cn(
                                                    "cursor-pointer transition-colors duration-200",
                                                    selectedSystemIds.has(t.id) ? "bg-emerald-500/5 hover:bg-emerald-500/10" : "hover:bg-muted/50"
                                                )}
                                                onClick={() => toggleSystemItem(t.id)}
                                            >
                                                <TableCell><Checkbox checked={selectedSystemIds.has(t.id)} /></TableCell>
                                                <TableCell className="text-xs font-medium">{format(new Date(t.date), 'MM/dd/yy')}</TableCell>
                                                <TableCell className="text-xs font-mono text-muted-foreground">{t.reference?.substring(0, 8) || t.id.substring(0, 8)}</TableCell>
                                                <TableCell className="text-xs font-medium max-w-[150px] truncate">{t.particulars}</TableCell>
                                                <TableCell className={cn(
                                                    "text-right font-mono font-bold",
                                                    t.type.includes('IN') ? "text-emerald-600" : "text-rose-600"
                                                )}>
                                                    {t.type.includes('IN') ? '+' : '-'}{formatCurrency(t.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>

                    {/* Right Panel: Bank Statement */}
                    <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
                        <div className="px-4 h-[60px] border-b flex items-center justify-between bg-card/30">
                            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500" /> Bank Statement Entries
                            </h3>
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-tight gap-1 hover:bg-primary/5">
                                <Info className="h-3 w-3" /> Import Bank Feed
                            </Button>
                        </div>
                        <ScrollArea className="flex-1">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background z-10">
                                    <TableRow className="hover:bg-transparent border-b h-10">
                                        <TableHead className="w-12 text-center"></TableHead>
                                        <TableHead className="w-[85px] text-[10px] font-bold uppercase">Date</TableHead>
                                        <TableHead className="text-[10px] font-bold uppercase">Description</TableHead>
                                        <TableHead className="w-[110px] text-center text-[10px] font-bold uppercase">Status</TableHead>
                                        <TableHead className="w-[140px] text-right text-[10px] font-bold uppercase">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Parsing data...</TableCell></TableRow>
                                    ) : bankTransactions.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">No bank feed data available.</TableCell></TableRow>
                                    ) : (
                                        bankTransactions.map(t => {
                                            const isMatched = selectedBankIds.has(t.id);
                                            return (
                                                <TableRow
                                                    key={t.id}
                                                    className={cn(
                                                        "cursor-pointer transition-all duration-200",
                                                        isMatched ? "bg-emerald-500/5 hover:bg-emerald-500/10" : "bg-card/30 hover:bg-muted/50"
                                                    )}
                                                    onClick={() => toggleBankItem(t.id)}
                                                >
                                                    <TableCell><Checkbox checked={isMatched} /></TableCell>
                                                    <TableCell className="text-xs font-medium">{format(new Date(t.date), 'MM/dd/yy')}</TableCell>
                                                    <TableCell className="text-xs font-medium max-w-[200px] truncate">{t.particulars}</TableCell>
                                                    <TableCell className="text-center">
                                                        {isMatched ? (
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-bold border border-emerald-500/20 uppercase">
                                                                <CheckCircle2 className="h-2.5 w-2.5" /> Matched
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[9px] font-bold border border-rose-500/20 uppercase">
                                                                <AlertCircle className="h-2.5 w-2.5" /> Unmatched
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className={cn(
                                                        "text-right font-mono font-bold",
                                                        t.type.includes('IN') ? "text-emerald-600" : "text-rose-600"
                                                    )}>
                                                        {t.type.includes('IN') ? '+' : '-'}{formatCurrency(t.amount)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                </div>

                {/* Bottom Stats Footer */}
                <div className="p-4 border-t bg-card/80 backdrop-blur-md">
                    <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto items-center">
                        <div className="flex flex-col gap-1 items-center justify-center border-r">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Matched Total</span>
                            <span className="text-lg font-mono font-bold text-emerald-600">{formatCurrency(bankBalance)}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-center justify-center border-r">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unmatched Total</span>
                            <span className="text-lg font-mono font-bold text-rose-600">{formatCurrency(targetBalance - bankBalance)}</span>
                        </div>
                        <div className="flex flex-col gap-1 items-center justify-center border-r">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reconciliation Diff</span>
                            <span className={cn(
                                "text-lg font-mono font-bold",
                                Math.abs(systemToBankDiff) < 0.01 ? "text-emerald-600" : "text-amber-500"
                            )}>{formatCurrency(systemToBankDiff)}</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 scale-100 active:scale-95 transition-all"
                                disabled={Math.abs(systemToStatementDiff) > 0.01 || isSubmitting || systemTransactions.length === 0}
                                onClick={handleReconcile}
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                                Complete Reconciliation
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
