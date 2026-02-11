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
    Search,
    RefreshCw,
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
import format from '@/lib/date-format';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import type { Transaction } from '@/types/transaction';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export default function ViewJournalDialog() {
    const { openDialogs, closeDialog, openDialog } = useDialog();
    const { toast } = useToast();

    const [selectedEntry, setSelectedEntry] = useState<Transaction | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [referenceFilter, setReferenceFilter] = useState('');
    const [accountNumberFilter, setAccountNumberFilter] = useState('');
    const [accountNameFilter, setAccountNameFilter] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

    const fetchTransactions = async () => {
        try {
            setIsLoadingTransactions(true);
            const response = await fetch('/api/transactions');
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const data = await response.json();
            // Transform data to match Transaction type
            const transformedData = Array.isArray(data) ? data.map((t: any) => ({
                ...t,
                seq: t.seq ?? 0,
                date: t.date ? new Date(t.date) : null,
                dateMatured: t.dateMatured ? new Date(t.dateMatured) : null,
            })) : [];
            setTransactions(transformedData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast({
                title: 'Error',
                description: 'Failed to load journal entries',
                variant: 'destructive',
            });
            setTransactions([]);
        } finally {
            setIsLoadingTransactions(false);
        }
    };

    useEffect(() => {
        if (openDialogs['view-journal']) {
            fetchTransactions();
        }
    }, [openDialogs['view-journal']]);

    useEffect(() => {
        const handleRefresh = () => {
            fetchTransactions();
        };
        window.addEventListener('journal-refresh', handleRefresh);
        return () => {
            window.removeEventListener('journal-refresh', handleRefresh);
        };
    }, []);

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        return transactions.filter(transaction => {
            const refMatch = !referenceFilter || (transaction.transNo && transaction.transNo.toLowerCase().includes(referenceFilter.toLowerCase()));
            const accNumMatch = !accountNumberFilter || (transaction.accountNumber && transaction.accountNumber.toLowerCase().includes(accountNumberFilter.toLowerCase()));
            const accNameMatch = !accountNameFilter || (transaction.accountName && transaction.accountName.toLowerCase().includes(accountNameFilter.toLowerCase()));
            return refMatch && accNumMatch && accNameMatch;
        });
    }, [transactions, referenceFilter, accountNumberFilter, accountNameFilter]);

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
    }, [itemsPerPage, referenceFilter, accountNumberFilter, accountNameFilter]);

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const formatTimestamp = (timestamp: Timestamp | Date | string | null) => {
        if (!timestamp) return 'N/A';
        try {
            let date: Date;
            if (timestamp instanceof Date) {
                date = timestamp;
            } else if (typeof timestamp === 'string') {
                date = new Date(timestamp);
            } else {
                // Firebase Timestamp
                date = (timestamp as any).toDate();
            }
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
        // openDialog('edit-transaction');
        toast({ title: 'Edit', description: 'Edit functionality coming soon' });
    };

    const handleRowClick = (entry: Transaction) => {
        setSelectedEntry(entry);
    };

    const handleViewTransaction = (entry: Transaction) => {
        setSelectedEntry(entry);
        // openDialog('view-transaction');
        toast({ title: 'View', description: 'View functionality coming soon' });
    };

    return (
        <Dialog open={openDialogs['view-journal']} onOpenChange={() => closeDialog('view-journal')}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>View Journal</DialogTitle>
                </DialogHeader>

                <div className="flex-shrink-0 border-b pb-2">
                    <div className="flex items-center gap-2 px-2 py-1 bg-muted/30">
                        <Button variant="ghost" size="sm" className="flex-col h-auto" onClick={() => openDialog('journal-entry')}>
                            <Plus className="h-5 w-5" />
                            <span className="text-[10px]">Add</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                            <span className="text-[10px]">Delete</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry} onClick={() => selectedEntry && handleRowDoubleClick(selectedEntry)}>
                            <Pencil className="h-5 w-5" />
                            <span className="text-[10px]">Edit</span>
                        </Button>
                        <div className="mx-2 h-8 border-l" />
                        <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry} onClick={() => selectedEntry && handleViewTransaction(selectedEntry)}>
                            <Eye className="h-5 w-5" />
                            <span className="text-[10px]">Preview</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry}>
                            <Printer className="h-5 w-5" />
                            <span className="text-[10px]">Print</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto" disabled={!selectedEntry}>
                            <Save className="h-5 w-5" />
                            <span className="text-[10px]">Save</span>
                        </Button>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={fetchTransactions} disabled={isLoadingTransactions}>
                                <RefreshCw className={cn("h-4 w-4", isLoadingTransactions && "animate-spin")} />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 flex-shrink-0">
                    <div className="flex items-end gap-4 p-3 rounded-md bg-muted/50 border">
                        <div className="grid gap-1.5 flex-1 text-xs">
                            <Label htmlFor="filter-reference" className="font-semibold">Filter by Reference</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                    id="filter-reference"
                                    placeholder="Enter reference..."
                                    value={referenceFilter}
                                    onChange={(e) => setReferenceFilter(e.target.value)}
                                    className="pl-7 h-8"
                                />
                            </div>
                        </div>
                        <div className="grid gap-1.5 flex-1 text-xs">
                            <Label htmlFor="filter-account-number" className="font-semibold">Filter by Account Number</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                    id="filter-account-number"
                                    placeholder="Enter account number..."
                                    value={accountNumberFilter}
                                    onChange={(e) => setAccountNumberFilter(e.target.value)}
                                    className="pl-7 h-8"
                                />
                            </div>
                        </div>
                        <div className="grid gap-1.5 flex-1 text-xs">
                            <Label htmlFor="filter-account-name" className="font-semibold">Filter by Account Name</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                    id="filter-account-name"
                                    placeholder="Enter account name..."
                                    value={accountNameFilter}
                                    onChange={(e) => setAccountNameFilter(e.target.value)}
                                    className="pl-7 h-8"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 px-4">
                    <div className="flex-grow border rounded-md overflow-hidden bg-card">
                        <ScrollArea className="h-full">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted/50 z-10 shadow-sm">
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap">Date</TableHead>
                                        <TableHead className="whitespace-nowrap">Reference</TableHead>
                                        <TableHead className="whitespace-nowrap">Ledger</TableHead>
                                        <TableHead className="whitespace-nowrap">Account Number</TableHead>
                                        <TableHead className="whitespace-nowrap">Account Name</TableHead>
                                        <TableHead className="whitespace-nowrap">Code</TableHead>
                                        <TableHead className="whitespace-nowrap">Particulars</TableHead>
                                        <TableHead className="text-right whitespace-nowrap">Debit</TableHead>
                                        <TableHead className="text-right whitespace-nowrap">Credit</TableHead>
                                        <TableHead className="whitespace-nowrap">User</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingTransactions ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center h-24">
                                                Loading transactions...
                                            </TableCell>
                                        </TableRow>
                                    ) : paginatedTransactions && paginatedTransactions.length > 0 ? (
                                        paginatedTransactions.map(entry => (
                                            <TableRow
                                                key={entry.id}
                                                onClick={() => handleRowClick(entry)}
                                                onDoubleClick={() => handleRowDoubleClick(entry)}
                                                className={cn('cursor-pointer even:bg-muted/10', { 'bg-primary/10': selectedEntry?.id === entry.id })}
                                            >
                                                <TableCell className="whitespace-nowrap">{formatTimestamp(entry.date)}</TableCell>
                                                <TableCell className="whitespace-nowrap font-semibold">{entry.transNo}</TableCell>
                                                <TableCell className="whitespace-nowrap text-xs">{entry.ledger}</TableCell>
                                                <TableCell className="whitespace-nowrap font-mono text-xs">{entry.accountNumber}</TableCell>
                                                <TableCell className="max-w-[200px] truncate text-xs">{entry.accountName ?? 'N/A'}</TableCell>
                                                <TableCell className="whitespace-nowrap text-xs">{entry.code}</TableCell>
                                                <TableCell className="max-w-[200px] truncate text-xs">{entry.particulars}</TableCell>
                                                <TableCell className="text-right whitespace-nowrap font-mono text-xs text-blue-600">{formatCurrency(entry.debit)}</TableCell>
                                                <TableCell className="text-right whitespace-nowrap font-mono text-xs text-orange-600">{formatCurrency(entry.credit)}</TableCell>
                                                <TableCell className="whitespace-nowrap text-xs">{entry.user ?? 'N/A'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center h-24">
                                                No matching journal entries found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>

                    <div className="flex flex-shrink-0 items-center justify-between pt-4 pb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Rows per page:</span>
                            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                                <SelectTrigger className="w-[70px] h-7">
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

                        <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">
                                Page {currentPage} of {totalPages > 0 ? totalPages : 1}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className="h-7 px-2 text-[10px]"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="h-7 px-2 text-[10px]"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-3 mt-auto">
                    <Button variant="outline" onClick={() => closeDialog('view-journal')}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
