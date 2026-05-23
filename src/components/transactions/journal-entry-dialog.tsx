'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
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
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Plus, Trash2, BookOpen, Scale, FileText, CheckCircle2, AlertCircle, ArrowRightLeft, X, Save, RefreshCw, Activity, Terminal, ShieldCheck, Zap, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import format from '@/lib/date-format';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';

interface JournalEntryLine {
    id: string;
    accountId: string;
    accountName: string;
    amount: number;
    type: 'debit' | 'credit';
}

export default function JournalEntryDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { toast } = useToast();
    const { data: accounts, isLoading: accountsLoading } = useAccounts();
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [journal, setJournal] = useState('general');
    const [reference, setReference] = useState('GJ[AUTO]');
    const [journalMemo, setJournalMemo] = useState('Journal Entry');
    const [lines, setLines] = useState<JournalEntryLine[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const totalDebits = useMemo(() => lines.filter(l => l.type === 'debit').reduce((sum, l) => sum + l.amount, 0), [lines]);
    const totalCredits = useMemo(() => lines.filter(l => l.type === 'credit').reduce((sum, l) => sum + l.amount, 0), [lines]);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && lines.length > 0;
    const balanceDifference = Math.abs(totalDebits - totalCredits);

    const addLine = () => {
        const newLine: JournalEntryLine = {
            id: `line-${Date.now()}-${Math.random()}`,
            accountId: '',
            accountName: '',
            amount: 0,
            type: lines.length % 2 === 0 ? 'debit' : 'credit',
        };
        setLines([...lines, newLine]);
    };

    const removeLine = (id: string) => {
        setLines(lines.filter(line => line.id !== id));
    };

    const fetchNextReference = async () => {
        try {
            const response = await fetch('/api/transactions/next-reference');
            if (response.ok) {
                const data = await response.json();
                setReference(data.nextReference);
            }
        } catch (error) {
            console.error('Error fetching next reference:', error);
        }
    };

    useEffect(() => {
        if (openDialogs['journal-entry']) {
            fetchNextReference();
            if (!date) setDate(new Date());
        }
    }, [openDialogs['journal-entry']]);

    const updateLine = (id: string, updates: Partial<JournalEntryLine>) => {
        setLines(lines.map(line => {
            if (line.id === id) {
                const updated = { ...line, ...updates };
                if (updates.accountId && accounts) {
                    const account = accounts.find(acc => acc.id === updates.accountId);
                    if (account) updated.accountName = account.account_name;
                }
                return updated;
            }
            return line;
        }));
    };

    const handleRecord = async () => {
        if (!date || lines.length === 0 || !isBalanced) {
            toast({ title: 'Validation Error', description: !isBalanced ? 'Entry must be balanced (Debits = Credits)' : 'Check all fields', variant: 'destructive' });
            return;
        }

        setIsSaving(true);
        try {
            const transactions = lines.map((line) => {
                const account = accounts?.find(acc => acc.id === line.accountId);
                return {
                    ledger: journal === 'general' ? 'General Ledger' : journal.charAt(0).toUpperCase() + journal.slice(1) + ' Ledger',
                    transNo: reference,
                    code: account?.account_no?.toString() || '',
                    accountNumber: account?.account_no?.toString() || '',
                    date: date.toISOString(),
                    invoiceNumber: reference,
                    particulars: journalMemo,
                    debit: line.type === 'debit' ? line.amount : 0,
                    credit: line.type === 'credit' ? line.amount : 0,
                    balance: 0,
                    accountName: account?.account_name || '',
                    user: 'System',
                };
            });

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactions }),
            });

            if (!response.ok) throw new Error('Failed to record journal entry');

            toast({ title: 'Success', description: 'Journal entry recorded successfully' });
            window.dispatchEvent(new CustomEvent('journal-refresh'));
            handleClose();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (!isSaving) {
            setLines([]);
            closeDialog('journal-entry');
        }
    };

    return (
        <Dialog open={openDialogs['journal-entry']} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] flex flex-col p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl">
                {/* Premium Header */}
                <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none text-foreground">Ledger Protocol</DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">Manual Overwrite</span>
                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Core Transaction Engine</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        {/* Real-time Status Indicator */}
                        <div className={cn(
                            "px-6 py-3 rounded-2xl border transition-all duration-500 flex items-center gap-4",
                            isBalanced ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                        )}>
                            <div className="relative">
                                {isBalanced ? <ShieldCheck className="h-5 w-5" /> : <Activity className="h-5 w-5 animate-pulse" />}
                                {isBalanced && <div className="absolute inset-0 bg-emerald-500/40 blur-md rounded-full -z-10" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">{isBalanced ? "State Validated" : "Awaiting Balance"}</span>
                                <span className="text-sm font-mono font-bold tracking-tighter">
                                    {isBalanced ? "Matrix Synchronized" : `Disparity: ₱${balanceDifference.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                </span>
                            </div>
                        </div>


                    </div>
                </div>

                <div className="flex-1 flex gap-8 p-8 overflow-hidden bg-black/20">
                    {/* Left: General Info */}
                    <div className="w-[450px] flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar shrink-0">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Requisition Parameters</h3>
                            </div>

                            <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-3xl space-y-6 backdrop-blur-sm shadow-xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Event Horizon</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={'outline'} className={cn( 'w-full justify-start text-left font-bold bg-foreground/5 border-foreground/10 rounded-2xl transition-all hover:bg-foreground/10 text-foreground uppercase text-xs', !date && 'text-muted-foreground' )} >
                                                    <CalendarIcon className="mr-3 h-4 w-4 text-primary" />
                                                    {date ? format(date, 'MMM dd, yyyy') : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-card border-foreground/10">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Serial Node</Label>
                                        <div className="relative group">
                                            <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                                            <Input value={reference} onChange={(e) => setReference(e.target.value)}
                                                className="h-12 bg-foreground/5 border-foreground/10 rounded-2xl pl-11 font-mono text-primary font-black uppercase tracking-tighter focus:bg-foreground/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Ledger Domain</Label>
                                    <Select value={journal} onValueChange={setJournal}>
                                        <SelectTrigger className=" bg-foreground/5 border-foreground/10 rounded-2xl font-black uppercase text-xs text-foreground">
                                            <SelectValue placeholder="General" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-foreground/10 text-foreground">
                                            <SelectItem value="general" className="font-bold uppercase text-[10px]">General Ledger</SelectItem>
                                            <SelectItem value="payments" className="font-bold uppercase text-[10px]">Payments Ledger</SelectItem>
                                            <SelectItem value="receipts" className="font-bold uppercase text-[10px]">Receipts Ledger</SelectItem>
                                            <SelectItem value="sales" className="font-bold uppercase text-[10px]">Sales Ledger</SelectItem>
                                            <SelectItem value="purchases" className="font-bold uppercase text-[10px]">Purchases Ledger</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Intent Logic / Particulars</Label>
                                    <Textarea value={journalMemo} onChange={(e) => setJournalMemo(e.target.value)}
                                        className="bg-foreground/5 border-foreground/10 rounded-2xl min-h-[140px] p-5 text-sm font-bold leading-relaxed focus:bg-foreground/10 transition-all placeholder:text-foreground/5 text-foreground/80"
                                        placeholder="Add mission-critical particulars..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fiscal Status Matrix */}
                        <div className="bg-foreground/5 border border-foreground/10 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl backdrop-blur-md">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Database className="h-12 w-12 text-primary" />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <Scale className="h-5 w-5 text-primary" />
                                        <span className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Matrix Summary</span>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                        isBalanced ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                                    )}>
                                        {isBalanced ? "Synchronized" : "Discrepancy Detected"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">Aggregate Debits</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-bold text-foreground/20">₱</span>
                                            <p className="text-2xl font-black text-foreground italic tracking-tighter leading-none">{totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">Aggregate Credits</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-bold text-foreground/20">₱</span>
                                            <p className="text-2xl font-black text-foreground italic tracking-tighter leading-none">{totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleRecord} disabled={isSaving || !isBalanced} className="rounded-[2rem] bg-primary text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-primary/90 disabled:opacity-30 transition-all active:scale-[0.98] shadow-2xl shadow-primary/20" >
                            {isSaving ? <RefreshCw className="animate-spin mr-3 h-5 w-5" /> : <Save className="mr-3 h-6 w-6" />}
                            Commit Protocol
                        </Button>
                    </div>

                    {/* Right: Allocation Engine */}
                    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Account Allocation Matrix</h3>
                            </div>
                            <Button onClick={addLine} className="rounded-2xl bg-blue-400/10 text-blue-400 border border-blue-400/20 hover:bg-blue-400 hover:text-black transition-all px-6 font-black uppercase text-[10px] tracking-widest gap-2">
                                <Plus className="h-4 w-4 stroke-[3]" /> Push Allocation Node
                            </Button>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col bg-foreground/5 border border-foreground/10 rounded-[2rem] backdrop-blur-xl shadow-2xl relative">
                            <ScrollArea className="flex-1">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b-white/10 hover:bg-transparent">
                                            <TableHead className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] h-14 pl-8">Ledger Entity</TableHead>
                                            <TableHead className="w-[140px] text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] text-center h-14">Type Node</TableHead>
                                            <TableHead className="w-[220px] text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] text-right h-14 pr-8">Allocation Value</TableHead>
                                            <TableHead className="w-[100px] text-right h-14 pr-8"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lines.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-[400px] text-center">
                                                    <div className="flex flex-col items-center gap-6 opacity-10">
                                                        <Database className="h-20 w-20" />
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-black tracking-[0.4em] uppercase italic">Awaiting Line Input</p>
                                                            <p className="text-[10px] font-bold uppercase text-foreground/40">Push a node to begin allocation engine</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            lines.map((line, index) => (
                                                <TableRow key={line.id} className="group border-b-white/5 hover:bg-foreground/[0.02] transition-colors">
                                                    <TableCell className="pl-8">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[10px] font-mono text-foreground/20 w-6">{(index + 1).toString().padStart(2, '0')}</span>
                                                            <Select value={line.accountId} onValueChange={(value) => updateLine(line.id, { accountId: value })}>
                                                                <SelectTrigger className="w-full bg-foreground/5 border-foreground/5 rounded-2xl font-bold group-hover:bg-foreground/10 transition-all text-foreground uppercase text-xs">
                                                                    <SelectValue placeholder="Identify Target Ledger..." />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-card border-foreground/10 text-foreground max-h-[400px] w-[400px]">
                                                                    {accountsLoading ? (
                                                                        <SelectItem value="loading" disabled>Syncing Ledger Nodes...</SelectItem>
                                                                    ) : (
                                                                        accounts?.map((account) => (
                                                                            <SelectItem key={account.id} value={account.id || ''} className="rounded-xl py-3 px-4 border-b border-foreground/5 last:border-0 hover:bg-foreground/5 transition-colors">
                                                                                <div className="flex items-center gap-4">
                                                                                    <span className="font-mono text-primary font-black bg-primary/10 px-2 py-1 rounded text-[10px]">[{account.account_no}]</span>
                                                                                    <span className="font-black uppercase tracking-tight text-xs">{account.account_name}</span>
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="">
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                onClick={() => updateLine(line.id, { type: line.type === 'debit' ? 'credit' : 'debit' })}
                                                                className={cn(
                                                                    "w-20 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95",
                                                                    line.type === 'debit'
                                                                        ? "bg-primary text-black shadow-primary/20"
                                                                        : "bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-foreground hover:bg-foreground/10"
                                                                )}
                                                            >
                                                                {line.type === 'debit' ? "Debit" : "Credit"}
                                                            </button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-8">
                                                        <div className="relative group">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 font-black text-sm group-focus-within:text-primary transition-colors">₱</span>
                                                            <Input type="number" step="0.01" value={line.amount || ''} onChange={(e) => updateLine(line.id, { amount: parseFloat(e.target.value) || 0 })}
                                                                className="text-right h-12 bg-foreground/5 border-foreground/10 rounded-2xl font-black italic text-lg tracking-tighter pl-10 focus:bg-foreground/10 transition-all text-foreground"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-8 text-right">
                                                        <Button variant="ghost" size="icon" onClick={() => removeLine(line.id)}
                                                            className="h-10 w-10 rounded-xl text-foreground/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>

                            {/* Matrix Health Indicator */}
                            <div className="p-8 border-t border-foreground/10 bg-foreground/5 backdrop-blur-md flex items-center justify-between rounded-b-[2rem]">
                                <div className="flex items-center gap-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em]">Validation Node 01</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-primary/40 uppercase tracking-tighter">Debit Vol</span>
                                            <span className="text-2xl font-black text-primary italic tracking-tighter">₱{totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                    <div className="h-10 w-[1px] bg-foreground/10" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em]">Validation Node 02</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-foreground/20 uppercase tracking-tighter">Credit Vol</span>
                                            <span className="text-2xl font-black text-foreground italic tracking-tighter">₱{totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>

                                {!isBalanced && lines.length > 0 && (
                                    <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse shadow-lg shadow-amber-500/10">
                                        <AlertCircle className="h-5 w-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">
                                            Matrix Disparity: ₱{balanceDifference.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
