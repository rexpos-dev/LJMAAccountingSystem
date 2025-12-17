
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  Printer,
  Save,
  Mail,
  HelpCircle,
} from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import type { Transaction } from '@/types/transaction';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockTransactions } from './mock-transactions';

type ViewJournalPageProps = {
  onTransactionSelect?: (transaction: Transaction | null) => void;
};


export default function ViewJournalPage({ onTransactionSelect }: ViewJournalPageProps) {
  const { openDialogs, closeDialog, openDialog } = useDialog();

  const [selectedEntry, setSelectedEntry] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [accountNumberFilter, setAccountNumberFilter] = useState('');
  const [accountNameFilter, setAccountNameFilter] = useState('');

  // Use mock data instead of Firebase
  const transactions = mockTransactions;
  const isLoadingTransactions = false;

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(transaction => {
      const accNumMatch = !accountNumberFilter || (transaction.accountNumber && transaction.accountNumber.toLowerCase().includes(accountNumberFilter.toLowerCase()));
      const accNameMatch = !accountNameFilter || (transaction.accountName && transaction.accountName.toLowerCase().includes(accountNameFilter.toLowerCase()));
      return accNumMatch && accNameMatch;
    });
  }, [transactions, accountNumberFilter, accountNameFilter]);


  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / itemsPerPage);
  }, [filteredTransactions, itemsPerPage]);


  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, accountNumberFilter, accountNameFilter]);


  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'N/A';
    try {
        const date = timestamp.toDate();
        if (Number.isNaN(date.getTime())) return 'Invalid Date';
        return format(date, 'MM/dd/yyyy');
    } catch {
        return 'Invalid Date';
    }
  };
  
  const formatCurrency = (amount?: number | null) => {
    if (amount === undefined || amount === null) return '';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  const handleRowDoubleClick = (entry: Transaction) => {
    if (onTransactionSelect) {
      onTransactionSelect(entry);
    }
    openDialog('edit-transaction');
  };

  const handleRowClick = (entry: Transaction) => {
    setSelectedEntry(entry);
  };

  const handleViewTransaction = (entry: Transaction) => {
    setSelectedEntry(entry);
    openDialog('view-transaction');
  };
  
  const renderJournalTable = () => (
    <div className="flex-1 flex flex-col min-h-0">
       <div className="flex-grow border rounded-md relative overflow-hidden">
        <ScrollArea className="h-full">
            <Table>
            <TableHeader className="sticky top-0 bg-card z-10 shadow-sm border-b">
                <TableRow>
                <TableHead className="whitespace-nowrap bg-card">Date</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Ledger</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Account Number</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Account Name</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Code</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Particulars</TableHead>
                <TableHead className="text-right whitespace-nowrap bg-card">Debit</TableHead>
                <TableHead className="text-right whitespace-nowrap bg-card">Credit</TableHead>
                <TableHead className="text-right whitespace-nowrap bg-card">Balance</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Check Account Number</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Check Number</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Date Matured</TableHead>
                <TableHead className="whitespace-nowrap bg-card">User</TableHead>
                <TableHead className="whitespace-nowrap bg-card">Approval</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoadingTransactions ? (
                <TableRow>
                    <TableCell colSpan={14} className="text-center h-24">
                    Loading transactions...
                    </TableCell>
                </TableRow>
                ) : paginatedTransactions && paginatedTransactions.length > 0 ? (
                paginatedTransactions.map(entry => (
                    <TableRow
                      key={entry.id}
                      onClick={() => handleRowClick(entry)}
                      onDoubleClick={() => handleRowDoubleClick(entry)}
                      className={cn('cursor-pointer even:bg-muted/30', { 'bg-primary/20': selectedEntry?.id === entry.id })}
                    >
                    <TableCell className="whitespace-nowrap">{formatTimestamp(entry.date)}</TableCell>
                    <TableCell className="whitespace-nowrap">{entry.ledger}</TableCell>
                    <TableCell className="whitespace-nowrap">{entry.accountNumber}</TableCell>
                    <TableCell className="truncate">{entry.accountName ?? 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{entry.code}</TableCell>
                    <TableCell className="truncate">{entry.particulars}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">{formatCurrency(entry.debit)}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">{formatCurrency(entry.credit)}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">{formatCurrency(entry.balance)}</TableCell>
                    <TableCell className="whitespace-nowrap">{entry.checkAccountNumber ?? 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{entry.checkNumber ?? 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatTimestamp(entry.dateMatured)}</TableCell>
                    <TableCell className="whitespace-nowrap">{entry.user ?? 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{entry.approval ?? 'N/A'}</TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={14} className="text-center h-24">
                    No matching journal entries found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </ScrollArea>
       </div>
      <div className="flex-shrink-0 flex items-center justify-end space-x-4 pt-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor='items-per-page' className='text-sm text-muted-foreground'>Rows per page:</Label>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger id='items-per-page' className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className='text-sm text-muted-foreground'>
          Page {currentPage} of {totalPages > 0 ? totalPages : 1}
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  return (
     <Dialog open={openDialogs['view-journal']} onOpenChange={() => closeDialog('view-journal')}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
            <DialogTitle className="font-headline text-white">View Journal</DialogTitle>
        </DialogHeader>
        <div className="flex-shrink-0">
            <Menubar className="rounded-none border-x-0 border-t-0">
            <MenubarMenu>
                <MenubarTrigger>Journal</MenubarTrigger>
                <MenubarContent>
                <MenubarItem onClick={() => openDialog('journal-entry')}>
                    New Entry <MenubarShortcut>Ctrl+N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled={!selectedEntry} onClick={() => selectedEntry && handleRowDoubleClick(selectedEntry)}>
                    Edit Entry <MenubarShortcut>Enter</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled={!selectedEntry}>
                    Delete Entry <MenubarShortcut>Ctrl+Delete</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                    Find Entry <MenubarShortcut>Ctrl+F</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                    Find Next Entry <MenubarShortcut>F3</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Import Transactions From CSV</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => closeDialog('view-journal')}>
                    Close <MenubarShortcut>Esc</MenubarShortcut>
                </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Report</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Print <MenubarShortcut>Ctrl+P</MenubarShortcut></MenubarItem>
                  <MenubarItem>Print Preview</MenubarItem>
                  <MenubarItem>Send to Email <MenubarShortcut>Ctrl+E</MenubarShortcut></MenubarItem>
                  <MenubarItem>Send to Fax</MenubarItem>
                  <MenubarItem>Save as PDF <MenubarShortcut>Ctrl+S</MenubarShortcut></MenubarItem>
                  <MenubarItem>Save as CSV</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Help</MenubarTrigger>
            </MenubarMenu>
            </Menubar>

            <div className="flex items-center gap-2 p-2 border-b bg-card">
            <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => openDialog('journal-entry')}>
                <Plus className="h-6 w-6" />
                <span>Add</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry}>
                <Trash2 className="h-6 w-6" />
                <span>Delete</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry} onClick={() => selectedEntry && handleRowDoubleClick(selectedEntry)}>
                <Pencil className="h-6 w-6" />
                <span>Edit</span>
            </Button>
            <div className="mx-2 h-8 border-l" />
            <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry} onClick={() => selectedEntry && handleViewTransaction(selectedEntry)}>
                <Eye className="h-6 w-6" />
                <span>Preview</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry}>
                <Printer className="h-6 w-6" />
                <span>Print</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry}>
                <Save className="h-6 w-6" />
                <span>Save</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry}>
                <Mail className="h-6 w-6" />
                <span>Email</span>
            </Button>
            <div className="ml-auto">
                <Button variant="ghost" size="sm" className="flex-col h-auto">
                <HelpCircle className="h-6 w-6" />
                <span>Help</span>
                </Button>
            </div>
            </div>
        </div>
        
        <div className="px-4 pt-4 flex-shrink-0">
          <div className="flex items-end gap-4 p-4 rounded-md bg-muted/50">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="filter-account-number">Filter by Account Number</Label>
              <Input 
                id="filter-account-number"
                placeholder="Enter account number..."
                value={accountNumberFilter}
                onChange={(e) => setAccountNumberFilter(e.target.value)}
              />
            </div>
            <div className="grid gap-2 flex-1">
              <Label htmlFor="filter-account-name">Filter by Account Name</Label>
              <Input 
                id="filter-account-name"
                placeholder="Enter account name..."
                value={accountNameFilter}
                onChange={(e) => setAccountNameFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-4 pt-4 flex-1 flex flex-col min-h-0">
          {renderJournalTable()}
        </div>
        <DialogFooter className='border-t pt-4 flex-shrink-0'>
             <DialogClose asChild>
                <Button onClick={() => closeDialog('view-journal')}>Close</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
