'use client';

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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useBankAccounts } from '@/hooks/use-bank-accounts';
import { useAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function EditBankAccountDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const { mutate: refreshBankAccounts } = useBankAccounts();
    const { data: glAccounts } = useAccounts();
    const { toast } = useToast();

    const bankAccount = getDialogData('edit-bank-account' as any);

    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (bankAccount) {
            setFormData({
                ...bankAccount,
                opening_date: bankAccount.opening_date ? new Date(bankAccount.opening_date).toISOString().split('T')[0] : ''
            });
        } else {
            setFormData({});
        }
    }, [bankAccount, openDialogs['edit-bank-account']]);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.id) return;

        try {
            const response = await fetch('/api/bank-accounts', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update bank account');
            }

            toast({
                title: "Bank Account Updated",
                description: `Bank account "${formData.account_name}" has been successfully updated.`,
            });

            refreshBankAccounts();
            window.dispatchEvent(new CustomEvent('bank-accounts-refresh'));
            handleClose();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update bank account",
            });
        }
    };

    const handleClose = () => {
        setFormData({});
        closeDialog('edit-bank-account' as any);
    };

    const filteredGlAccounts = (glAccounts || []).filter((acc: any) => acc.bank === 'No');

    return (
        <Dialog open={openDialogs['edit-bank-account']} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Bank Account</DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] px-1">
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-bank-code">Bank Code <span className="text-destructive">*</span></Label>
                            <Input
                                id="edit-bank-code"
                                value={formData.bank_code || ''}
                                onChange={(e) => handleInputChange('bank_code', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-bank-name">Bank Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="edit-bank-name"
                                value={formData.bank_name || ''}
                                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-account-name">Account Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="edit-account-name"
                                value={formData.account_name || ''}
                                onChange={(e) => handleInputChange('account_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-account-number">Account Number <span className="text-destructive">*</span></Label>
                            <Input
                                id="edit-account-number"
                                value={formData.account_number || ''}
                                onChange={(e) => handleInputChange('account_number', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-account-type">Account Type <span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.account_type || ''}
                                onValueChange={(v) => handleInputChange('account_type', v)}
                            >
                                <SelectTrigger id="edit-account-type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CASH">CASH</SelectItem>
                                    <SelectItem value="BANK">BANK</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-audit-status">Audit Status</Label>
                            <Select
                                value={formData.audit_status || 'TO_AUDIT'}
                                onValueChange={(v) => handleInputChange('audit_status', v)}
                            >
                                <SelectTrigger id="edit-audit-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TO_AUDIT">TO AUDIT</SelectItem>
                                    <SelectItem value="ONGOING">ONGOING</SelectItem>
                                    <SelectItem value="DONE">DONE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border-t pt-6 mt-2">
                        <h3 className="text-lg font-medium mb-4">General Ledger Mapping</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-linked-gl">Linked GL Account <span className="text-destructive">*</span></Label>
                                <Select
                                    value={formData.gl_account_id || ''}
                                    onValueChange={(v) => handleInputChange('gl_account_id', v)}
                                >
                                    <SelectTrigger id="edit-linked-gl">
                                        <SelectValue placeholder="Select GL account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredGlAccounts.map((acc: any) => (
                                            <SelectItem key={acc.id} value={acc.id}>
                                                {acc.account_no} - {acc.account_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-opening-balance">Opening Balance (Migration)</Label>
                                <Input
                                    id="edit-opening-balance"
                                    type="number"
                                    value={formData.opening_balance ?? 0}
                                    onChange={(e) => handleInputChange('opening_balance', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="edit-opening-date">Opening Date</Label>
                                <Input
                                    id="edit-opening-date"
                                    type="date"
                                    value={formData.opening_date || ''}
                                    onChange={(e) => handleInputChange('opening_date', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
