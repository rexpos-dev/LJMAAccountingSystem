
'use client';

import { useState, useMemo, Fragment, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Pencil,
  Trash2,
  Undo,
  HelpCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Account } from '@/types/account';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import DeleteAccountDialog from '@/components/configuration/delete-account-dialog';
import EditAccountDialog from '@/components/configuration/edit-account-dialog';
import { useAccounts } from '@/hooks/use-accounts';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};


export default function ChartOfAccountsPage({ onAccountSelect, selectedAccount }: { onAccountSelect: (account: Account | null) => void, selectedAccount: Account | null }) {
  const { openDialogs, closeDialog, openDialog } = useDialog();

  // Use database data instead of mock data
  const { data: accountsData, isLoading, error, refetch } = useAccounts();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredAccounts = useMemo(() => {
    if (!accountsData) return [];
    if (!searchQuery) return accountsData;
    const query = searchQuery.toLowerCase();
    return accountsData.filter(account =>
      account.account_name.toLowerCase().includes(query) ||
      (account.account_no && String(account.account_no).includes(query)) ||
      (account.account_category && account.account_category.toLowerCase().includes(query))
    );
  }, [accountsData, searchQuery]);

  const groupedAccounts = useMemo(() => {
    if (!filteredAccounts.length) return [];

    const groups: { [key: string]: Account[] } = {};

    filteredAccounts.forEach(account => {
      const category = account.account_category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(account);
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => (a.account_no || 0) - (b.account_no || 0));
    });

    return Object.entries(groups).map(([category, accounts]) => {
      const categoryTotal = accounts.reduce((sum, acc) => sum + (acc.balance ?? 0), 0);

      return {
        category,
        accounts,
        totalBalance: categoryTotal,
      };
    }).sort((a, b) => {
      const minQA = Math.min(...a.accounts.map(acc => acc.account_no || 0));
      const minQB = Math.min(...b.accounts.map(acc => acc.account_no || 0));
      return minQA - minQB;
    });
  }, [filteredAccounts]);

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


  const handleRowDoubleClick = (account: Account) => {
    // A header row doesn't have a number and cannot be edited.
    if (!account.account_no) return;
    onAccountSelect(account);
    openDialog('edit-account');
  };

  const renderAccountRow = (account: Account) => {
    const isHeader = !account.account_no;
    const isSelected = selectedAccount?.id === account.id;

    return (
      <TableRow
        key={account.id}
        className={cn(
          {
            'bg-muted/30 font-bold': isHeader,
            'bg-primary/20 hover:bg-primary/30': isSelected,
            'cursor-pointer': !isHeader
          })}
        onClick={() => !isHeader && onAccountSelect(account)}
        onDoubleClick={() => handleRowDoubleClick(account)}
      >
        <TableCell>{account.account_no}</TableCell>
        <TableCell
          className={cn({
            'pl-8': !isHeader,
            'font-semibold text-white': isHeader,
          })}
        >
          {account.account_name}
        </TableCell>
        <TableCell className="text-right">
          {formatCurrency(account.balance ?? 0)}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
          {account.account_description || '-'}
        </TableCell>
        <TableCell className="text-sm">
          {account.date_created ? new Date(account.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
        </TableCell>
        <TableCell className="text-sm">{account.account_status || 'Active'}</TableCell>
        <TableCell>{account.account_type}</TableCell>
        <TableCell>{account.fs_category || '-'}</TableCell>
        <TableCell>{account.header}</TableCell>
        <TableCell>{account.bank}</TableCell>
      </TableRow>
    );
  };

  const handleEditClick = () => {
    if (selectedAccount) {
      openDialog('edit-account');
    }
  };

  const handleDeleteClick = () => {
    if (selectedAccount) {
      openDialog('delete-account');
    }
  };

  const onAccountDeleted = () => {
    onAccountSelect(null);
  }

  return (
    <>
      <Dialog open={openDialogs['chart-of-accounts']} onOpenChange={() => { closeDialog('chart-of-accounts'); onAccountSelect(null); }}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline text-white">Chart of Accounts</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-6 -mr-6">
            <div className="space-y-4">
              <div>
                <Menubar className="rounded-none border-x-0 border-t-0">
                  <MenubarMenu>
                    <MenubarTrigger>Account</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem onClick={() => openDialog('new-account')}>Add Account <MenubarShortcut>Ctrl+N</MenubarShortcut></MenubarItem>
                      <MenubarItem onClick={handleEditClick} disabled={!selectedAccount}>Edit Account <MenubarShortcut>Enter</MenubarShortcut></MenubarItem>
                      <MenubarItem onClick={handleDeleteClick} disabled={!selectedAccount}>Delete Account(s) <MenubarShortcut>Delete</MenubarShortcut></MenubarItem>
                      <MenubarItem disabled>Create Default <MenubarShortcut>Ctrl+D</MenubarShortcut></MenubarItem>
                      <MenubarItem disabled>Restore <MenubarShortcut>Ctrl+R</MenubarShortcut></MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem disabled>Find Account <MenubarShortcut>Ctrl+F</MenubarShortcut></MenubarItem>
                      <MenubarItem disabled>Find Next Account <MenubarShortcut>F3</MenubarShortcut></MenubarItem>
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
                <div className="flex items-center gap-4 p-2 border-b">
                  <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => openDialog('new-account')}>
                    <Plus className="h-6 w-6" />
                    <span>New</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedAccount} onClick={handleEditClick}>
                    <Pencil className="h-6 w-6" />
                    <span>Edit</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedAccount} onClick={handleDeleteClick}>
                    <Trash2 className="h-6 w-6" />
                    <span>Delete</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedAccount}>
                    <Undo className="h-6 w-6" />
                    <span>Restore</span>
                  </Button>
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-col h-auto"
                      onClick={refetch}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-col h-auto">
                      <HelpCircle className="h-6 w-6" />
                      <span>Help</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="account-digits">
                    Number of digits in account number:
                  </Label>
                  <Input id="account-digits" type="number" defaultValue="4" className="w-20" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-deleted" />
                  <Label htmlFor="show-deleted" className="font-normal">
                    Also show recently deleted accounts
                  </Label>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Account No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>FS Category</TableHead>
                      <TableHead>Header</TableHead>
                      <TableHead>Bank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">Loading...</TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center text-red-500">Error loading accounts: {error.message}</TableCell>
                      </TableRow>
                    ) : flattenedList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">No accounts found.</TableCell>
                      </TableRow>
                    ) : (
                      paginatedList.map((item: any) => (
                        item.isHeader ? (
                          <TableRow key={item.id} className="bg-muted/40">
                            <TableCell></TableCell>
                            <TableCell className="font-bold text-white">{item.category}</TableCell>
                            <TableCell className="text-right font-bold text-white">{formatCurrency(item.totalBalance)}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ) : (
                          renderAccountRow(item)
                        )
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 0 && (
                <div className="flex items-center justify-between py-2 border-t mt-4 px-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {flattenedList.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, flattenedList.length)} of {flattenedList.length} rows
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Rows per page</span>
                      <Select value={itemsPerPage.toString()} onValueChange={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); }}>
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Prev
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="border-t pt-4">
            <div className="flex gap-2 ml-auto">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => onAccountSelect(null)}>Close</Button>
              </DialogClose>
              <Button variant="secondary">Help</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {openDialogs['edit-account'] && <EditAccountDialog />}
      {openDialogs['delete-account'] && <DeleteAccountDialog />}
    </>
  );
}

