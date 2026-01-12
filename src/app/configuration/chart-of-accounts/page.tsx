
'use client';

import { useState, useMemo, Fragment } from 'react';
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
  Plus,
  Pencil,
  Trash2,
  Undo,
  HelpCircle,
  RefreshCw,
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

  const groupedAccounts = useMemo(() => {
    if (!accountsData) return [];

    const groups: { [key: string]: Account[] } = {};

    accountsData.forEach(account => {
      const category = account.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(account);
    });

    return Object.entries(groups).map(([category, accounts]) => ({
      category,
      accounts,
      totalBalance: accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
    }));

  }, [accountsData]);


  const handleRowDoubleClick = (account: Account) => {
    // A header row doesn't have a number and cannot be edited.
    if (!account.accnt_no) return;
    onAccountSelect(account);
    openDialog('edit-account');
  };

  const renderAccountRow = (account: Account) => {
    const isHeader = !account.accnt_no;
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
        <TableCell>{account.accnt_no}</TableCell>
        <TableCell
          className={cn({
            'pl-8': !isHeader,
            'font-semibold text-white': isHeader,
          })}
        >
          {account.name}
        </TableCell>
        <TableCell className="text-right">
          {account.balance !== undefined ? formatCurrency(account.balance) : ''}
        </TableCell>
        <TableCell>{account.type}</TableCell>
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
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Account No</TableHead>
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
                        <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-red-500">Error loading accounts: {error.message}</TableCell>
                      </TableRow>
                    ) : groupedAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No accounts found.</TableCell>
                      </TableRow>
                    ) : (
                      groupedAccounts.map((group) => (
                        <Fragment key={group.category}>
                          <TableRow className="bg-muted/40">
                            <TableCell></TableCell>
                            <TableCell className="font-bold text-white">{group.category}</TableCell>
                            <TableCell className="text-right font-bold text-white">{formatCurrency(group.totalBalance)}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          {group.accounts.map(renderAccountRow)}
                        </Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
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
      {openDialogs['edit-account'] && <EditAccountDialog account={selectedAccount} />}
      {openDialogs['delete-account'] && <DeleteAccountDialog account={selectedAccount} onDeleted={onAccountDeleted} />}
    </>
  );
}

