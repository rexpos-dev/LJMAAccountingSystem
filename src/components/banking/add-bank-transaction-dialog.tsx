'use client';

import { useState, useMemo } from 'react';
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    ChevronRight,
    ChevronLeft,
    Check,
    UserCircle,
    Truck,
    Receipt,
    RefreshCw,
    SlidersHorizontal,
    ArrowRightLeft,
    Wallet
} from 'lucide-react';
import { useBankAccounts, useAccounts } from '@/hooks/use-accounts';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type TransactionType = 'CUSTOMER_PAYMENT' | 'SUPPLIER_PAYMENT' | 'EXPENSE_PAYMENT' | 'TRANSFER' | 'ADJUSTMENT';

interface StepProps {
    onNext: () => void;
    onBack: () => void;
    formData: any;
    setFormData: (data: any) => void;
}

export default function AddBankTransactionDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: '' as TransactionType | '',
        bankAccountId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        referenceType: 'Invoice',
        referenceNumber: '',
        amount: '',
        description: '',
        targetBankAccountId: '', // for transfers
    });

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleClose = () => {
        setStep(1);
        setFormData({
            type: '',
            bankAccountId: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            referenceType: 'Invoice',
            referenceNumber: '',
            amount: '',
            description: '',
            targetBankAccountId: '',
        });
        closeDialog('add-bank-transaction');
    };

    return (
        <Dialog open={openDialogs['add-bank-transaction']} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-md border-primary/10 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {step}
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            {step === 1 && "Select Transaction Type"}
                            {step === 2 && "Transaction Details"}
                            {step === 3 && "Accounting Preview"}
                        </DialogTitle>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </DialogHeader>

                <div className="py-6">
                    {step === 1 && <Step1SelectType formData={formData} setFormData={setFormData} onNext={handleNext} />}
                    {step === 2 && <Step2Details formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />}
                    {step === 3 && <Step3Preview formData={formData} onBack={handleBack} onSaveDraft={handleClose} onSubmit={handleClose} />}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Step1SelectType({ formData, setFormData, onNext }: { formData: any, setFormData: any, onNext: () => void }) {
    const types: { id: TransactionType, label: string, icon: any, color: string, desc: string }[] = [
        { id: 'CUSTOMER_PAYMENT', label: 'Customer Payment', icon: UserCircle, color: 'text-emerald-500', desc: 'Recording payment received from a customer' },
        { id: 'SUPPLIER_PAYMENT', label: 'Supplier Payment', icon: Truck, color: 'text-blue-500', desc: 'Paying a supplier for outstanding invoices' },
        { id: 'EXPENSE_PAYMENT', label: 'Expense Payment', icon: Receipt, color: 'text-rose-500', desc: 'Direct payment for business expenses' },
        { id: 'TRANSFER', label: 'Bank Transfer', icon: ArrowRightLeft, color: 'text-violet-500', desc: 'Moving funds between bank accounts' },
        { id: 'ADJUSTMENT', label: 'Adjustment', icon: SlidersHorizontal, color: 'text-amber-500', desc: 'Manual correction or miscellaneous movement' },
    ];

    return (
        <div className="grid grid-cols-1 gap-3">
            {types.map((t) => (
                <button
                    key={t.id}
                    onClick={() => {
                        setFormData({ ...formData, type: t.id });
                        onNext();
                    }}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-muted/50 text-left group",
                        formData.type === t.id ? "border-primary bg-primary/5 shadow-md" : "border-border/50"
                    )}
                >
                    <div className={cn("p-2.5 rounded-lg bg-background shadow-sm border group-hover:scale-110 transition-transform", t.color)}>
                        <t.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-foreground">{t.label}</div>
                        <div className="text-xs text-muted-foreground">{t.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            ))}
        </div>
    );
}

