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
import { useDialog } from '@/components/layout/dialog-provider';
import { useCustomers } from '@/hooks/use-customers';
import { useBankAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';

export default function AddCustomerPaymentDialog() {
    const { openDialogs, closeDialog } = useDialog();
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
            // Reset form when opened
            setCustomerId('');
            setDepositAccountId('');
            setPaymentType('Cash');
            setDate(new Date().toISOString().split('T')[0]);
            setAmount('');
            setReference('');
            setNote('');
        }
    }, [openDialogs['add-customer-payment']]);

    const handleSave = async () => {
        if (!customerId || !amount || !date || !depositAccountId) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const selectedCustomer = customers.find(c => c.id === customerId);
            const selectedDepositAccount = bankAccounts.find(a => a.id === depositAccountId);

            if (!selectedDepositAccount) {
                throw new Error("Deposit account not found");
            }

            const transactions = [
                {
                    accountNumber: selectedCustomer?.code || customerId, // Use code or ID
                    accountName: selectedCustomer?.customerName,
                    date: new Date(date),
                    transNo: reference,
                    particulars: note || `Payment received from ${selectedCustomer?.customerName}`,
                    credit: parseFloat(amount), // Credit customer account (payment received)
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
                    debit: parseFloat(amount), // Debit deposit account
                    type: 'Payment',
                    ledger: paymentType,
                    user: 'System'
                }
            ];

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactions }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save payment');
            }

            toast({
                title: 'Success',
                description: 'Payment added successfully.',
            });

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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="customer">Customer</Label>
                        <Select value={customerId} onValueChange={setCustomerId} disabled={isLoadingCustomers}>
                            <SelectTrigger id="customer">
                                <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem key={customer.id} value={customer.id}>
                                        {customer.customerName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="depositAccount">Deposit To</Label>
                        <Select value={depositAccountId} onValueChange={setDepositAccountId} disabled={isLoadingAccounts}>
                            <SelectTrigger id="depositAccount">
                                <SelectValue placeholder="Select deposit account" />
                            </SelectTrigger>
                            <SelectContent>
                                {bankAccounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id}>
                                        {account.account_name} ({account.account_no})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="paymentType">Payment Type</Label>
                        <Select value={paymentType} onValueChange={setPaymentType}>
                            <SelectTrigger id="paymentType">
                                <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Check">Check</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Date of payment</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount to be paid</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Enter Amount to be paid"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reference">Reference</Label>
                        <Input
                            id="reference"
                            placeholder="Type Reference Number"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                            id="note"
                            placeholder="Type a note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => closeDialog('add-customer-payment')}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
