'use client';

import { useState, useMemo, Fragment } from 'react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash2, Search, RefreshCw, Undo, HelpCircle } from 'lucide-react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
    MenubarShortcut,
} from '@/components/ui/menubar';
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
        if (account.header === 'Yes') return;
        setSelectedAccount(account);
    }

    const handleRowDoubleClick = (account: any) => {
        if (account.header === 'Yes') return;
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

    // Group accounts by category (Asset, Liability, Equity, Income, Cost of Sales, Expense)
    const groupedAccounts = useMemo(() => {
        if (!accounts) return [];

        let processedAccounts = accounts;

        // Helper to check if string matches search
        const matches = (text: string, search: string) => text.toLowerCase().includes(search.toLowerCase());

        // Filter first
        if (searchName || searchNumber || !showDeleted) {
            processedAccounts = processedAccounts.filter(account => {
                const nameMatch = !searchName || matches(account.name, searchName);
                const numberMatch = !searchNumber || (account.accnt_no?.toString().includes(searchNumber) ?? true);
                // Assumption: 'showDeleted' not fully implemented in backend yet, but UI toggle is here.
                // If backend sends 'deleted' flag, usage: !account.deleted || showDeleted
                return nameMatch && numberMatch;
            });
        }

        const groups: { [key: string]: typeof accounts } = {};

        // Pre-define order if needed, or dynamic. Page used dynamic.
        processedAccounts.forEach(account => {
            const category = account.category || 'Uncategorized';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(account);
        });

        // Sort accounts within groups by number
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => (a.accnt_no || 0) - (b.accnt_no || 0));
        });

        return Object.entries(groups).map(([category, groupAccounts]) => ({
            category,
            accounts: groupAccounts,
            totalBalance: groupAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
        })); //.sort(...) if specific category order needed

    }, [accounts, searchName, searchNumber, showDeleted]);

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
                        <MenubarMenu>
                            <MenubarTrigger>Help</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>Help Contents</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                    <div className="flex items-center gap-4 p-2 bg-muted/10">
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => openDialog('new-account' as any)}>
                                <Plus className="h-5 w-5" />
                                <span className="text-[10px]">New</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={handleEditClick} disabled={!selectedAccount}>
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

                <div className="flex-1 min-h-0 py-4">
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

                    <div className="border rounded-md h-full overflow-hidden bg-card border-t-0 rounded-t-none">
                        <ScrollArea className="h-full">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted/50 z-10">
                                    <TableRow>
                                        <TableHead className="w-[120px]">Account No</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right">Balance</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Header</TableHead>
                                        <TableHead>Bank</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10">
                                                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                                                Loading accounts...
                                            </TableCell>
                                        </TableRow>
                                    ) : groupedAccounts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                                No accounts found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        groupedAccounts.map((group) => (
                                            <Fragment key={group.category}>
                                                <TableRow className="bg-muted/40 hover:bg-muted/40">
                                                    <TableCell></TableCell>
                                                    <TableCell className="font-bold text-foreground">{group.category}</TableCell>
                                                    <TableCell className="text-right font-bold text-foreground">{formatCurrency(group.totalBalance)}</TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                                {group.accounts.map((account) => (
                                                    <TableRow
                                                        key={account.id}
                                                        className={cn(
                                                            "cursor-pointer",
                                                            selectedAccount?.id === account.id && "bg-primary/20 hover:bg-primary/30",
                                                            account.header === 'Yes' && "bg-muted/20 font-bold hover:bg-muted/20 cursor-default"
                                                        )}
                                                        onClick={() => handleRowClick(account)}
                                                        onDoubleClick={() => handleRowDoubleClick(account)}
                                                    >
                                                        <TableCell className="font-mono">{account.accnt_no}</TableCell>
                                                        <TableCell className={cn(
                                                            account.header === 'Yes' ? "font-bold text-primary pl-8" : "pl-8"
                                                        )}>
                                                            {account.name}
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono">
                                                            {formatCurrency(account.balance)}
                                                        </TableCell>
                                                        <TableCell>{account.type}</TableCell>
                                                        <TableCell>{account.header}</TableCell>
                                                        <TableCell>{account.bank}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </Fragment>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
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
