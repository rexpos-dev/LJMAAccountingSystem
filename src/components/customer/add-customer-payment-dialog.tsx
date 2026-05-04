'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDialog } from '@/components/layout/dialog-context';
import { useCustomers } from '@/hooks/use-customers';
import { useBankAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';
import { 
    Wallet, 
    X, 
    ShieldCheck, 
    Plus, 
    User, 
    Building2, 
    CreditCard, 
    Calendar, 
    Calculator,
    Activity,
    ClipboardCheck,
    Save
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddCustomerPaymentDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const { customers, isLoading: isLoadingCustomers } = useCustomers();
    const { accounts: bankAccounts, isLoading: isLoadingAccounts } = useBankAccounts();
    const { toast } = useToast();

    const [customerId, setCustomerId] = useState('');
    const [depositAccountId, setDepositAccountId] = useState('');
    const [paymentType, setPaymentType] = useState('Cash');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (openDialogs['add-customer-payment']) {
            const prefilledData = getDialogData('add-customer-payment' as any);

            if (prefilledData) {
                setCustomerId(prefilledData.customerId || '');
                setAmount(prefilledData.amount?.toString() || '');
                setReference(prefilledData.reference || '');
                setPaymentType(prefilledData.paymentType || 'Cash');
                setDate(() => {
                    try {
                        if (prefilledData.date) {
                            const d = new Date(prefilledData.date);
                            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
                        }
                    } catch (e) {
                        console.error('Invalid prefilled date:', prefilledData.date);
                    }
                    return new Date().toISOString().split('T')[0];
                });
                setNote(prefilledData.note || '');
            } else {
                setCustomerId('');
                setDepositAccountId('');
                setPaymentType('Cash');
                setDate(new Date().toISOString().split('T')[0]);
                setAmount('');
                setReference('');
                setNote('');
            }
        }
    }, [openDialogs['add-customer-payment'], getDialogData]);

    const handleSave = async () => {
        if (!customerId || !amount || !date || !depositAccountId || !paymentType) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields (Customer, Deposit To, Amount, Date, and Payment Type).',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const selectedCustomer = customers.find(c => c.id === customerId);
            const selectedDepositAccount = bankAccounts.find(a => a.id === depositAccountId);
            const prefilledData = getDialogData('add-customer-payment' as any);

            if (!selectedDepositAccount) {
                throw new Error("Deposit account not found");
            }

            const transactions = [
                {
                    accountNumber: selectedCustomer?.code || customerId,
                    accountName: selectedCustomer?.customerName,
                    date: new Date(date),
                    transNo: reference,
                    particulars: note || `Payment received from ${selectedCustomer?.customerName}`,
                    credit: parseFloat(amount),
                    debit: 0,
                    type: 'Payment',
                    ledger: paymentType,
                    user: 'System'
                },
                {
                    accountNumber: selectedDepositAccount.account_no.toString(),
                    accountName: selectedDepositAccount.account_name,
                    date: new Date(date),
                    transNo: reference,
                    particulars: note || `Payment deposited from ${selectedCustomer?.customerName}`,
                    credit: 0,
                    debit: parseFloat(amount),
                    type: 'Payment',
                    ledger: paymentType,
                    user: 'System'
                }
            ];

            const apiUrl = prefilledData ? '/api/customers/payments/allocate' : '/api/transactions';
            const body = prefilledData
                ? { transactions, paymentData: { reference, amount, date, customerId } }
                : { transactions };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save payment');
            }

            toast({
                title: 'Success',
                description: prefilledData ? 'Payment applied and saved successfully.' : 'Payment added successfully.',
            });

            window.dispatchEvent(new CustomEvent('payment-saved'));
            closeDialog('add-customer-payment');
        } catch (error: any) {
            console.error('Error saving payment:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to save payment.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={openDialogs['add-customer-payment']} onOpenChange={() => closeDialog('add-customer-payment')}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col">
                {/* Premium Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-400/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-400/20 text-emerald-400 border border-emerald-400/20">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">Receipt Protocol</DialogTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-400 border border-emerald-400/20">Funds Intake</span>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Inbound Liquidity v2.0</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => closeDialog('add-customer-payment')}
                        className="relative z-10 p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <ScrollArea className="max-h-[70vh]">
                    <div className="p-8 space-y-8">
                        {/* Summary Visualization */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Calculator className="h-10 w-10 text-emerald-400" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Receipt Value</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs font-bold text-emerald-400/60 uppercase">PHP</span>
                                    <span className="text-3xl font-black italic tracking-tighter text-emerald-400">
                                        {Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Activity className="h-10 w-10 text-blue-400" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Payment Method</p>
                                <span className="text-2xl font-black italic tracking-tighter text-blue-400 uppercase">
                                    {paymentType}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Entity Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Source identification</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Customer Entity</Label>
                                        <Select value={customerId} onValueChange={setCustomerId} disabled={isLoadingCustomers}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 rounded-xl text-xs font-bold uppercase">
                                                <SelectValue placeholder="Identify Source Unit" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                {customers.map((customer) => (
                                                    <SelectItem key={customer.id} value={customer.id} className="text-xs font-bold uppercase">
                                                        {customer.customerName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Capture Timestamp</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                                            <Input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="pl-10 bg-white/5 border-white/10 text-white h-11 rounded-xl text-xs font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Protocol Note</Label>
                                        <Textarea
                                            placeholder="Audit details, authorization codes, or receipt particulars..."
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white rounded-xl min-h-[100px] resize-none text-xs placeholder:text-white/10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Financial Destination */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1 h-4 bg-blue-400 rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Liquidity Channel</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Deposit Target</Label>
                                        <Select value={depositAccountId} onValueChange={setDepositAccountId} disabled={isLoadingAccounts}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 rounded-xl text-xs font-bold uppercase">
                                                <SelectValue placeholder="Destination Account" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                {bankAccounts.map((account) => (
                                                    <SelectItem key={account.id} value={account.id} className="text-xs font-bold uppercase">
                                                        {account.account_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Methodology</Label>
                                        <Select value={paymentType} onValueChange={setPaymentType}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 rounded-xl text-xs font-bold uppercase">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                <SelectItem value="Cash" className="text-xs font-bold uppercase">Cash Protocol</SelectItem>
                                                <SelectItem value="Check" className="text-xs font-bold uppercase">Check Settlement</SelectItem>
                                                <SelectItem value="Bank Transfer" className="text-xs font-bold uppercase">Digital Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Reference ID</Label>
                                            <Input
                                                placeholder="REF-000"
                                                value={reference}
                                                onChange={(e) => setReference(e.target.value)}
                                                className="bg-white/5 border-white/10 text-white h-11 rounded-xl text-xs font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Input Amount</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="bg-white/5 border-white/10 text-emerald-400 h-11 rounded-xl text-sm font-black italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Action Footer */}
                <div className="px-8 py-6 border-t border-white/5 bg-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6 text-white/40">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Packet</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Ledger Sync Active</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            onClick={() => closeDialog('add-customer-payment')}
                            className="px-6 h-11 rounded-xl border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            Abort Protocol
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            disabled={isSubmitting}
                            className="px-10 h-11 rounded-xl bg-emerald-400 hover:bg-emerald-400/90 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-400/20 transition-all gap-2"
                        >
                            {isSubmitting ? (
                                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {isSubmitting ? 'Syncing...' : 'Commit Intake'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
