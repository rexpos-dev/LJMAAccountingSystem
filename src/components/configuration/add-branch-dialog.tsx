'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useDialog } from '@/components/layout/dialog-context';
import { useBranches } from '@/hooks/use-branches';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Upload, X, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AddBranchDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const { toast } = useToast();
    const { createBranch, updateBranch } = useBranches();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [type, setType] = useState('Main');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [isActive, setIsActive] = useState(true);

    // Payment Details
    const [payTo, setPayTo] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [expenseAcct, setExpenseAcct] = useState('');
    const [receivables, setReceivables] = useState('');
    const [depositAccount, setDepositAccount] = useState('');
    const [othersField, setOthersField] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    const isOpen = openDialogs['add-branch'];
    const editData = getDialogData('add-branch');

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setName(editData.name || '');
                setCode(editData.code || '');
                setType(editData.type || 'Main');
                setLogoUrl(editData.logoUrl || null);
                setAddress(editData.address || '');
                setPhone(editData.phone || '');
                setIsActive(editData.isActive !== false);
                setPayTo(editData.payTo || '');
                setAccountNumber(editData.accountNumber || '');
                setExpenseAcct(editData.expenseAcct || '');
                setReceivables(editData.receivables || '');
                setDepositAccount(editData.depositAccount || '');
                setOthersField(editData.othersField || '');
            } else {
                setName('');
                setCode('');
                setType('Main');
                setLogoUrl(null);
                setAddress('');
                setPhone('');
                setIsActive(true);
                setPayTo('');
                setAccountNumber('');
                setExpenseAcct('');
                setReceivables('');
                setDepositAccount('');
                setOthersField('');
            }
        }
    }, [isOpen, editData]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast({
                    title: 'File too large',
                    description: 'Please upload an image smaller than 2MB.',
                    variant: 'destructive',
                });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogoUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        if (isSaving) return;
        closeDialog('add-branch');
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast({
                title: 'Validation error',
                description: 'Please fill in Branch Name.',
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                name: name.trim(),
                code: code.trim() || undefined,
                type,
                logoUrl: logoUrl || undefined,
                address: address.trim() || undefined,
                phone: phone.trim() || undefined,
                isActive,
                payTo: payTo.trim() || undefined,
                accountNumber: accountNumber.trim() || undefined,
                expenseAcct: expenseAcct.trim() || undefined,
                receivables: receivables.trim() || undefined,
                depositAccount: depositAccount.trim() || undefined,
                othersField: othersField.trim() || undefined,
            };

            if (editData) {
                await updateBranch(editData.id, payload);
                toast({
                    title: 'Branch updated',
                    description: 'The branch has been updated successfully.',
                });
            } else {
                await createBranch(payload);
                toast({
                    title: 'Branch created',
                    description: 'The branch has been added successfully.',
                });
            }

            handleClose();
        } catch (error: any) {
            toast({
                title: editData ? 'Error updating branch' : 'Error creating branch',
                description: error?.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{editData ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Logo Upload Section */}
                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted rounded-lg bg-muted/30 relative">
                        {logoUrl ? (
                            <div className="relative w-full flex flex-col items-center">
                                <div className="relative w-32 h-32 mb-2">
                                    <Image
                                        src={logoUrl}
                                        alt="Branch Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <Button variant="ghost" size="sm" onClick={removeLogo} className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10" >
                                    <X className="w-3 h-3 mr-1" /> Remove Logo
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-xs font-medium text-muted-foreground mb-2">Branch Logo (Optional)</p>
                                <Button variant="outline" size="sm" className="" onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-3 h-3 mr-2" /> Upload
                                </Button>
                                <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="branch-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branch Name <span className="text-destructive">*</span></Label>
                            <Input id="branch-name" value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="Ex. Main Branch"
                                className="h-9"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch-code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Code (Optional)</Label>
                            <Input id="branch-code" value={code} onChange={(e) => setCode(e.target.value)}
                                placeholder="Ex. MB-01"
                                className="h-9"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="branch-type" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branch Type <span className="text-destructive">*</span></Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger id="branch-type" className="">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Main">Main Branch</SelectItem>
                                    <SelectItem value="Satellite">Satellite Office</SelectItem>
                                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                                    <SelectItem value="Retail">Retail Store</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch-phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Number</Label>
                            <Input id="branch-phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter phone number"
                                className="h-9"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="branch-address" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address / Location <span className="text-destructive">*</span></Label>
                        <Textarea id="branch-address" value={address} onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter complete address"
                            rows={2}
                            className="resize-none"
                        />
                    </div>

                    {/* Payment Details Section */}
                    <div className="pt-4 border-t mt-6">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <CreditCard className="w-4 h-4" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Default Payment Details</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pay-to" className="text-[10px] font-bold uppercase text-muted-foreground">Pay To</Label>
                                <Input id="pay-to" value={payTo} onChange={(e) => setPayTo(e.target.value)} placeholder="Default Pay To" className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="account-number" className="text-[10px] font-bold uppercase text-muted-foreground">Account NO.</Label>
                                <Input id="account-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Default Account Number" className="h-9 font-mono" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expense-acct" className="text-[10px] font-bold uppercase text-muted-foreground">Expense Acct</Label>
                                <Input id="expense-acct" value={expenseAcct} onChange={(e) => setExpenseAcct(e.target.value)} placeholder="Default Expense Account" className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="receivables" className="text-[10px] font-bold uppercase text-muted-foreground">Receivables</Label>
                                <Input id="receivables" value={receivables} onChange={(e) => setReceivables(e.target.value)} placeholder="Default Receivables" className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deposit-account" className="text-[10px] font-bold uppercase text-muted-foreground">Deposit Account</Label>
                                <Input id="deposit-account" value={depositAccount} onChange={(e) => setDepositAccount(e.target.value)} placeholder="Default Deposit Account" className="h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="others-field" className="text-[10px] font-bold uppercase text-muted-foreground">Others</Label>
                                <Input id="others-field" value={othersField} onChange={(e) => setOthersField(e.target.value)} placeholder="Default Others" className="h-9" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between space-x-2 pt-2 border-t mt-4">
                        <Label htmlFor="branch-active" className="flex flex-col space-y-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Status</span>
                            <span className="font-normal text-[10px] text-muted-foreground">
                                Only active branches are visible in dropdowns
                            </span>
                        </Label>
                        <Switch
                            id="branch-active"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
