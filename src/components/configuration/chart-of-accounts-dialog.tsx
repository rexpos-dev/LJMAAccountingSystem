'use client';

import { useState, useMemo, Fragment, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search, RefreshCw, Undo, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { useAccounts } from '@/hooks/use-accounts';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function ChartOfAccountsDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const { data: accounts, isLoading, refetch } = useAccounts();
    const { toast } = useToast();

    const [searchName, setSearchName] = useState('');
    const [searchNumber, setSearchNumber] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

    const handleRowClick = (account: any) => {
        setSelectedAccount(account);
    }

    const handleRowDoubleClick = (account: any) => {
        setDialogData('edit-account' as any, account);
        openDialog('edit-account' as any);
    };

    const handleEditClick = () => {
        if (selectedAccount) {
            setDialogData('edit-account' as any, selectedAccount);
            openDialog('edit-account' as any);
        }
    };

    const handleDeleteClick = () => {
        if (selectedAccount) {
            setDialogData('delete-account' as any, selectedAccount);
            openDialog('delete-account' as any);
        }
    };

    const [showDeleted, setShowDeleted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, searchNumber, showDeleted]);

    // Group accounts by category (Asset, Liability, Equity, Income, Cost of Sales, Expense)
    const groupedAccounts = useMemo(() => {
        if (!accounts) return [];

        let processedAccounts = accounts;

        // Helper to check if string matches search
        const matches = (text: string, search: string) => text.toLowerCase().includes(search.toLowerCase());

        // Filter first
        if (searchName || searchNumber || !showDeleted) {
            processedAccounts = processedAccounts.filter(account => {
                const nameMatch = !searchName || matches(account.account_name, searchName);
                const numberMatch = !searchNumber || (account.account_no?.toString().includes(searchNumber) ?? true);
                // Assumption: 'showDeleted' not fully implemented in backend yet, but UI toggle is here.
                // If backend sends 'deleted' flag, usage: !account.deleted || showDeleted
                return nameMatch && numberMatch;
            });
        }

        const groups: { [key: string]: typeof accounts } = {};

        // Pre-define order if needed, or dynamic. Page used dynamic.
        processedAccounts.forEach(account => {
            const category = account.account_category || 'Uncategorized';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(account);
        });

        // Sort accounts within groups by number
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => (a.account_no || 0) - (b.account_no || 0));
        });

        return Object.entries(groups).map(([category, groupAccounts]) => ({
            category,
            accounts: groupAccounts,
            totalBalance: groupAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
        })).sort((a, b) => {
            const minQA = Math.min(...a.accounts.map(acc => acc.account_no || 0));
            const minQB = Math.min(...b.accounts.map(acc => acc.account_no || 0));
            return minQA - minQB;
        });

    }, [accounts, searchName, searchNumber, showDeleted]);

    const flattenedList = useMemo(() => {
        const list: any[] = [];
        groupedAccounts.forEach(group => {
            list.push({ isHeader: true, category: group.category, totalBalance: group.totalBalance, id: `header-${group.category}` });
            group.accounts.forEach(account => {
                list.push({ isHeader: false, ...account });
            });
        });
        return list;
    }, [groupedAccounts]);

    const totalPages = Math.max(1, Math.ceil(flattenedList.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedList = flattenedList.slice(startIndex, startIndex + itemsPerPage);

    const formatCurrency = (amount?: number | null) => {
        if (amount === undefined || amount === null) return '₱0.00';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <Dialog open={openDialogs['chart-of-accounts']} onOpenChange={() => closeDialog('chart-of-accounts')}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="font-headline">Chart of Accounts</DialogTitle>
                </DialogHeader>

                <div className="flex-shrink-0 border-b">
                    <Menubar className="rounded-none border-0">
                        <MenubarMenu>
                            <MenubarTrigger>Account</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={() => openDialog('new-account' as any)}>Add Account <MenubarShortcut>Ctrl+N</MenubarShortcut></MenubarItem>
                                <MenubarItem onClick={handleEditClick} disabled={!selectedAccount}>Edit Account <MenubarShortcut>Enter</MenubarShortcut></MenubarItem>
                                <MenubarItem onClick={handleDeleteClick} disabled={!selectedAccount}>Delete Account(s) <MenubarShortcut>Delete</MenubarShortcut></MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('chart-of-accounts')}>Close <MenubarShortcut>Esc</MenubarShortcut></MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>

                    </Menubar>
                    <div className="flex items-center gap-4 p-2 bg-muted/10">
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => openDialog('new-account' as any)}>
                                <Plus className="h-5 w-5" />
                                <span className="text-[10px]">New</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-col h-auto"
                                onClick={handleEditClick}
                                disabled={!selectedAccount}
                            >
                                <Pencil className="h-5 w-5" />
                                <span className="text-[10px]">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={handleDeleteClick} disabled={!selectedAccount}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                                <span className="text-[10px]">Delete</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedAccount}>
                                <Undo className="h-5 w-5" />
                                <span className="text-[10px]">Restore</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => openDialog('bulk-upload-accounts' as any)}>
                                <Upload className="h-5 w-5" />
                                <span className="text-[10px]">Bulk Upload</span>
                            </Button>
                        </div>
                        <div className="h-8 border-l mx-2" />
                        <div className="flex gap-4 flex-1">
                            <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                    placeholder="Search Number..."
                                    value={searchNumber}
                                    onChange={(e) => setSearchNumber(e.target.value)}
                                    className="pl-7 h-8"
                                />
                            </div>
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                    placeholder="Search Name..."
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
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
                    <div className="flex items-center justify-between p-2 border-b bg-muted/5">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="account-digits" className="text-xs font-normal">Number of digits in account number:</Label>
                            <Input id="account-digits" type="number" defaultValue="4" className="w-16 h-7 text-xs" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="show-deleted" checked={showDeleted} onCheckedChange={(c) => setShowDeleted(!!c)} />
                            <Label htmlFor="show-deleted" className="text-xs font-normal">Also show recently deleted accounts</Label>
                        </div>
                    </div>

                    <div className="border rounded-md flex-1 overflow-hidden flex flex-col bg-card mt-2 relative min-h-0">
                        <div className="flex-1 overflow-auto">
                            <table className="w-full border-separate border-spacing-0 text-sm">
                                <thead className="sticky top-0 bg-secondary z-30 shadow-sm transition-colors">
                                    <tr className="hover:bg-transparent border-b"><th className="w-[100px] bg-secondary sticky top-0 z-30 h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account No.</th><th className="bg-secondary sticky top-0 z-30 h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account Name</th><th className="bg-secondary sticky top-0 z-30 h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account Description</th><th className="bg-secondary sticky top-0 z-30 h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Date Created</th><th className="bg-secondary sticky top-0 z-30 h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account Status</th><th className="bg-secondary sticky top-0 z-30 h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account Type</th><th className="bg-secondary sticky top-0 z-30 h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">Account Category</th><th className="bg-secondary sticky top-0 z-30 h-10 px-4 text-left align-middle font-medium text-muted-foreground border-b">FS Category</th><th className="bg-secondary sticky top-0 z-30 h-10 px-4 text-right align-middle font-medium text-muted-foreground border-b">Balance</th></tr>
                                </thead>
                                <tbody className="divide-y [&_tr:last-child]:border-0">
                                    {isLoading ? (
                                        <tr><td colSpan={9} className="text-center py-10"><RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />Loading accounts...</td></tr>
                                    ) : flattenedList.length === 0 ? (
                                        <tr><td colSpan={9} className="text-center py-10 text-muted-foreground">No accounts found.</td></tr>
                                    ) : (
                                        paginatedList.map((item) => (
                                            item.isHeader ? (
                                                <tr key={item.id} className="bg-muted/40 hover:bg-muted/40 border-b"><td className="p-4 align-middle"></td><td className="p-4 align-middle font-bold text-foreground">{item.category}</td><td className="p-4 align-middle"></td><td className="p-4 align-middle"></td><td className="p-4 align-middle"></td><td className="p-4 align-middle"></td><td className="p-4 align-middle"></td><td className="p-4 align-middle"></td><td className="p-4 align-middle text-right font-bold text-foreground">{formatCurrency(item.totalBalance)}</td></tr>
                                            ) : (
                                                <tr key={item.id} className={cn("cursor-pointer border-b transition-colors hover:bg-muted/50", selectedAccount?.id === item.id && "bg-primary/20 hover:bg-primary/30", item.header === 'Yes' && "bg-muted/20 font-bold hover:bg-muted/30")} onClick={() => handleRowClick(item)} onDoubleClick={() => handleRowDoubleClick(item)}><td className="p-4 align-middle font-mono">{item.account_no}</td><td className={cn("p-4 align-middle", item.header === 'Yes' ? "font-bold text-primary pl-8" : "pl-8")}>{item.account_name}</td><td className="p-4 align-middle text-muted-foreground text-sm">{item.account_description || '-'}</td><td className="p-4 align-middle text-sm">{item.date_created ? new Date(item.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td><td className="p-4 align-middle"><span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", item.account_status === 'Active' ? "bg-green-100 text-green-800" : item.account_status === 'Inactive' ? "bg-gray-100 text-gray-800" : "bg-yellow-100 text-yellow-800")}>{item.account_status || 'Active'}</span></td><td className="p-4 align-middle">{item.account_type || '-'}</td><td className="p-4 align-middle">{item.account_category || '-'}</td><td className="p-4 align-middle">{item.fs_category || '-'}</td><td className="p-4 align-middle text-right">{formatCurrency(item.balance)}</td></tr>
                                            )
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 0 && (
                            <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/5 flex-shrink-0 mt-auto">
                                <div className="text-xs text-muted-foreground">
                                    Showing {flattenedList.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, flattenedList.length)} of {flattenedList.length} rows
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
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-3 w-3 mr-1" />
                                            Prev
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
                    <Button variant="outline" onClick={() => closeDialog('chart-of-accounts')}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
