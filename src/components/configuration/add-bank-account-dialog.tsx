'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
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
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAccountTypes } from '@/hooks/use-account-types';
import { useAccounts } from '@/hooks/use-accounts';
import { useAuth } from '@/components/providers/auth-provider';

export default function AddBankAccountDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { toast } = useToast();
    const { user } = useAuth();
    const { accountTypes } = useAccountTypes();
    const { data: accounts } = useAccounts();

    const [bankCode, setBankCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankAccountNo, setBankAccountNo] = useState('');
    const [accountType, setAccountType] = useState('BANK');
    const [currency, setCurrency] = useState('PHP');
    const [branch, setBranch] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [initialBalance, setInitialBalance] = useState('0.00'); // Renamed from openingBalance to avoid conflict
    const [linkedGlId, setLinkedGlId] = useState('');
    const [migrationOpeningBalance, setMigrationOpeningBalance] = useState('');
    const [openingDate, setOpeningDate] = useState('');
    const [auditStatus, setAuditStatus] = useState('DRAFT');

    const glAccounts = (accounts || []).filter((acc: any) => acc.bank === 'No');

    const handleAdd = async (status?: string) => {
        if (!bankCode || !bankName || !accountName || !bankAccountNo || !linkedGlId) {
            toast({
                variant: 'destructive',
                title: 'Missing required fields',
                description: 'Please fill in all required fields, including Linked GL Account.',
            });
            return;
        }

        try {
            const saveResponse = await fetch('/api/bank-accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bank_code: bankCode,
                    bank_name: bankName,
                    account_name: accountName,
                    account_number: bankAccountNo,
                    account_type: accountType as any, // CASH or BANK
                    currency: currency,
                    gl_account_id: linkedGlId,
                    opening_balance: parseFloat(migrationOpeningBalance.replace(/,/g, '')) || 0,
                    opening_date: openingDate || null,
                    is_active: isActive,
                    audit_status: status || auditStatus,
                    user: user ? `${user.firstName} ${user.lastName}`.trim() : 'System',
                }),
            });

            if (!saveResponse.ok) {
                const errorData = await saveResponse.json();
                throw new Error(errorData.error || 'Failed to create bank account');
            }

            toast({
                title: 'Success',
                description: `Bank account "${accountName}" has been ${status === 'DRAFT' ? 'saved as draft' : 'submitted for audit'}.`,
            });

            // Reset form
            setBankCode('');
            setBankName('');
            setAccountName('');
            setBankAccountNo('');
            setAccountType('BANK');
            setCurrency('PHP');
            setBranch('');
            setIsActive(true);
            setInitialBalance('0.00');
            setLinkedGlId('');
            setMigrationOpeningBalance('');
            setOpeningDate('');
            setAuditStatus('DRAFT');

            closeDialog('add-bank-account' as any);
            window.dispatchEvent(new CustomEvent('bank-accounts-refresh'));
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message,
            });
        }
    };

    const isFormValid = bankCode && bankName && accountName && bankAccountNo && linkedGlId;

    return (
        <Dialog open={openDialogs['add-bank-account']} onOpenChange={() => closeDialog('add-bank-account' as any)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Bank Account</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] px-1">
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank-code">Bank Code <span className="text-destructive">*</span></Label>
                            <Input
                                id="bank-code"
                                value={bankCode}
                                onChange={(e) => setBankCode(e.target.value)}
                                placeholder="e.g. BDO-CHK-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank-name">Bank Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="bank-name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="e.g. BDO, BPI"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="account-name">Account Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="account-name"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="Company name in bank"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank-account-no">Account Number <span className="text-destructive">*</span></Label>
                            <Input
                                id="bank-account-no"
                                value={bankAccountNo}
                                onChange={(e) => setBankAccountNo(e.target.value)}
                                placeholder="Bank account number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="account-type">Account Type <span className="text-destructive">*</span></Label>
                            <Select value={accountType} onValueChange={setAccountType}>
                                <SelectTrigger id="account-type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">CASH</SelectItem>
                                    <SelectItem value="BANK">BANK</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency <span className="text-destructive">*</span></Label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PHP">PHP</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch">Branch (Optional)</Label>
                            <Input
                                id="branch"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                placeholder="Branch name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="opening-balance">Opening Balance</Label>
                            <Input
                                id="opening-balance"
                                value={initialBalance}
                                onChange={(e) => setInitialBalance(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex items-center justify-between col-span-2 py-2 border-t border-white/10 mt-2">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is-active"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                                <Label htmlFor="is-active" className="font-medium text-white">Active Account</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="audit-status" className="text-slate-400">Audit Status:</Label>
                                <Select value={auditStatus} onValueChange={setAuditStatus}>
                                    <SelectTrigger id="audit-status" className="h-8 w-[140px] bg-white/5 border-white/10 text-xs text-white">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                                        <SelectItem value="TO_AUDIT">TO AUDIT</SelectItem>
                                        <SelectItem value="ONGOING">ONGOING</SelectItem>
                                        <SelectItem value="DONE">DONE</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6 mt-2">
                        <h3 className="text-lg font-medium mb-4">General Ledger Mapping</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="linked-gl">Linked GL Account <span className="text-destructive">*</span></Label>
                                <Select value={linkedGlId} onValueChange={setLinkedGlId}>
                                    <SelectTrigger id="linked-gl">
                                        <SelectValue placeholder="Select GL account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {glAccounts.map((acc: any) => (
                                            <SelectItem key={acc.id} value={acc.id}>
                                                {acc.account_no} - {acc.account_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="opening-balance-mig">Opening Balance (Migration)</Label>
                                <Input
                                    id="opening-balance-mig"
                                    value={migrationOpeningBalance}
                                    onChange={(e) => setMigrationOpeningBalance(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="opening-date">Opening Date</Label>
                                <Input
                                    id="opening-date"
                                    type="date"
                                    value={openingDate}
                                    onChange={(e) => setOpeningDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5" onClick={() => closeDialog('add-bank-account' as any)}>Cancel</Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                            onClick={() => handleAdd('DRAFT')}
                        >
                            Save Draft
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={() => handleAdd('TO_AUDIT')}
                            disabled={!isFormValid}
                        >
                            Submit for Audit
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