function Step2Details({ formData, setFormData, onNext, onBack }: { formData: any, setFormData: any, onNext: () => void, onBack: () => void }) {
    const { accounts: bankAccounts } = useBankAccounts();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Bank Account</Label>
                    <Select
                        value={formData.bankAccountId}
                        onValueChange={(val) => setFormData({ ...formData, bankAccountId: val })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {bankAccounts.map(acc => (
                                <SelectItem key={acc.id} value={acc.id || ''}>{acc.account_name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="h-10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Reference Type</Label>
                    <Select
                        value={formData.referenceType}
                        onValueChange={(val) => setFormData({ ...formData, referenceType: val })}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Invoice">Invoice</SelectItem>
                            <SelectItem value="PO">Purchase Order</SelectItem>
                            <SelectItem value="Expense">Expense</SelectItem>
                            <SelectItem value="Adjustment">Adjustment</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Reference Number</Label>
                    <Input
                        placeholder="Ref #"
                        value={formData.referenceNumber}
                        onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                        className="h-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Amount</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₱</span>
                    <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8 h-10 font-mono text-lg"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    placeholder="Enter transaction description..."
                    className="resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />
            </div>

            <DialogFooter className="pt-4 gap-2">
                <Button variant="ghost" onClick={onBack} className="flex-1 border hover:bg-muted font-semibold">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                    onClick={onNext}
                    className="flex-1 shadow-lg shadow-primary/20 font-semibold"
                    disabled={!formData.bankAccountId || !formData.amount}
                >
                    Accounting Preview <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </DialogFooter>
        </div>
    );
}

function Step3Preview({ formData, onBack, onSaveDraft, onSubmit }: { formData: any, onBack: () => void, onSaveDraft: () => void, onSubmit: () => void }) {
    const { accounts: bankAccounts } = useBankAccounts();
    const { data: allAccounts } = useAccounts();

    const amount = parseFloat(formData.amount) || 0;
    const selectedBank = bankAccounts.find(a => a.id === formData.bankAccountId);

    const journalPreview = useMemo(() => {
        const preview = [];
        const bankName = selectedBank?.account_name || 'Bank Account';

        switch (formData.type) {
            case 'CUSTOMER_PAYMENT':
                preview.push({ account: bankName, dr: amount, cr: 0, type: 'DEBIT' });
                preview.push({ account: 'Accounts Receivable', dr: 0, cr: amount, type: 'CREDIT' });
                break;
            case 'SUPPLIER_PAYMENT':
                preview.push({ account: 'Accounts Payable', dr: amount, cr: 0, type: 'DEBIT' });
                preview.push({ account: bankName, dr: 0, cr: amount, type: 'CREDIT' });
                break;
            case 'EXPENSE_PAYMENT':
                preview.push({ account: 'Operating Expense', dr: amount, cr: 0, type: 'DEBIT' });
                preview.push({ account: bankName, dr: 0, cr: amount, type: 'CREDIT' });
                break;
            case 'TRANSFER':
                preview.push({ account: 'Target Bank Account', dr: amount, cr: 0, type: 'DEBIT' });
                preview.push({ account: bankName, dr: 0, cr: amount, type: 'CREDIT' });
                break;
            case 'ADJUSTMENT':
                preview.push({ account: bankName, dr: amount, cr: 0, type: 'DEBIT' });
                preview.push({ account: 'Suspense/Adjustment Account', dr: 0, cr: amount, type: 'CREDIT' });
                break;
        }
        return preview;
    }, [formData, selectedBank, amount]);

    return (
        <div className="space-y-6">
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Wallet className="h-4 w-4" /> Automatic Journal Preview
                    </h4>
                    <div className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-[10px] font-bold border border-emerald-500/20">
                        BALANCED
                    </div>
                </div>

                <div className="space-y-0.5">
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-muted-foreground border-b pb-2 mb-2 px-2">
                        <div className="col-span-6">ACCOUNT</div>
                        <div className="col-span-3 text-right">DEBIT</div>
                        <div className="col-span-3 text-right">CREDIT</div>
                    </div>
                    {journalPreview.map((line, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 py-2 px-2 hover:bg-muted/50 rounded-lg transition-colors">
                            <div className="col-span-6 text-sm font-medium">{line.account}</div>
                            <div className="col-span-3 text-right font-mono text-sm text-emerald-600">
                                {line.dr > 0 ? `₱${line.dr.toLocaleString()}` : '-'}
                            </div>
                            <div className="col-span-3 text-right font-mono text-sm text-rose-600">
                                {line.cr > 0 ? `₱${line.cr.toLocaleString()}` : '-'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-xs text-muted-foreground italic px-2">
                * This preview is generated automatically based on standard accounting rules and your transaction details.
            </div>

            <DialogFooter className="pt-4 gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1 font-semibold">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <div className="flex-[2] flex gap-2">
                    <Button variant="secondary" onClick={onSaveDraft} className="flex-1 font-semibold">
                        Save Draft
                    </Button>
                    <Button onClick={onSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-semibold">
                        Submit for Audit
                    </Button>
                </div>
            </DialogFooter>
        </div>
    );
}
