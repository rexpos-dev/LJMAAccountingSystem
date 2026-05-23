'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { Plus, Pencil, Trash2, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
    MenubarShortcut,
} from '@/components/ui/menubar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useBankAccounts } from '@/hooks/use-bank-accounts';
import { useConfirm } from '@/hooks/use-confirm';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function BankSettingsDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const { bankAccounts, isLoading, mutate: refetch } = useBankAccounts();
    const { toast } = useToast();
    const { confirm, open: confirmOpen, options: confirmOptions, handleConfirm, handleCancel } = useConfirm();

    const [searchName, setSearchName] = useState('');
    const [searchNumber, setSearchNumber] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

    const handleRowClick = (account: any) => {
        setSelectedAccount(account);
    }

    const handleRowDoubleClick = (account: any) => {
        setDialogData('edit-bank-account' as any, account);
        openDialog('edit-bank-account' as any);
    };

    const handleEditClick = () => {
        if (selectedAccount) {
            setDialogData('edit-bank-account' as any, selectedAccount);
            openDialog('edit-bank-account' as any);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedAccount) return;
        const ok = await confirm({ description: `Are you sure you want to delete the bank account "${selectedAccount.account_name}"?`, title: 'Delete Bank Account', variant: 'destructive' });
        if (!ok) return;
        try {
            const response = await fetch(`/api/bank-accounts?id=${selectedAccount.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete bank account');

            toast({
                title: 'Success',
                description: 'Bank account deleted successfully',
            });
            refetch();
            setSelectedAccount(null);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message,
            });
        }
    };

    const handleDeleteAccountRow = async (account: any) => {
        const ok = await confirm({ description: `Are you sure you want to delete "${account.account_name}"?`, title: 'Delete Bank Account', variant: 'destructive' });
        if (!ok) return;
        try {
            const response = await fetch(`/api/bank-accounts?id=${account.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete');
            toast({ title: 'Success', description: 'Deleted successfully' });
            refetch();
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    useEffect(() => {
        const handleRefresh = () => refetch();
        window.addEventListener('bank-accounts-refresh', handleRefresh);
        return () => window.removeEventListener('bank-accounts-refresh', handleRefresh);
    }, [refetch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, searchNumber]);

    // Filter bank accounts
    const filteredAccounts = useMemo(() => {
        if (!bankAccounts) return [];

        return bankAccounts.filter((account: any) => {
            const matchesName = !searchName || account.account_name.toLowerCase().includes(searchName.toLowerCase());
            const matchesNumber = !searchNumber || (account.account_number?.toString().includes(searchNumber) ?? true);
            return matchesName && matchesNumber;
        }).sort((a: any, b: any) => (a.bank_code || '').localeCompare(b.bank_code || ''));

    }, [bankAccounts, searchName, searchNumber]);

    const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedList = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

    const formatCurrency = (amount?: number | null) => {
        if (amount === undefined || amount === null) return '₱0.00';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <>
        <ConfirmDialog
            open={confirmOpen}
            {...confirmOptions}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
        <Dialog open={openDialogs['bank-settings']} onOpenChange={() => closeDialog('bank-settings' as any)}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="font-headline">Bank Settings</DialogTitle>
                </DialogHeader>

                <div className="flex-shrink-0 border-b">
                    <Menubar className="rounded-none border-0">
                        <MenubarMenu>
                            <MenubarTrigger>Account</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={() => openDialog('add-bank-account' as any)}>Add Bank Account <MenubarShortcut>Ctrl+N</MenubarShortcut></MenubarItem>
                                <MenubarItem onClick={handleEditClick} disabled={!selectedAccount}>Edit Account <MenubarShortcut>Enter</MenubarShortcut></MenubarItem>
                                <MenubarItem onClick={handleDeleteClick} disabled={!selectedAccount}>Delete Account <MenubarShortcut>Delete</MenubarShortcut></MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('bank-settings' as any)}>Close <MenubarShortcut>Esc</MenubarShortcut></MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <div className="flex items-center gap-4 p-2 bg-muted/10">
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => openDialog('add-bank-account' as any)}>
                                <Plus className="h-5 w-5" />
                                <span className="text-[10px]">New</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={handleEditClick} disabled={!selectedAccount} >
                                <Pencil className="h-5 w-5" />
                                <span className="text-[10px]">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={handleDeleteClick} disabled={!selectedAccount}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                                <span className="text-[10px]">Delete</span>
                            </Button>
                        </div>
                        <div className="h-8 border-l mx-2" />
                        <div className="flex gap-4 flex-1">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input placeholder="Search Number..." value={searchNumber} onChange={(e) => setSearchNumber(e.target.value)}
                                    className="pl-7 h-8"
                                />
                            </div>
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input placeholder="Search Name..." value={searchName} onChange={(e) => setSearchName(e.target.value)}
                                    className="pl-7 h-8"
                                />
                            </div>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => refetch()} disabled={isLoading}>
                                <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
                                <span className="text-[10px]">Refresh</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 py-4 flex flex-col">
                    <div className="border rounded-md flex-1 overflow-hidden flex flex-col bg-card mt-2 relative min-h-0">
                        <div className="flex-1 overflow-auto">
                            <table className="w-full border-separate border-spacing-0 text-sm">
                                <thead className="sticky top-0 bg-secondary z-30 shadow-sm transition-colors">
                                    <tr className="hover:bg-transparent border-b">
                                        <th className="w-[120px] h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Code</th>
                                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Bank Name</th>
                                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account Name</th>
                                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account No</th>
                                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account Type</th>
                                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Linked GL Account</th>
                                        <th className="w-[120px] h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Opening Date</th>
                                        <th className="w-[150px] h-10 px-4 text-right align-middle font-medium text-muted-foreground border-b">Balance</th>
                                        <th className="w-[100px] h-10 px-4 text-center align-middle font-medium text-muted-foreground border-b">Status</th>
                                        <th className="w-[100px] h-10 px-4 text-center align-middle font-medium text-muted-foreground border-b">Audit</th>
                                        <th className="w-[80px] h-10 px-4 text-center align-middle font-medium text-muted-foreground border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y [&_tr:last-child]:border-0">
                                    {isLoading ? (
                                        <tr><td colSpan={11} className="text-center"><RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />Loading bank accounts...</td></tr>
                                    ) : filteredAccounts.length === 0 ? (
                                        <tr><td colSpan={11} className="text-center text-muted-foreground">No bank accounts found.</td></tr>
                                    ) : (
                                        paginatedList.map((account: any) => (
                                            <tr
                                                key={account.id}
                                                className={cn(
                                                    "cursor-pointer border-b transition-colors hover:bg-muted/50",
                                                    selectedAccount?.id === account.id && "bg-primary/20 hover:bg-primary/30"
                                                )}
                                                onClick={() => handleRowClick(account)}
                                                onDoubleClick={() => handleRowDoubleClick(account)}
                                            >
                                                <td className="align-middle font-mono">{account.bank_code || '-'}</td>
                                                <td className="align-middle">{account.bank_name || '-'}</td>
                                                <td className="align-middle font-medium">{account.account_name || '-'}</td>
                                                <td className="align-middle font-mono">{account.account_number || '-'}</td>
                                                <td className="align-middle">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-secondary-foreground/10 text-secondary-foreground font-medium">
                                                        {account.account_type || 'BANK'}
                                                    </span>
                                                </td>
                                                <td className="align-middle whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-xs">{account.gl_account?.account_no}</span>
                                                        <span className="text-[10px] text-muted-foreground">{account.gl_account?.account_name}</span>
                                                    </div>
                                                </td>
                                                <td className="align-middle text-xs text-muted-foreground">
                                                    {account.opening_date ? new Date(account.opening_date).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="align-middle text-right font-mono font-medium">{formatCurrency(account.opening_balance)}</td>
                                                <td className="align-middle text-center">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[10px] font-medium",
                                                        account.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    )}>
                                                        {account.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="align-middle text-center">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
                                                        account.audit_status?.toUpperCase() === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                                                            account.audit_status?.toUpperCase() === 'DONE' ? "bg-blue-100 text-blue-700" :
                                                                account.audit_status?.toUpperCase() === 'REJECTED' ? "bg-rose-100 text-rose-700" :
                                                                    account.audit_status?.toUpperCase() === 'ONGOING' ? "bg-yellow-100 text-yellow-700" :
                                                                        "bg-gray-100 text-gray-700"
                                                    )}>
                                                        {account.audit_status?.replace('_', ' ').toUpperCase() || 'TO AUDIT'}
                                                    </span>
                                                </td>
                                                <td className="align-middle text-center">
                                                    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="w-8 hover:text-primary" onClick={() => {
                                                                setDialogData('edit-bank-account' as any, account);
                                                                openDialog('edit-bank-account' as any);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="w-8 hover:text-destructive" onClick={() => handleDeleteAccountRow(account)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 0 && (
                            <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/5 flex-shrink-0 mt-auto">
                                <div className="text-xs text-muted-foreground">
                                    Showing {filteredAccounts.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} rows
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Rows per page</span>
                                        <Select value={itemsPerPage.toString()} onValueChange={(val: string) => { setItemsPerPage(Number(val)); setCurrentPage(1); }}>
                                            <SelectTrigger className="h-7 w-[60px] text-xs">
                                                <SelectValue placeholder={itemsPerPage} />
                                            </SelectTrigger>
                                            <SelectContent side="top">
                                                {[10, 20, 50, 100].map((size) => (
                                                    <SelectItem key={size} value={size.toString()} className="text-xs">
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="px-2 text-xs" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-3 w-3 mr-1" />
                                            Prev
                                        </Button>
                                        <Button variant="outline" size="sm" className="px-2 text-xs" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage >= totalPages}
                                        >
                                            Next
                                            <ChevronRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex-shrink-0 pt-4 border-t">
                    <Button variant="outline" onClick={() => closeDialog('bank-settings' as any)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
