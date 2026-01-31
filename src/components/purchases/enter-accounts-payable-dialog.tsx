'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import format from '@/lib/date-format';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAccounts } from '@/hooks/use-accounts';
import { useSuppliers } from '@/hooks/use-suppliers';

interface AllocationRow {
    id: string;
    account_no: string;
    account_name: string;
    amount: string;
    type: 'CR' | 'DR';
}

export function EnterAccountsPayableDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { data: accounts } = useAccounts();
    const { suppliers } = useSuppliers();

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
    const [allocations, setAllocations] = useState<AllocationRow[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
    const [supplierAddress, setSupplierAddress] = useState<string>('');
    const [selectedApAccount, setSelectedApAccount] = useState<string>('');
    const [accountBalance, setAccountBalance] = useState<string>('₱0.00');
    const [amount, setAmount] = useState<string>('₱0.00');
    const [accountNameFilter, setAccountNameFilter] = useState<string>('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [memo, setMemo] = useState('Purchases');

    useEffect(() => {
        if (openDialogs['enter-ap']) {
            // Reset or init logic can go here
        }
    }, [openDialogs['enter-ap']]);

    const handleSupplierChange = (supplierId: string) => {
        setSelectedSupplierId(supplierId);
        const supplier = suppliers.find(s => s.id === supplierId);
        if (supplier) {
            // Populate address if available. 
            // Assuming the API returns an address field, if not it will be undefined/empty
            setSupplierAddress(supplier.address || '');

            // Potential: If supplier has default terms, calculate due date
        }
    };

    const handleRowDoubleClick = () => {
        if (allocations.length === 0) {
            const newAllocations: AllocationRow[] = [
                {
                    id: 'debit-1',
                    account_no: '',
                    account_name: '',
                    amount: '',
                    type: 'DR',
                },
                {
                    id: 'credit-1',
                    account_no: '',
                    account_name: '',
                    amount: '',
                    type: 'CR',
                },
            ];
            setAllocations(newAllocations);
        }
    };

    const handleAccountChange = (id: string, accountNumber: string) => {
        const account = accounts.find(acc => acc.account_no?.toString() === accountNumber);
        setAllocations(prev =>
            prev.map(allocation =>
                allocation.id === id
                    ? { ...allocation, account_no: accountNumber, account_name: account?.account_name || '' }
                    : allocation
            )
        );
    };

    const handleNameChange = (id: string, accountName: string) => {
        const account = accounts.find(acc => acc.account_name === accountName);
        setAllocations(prev =>
            prev.map(allocation =>
                allocation.id === id
                    ? { ...allocation, account_no: account?.account_no?.toString() ?? '', account_name: accountName }
                    : allocation
            )
        );
    };

    const handleAmountChange = (id: string, value: string) => {
        setAllocations(prev =>
            prev.map(allocation => {
                if (allocation.id === id) {
                    return { ...allocation, amount: value };
                }
                return allocation;
            })
        );
    };

    const handleDeleteAllocation = (id: string) => {
        setAllocations(prev => prev.filter(allocation => allocation.id !== id));
    };

    const handleApAccountChange = (accountNumber: string) => {
        setSelectedApAccount(accountNumber);
        const account = accounts.find(acc => acc.account_no?.toString() === accountNumber);
        if (account && account.balance !== undefined) {
            setAccountBalance(`₱${account.balance.toFixed(2)}`);
        } else {
            setAccountBalance('₱0.00');
        }
    };

    return (
        <Dialog open={openDialogs['enter-ap']} onOpenChange={() => closeDialog('enter-ap')}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col bg-background text-foreground">
                <DialogHeader>
                    <DialogTitle>Enter New Accounts Payable</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-6 -mr-6">
                    <div className="space-y-6 p-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="date">Date:</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                id="date"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal col-span-2',
                                                    !date && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="due-date">Due Date:</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                id="due-date"
                                                className={cn(
                                                    'w-full justify-start text-left font-normal col-span-2',
                                                    !dueDate && 'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, 'MM/dd/yyyy') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={setDueDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label>Supplier:</Label>
                                    <div className="col-span-2 flex gap-2">
                                        <Select value={selectedSupplierId} onValueChange={handleSupplierChange}>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suppliers.filter(supplier => supplier.id).map(supplier => (
                                                    <SelectItem key={supplier.id} value={supplier.id}>
                                                        {supplier.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" size="icon" title="Add Supplier">
                                            <UserPlus className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" title="Edit Supplier">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 items-start gap-4">
                                    <Label htmlFor="supplier-address">Supplier address:</Label>
                                    <Textarea
                                        id="supplier-address"
                                        className="col-span-2 bg-muted/30"
                                        rows={3}
                                        value={supplierAddress}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="ap-account">Accounts Payable:</Label>
                                    <Select value={selectedApAccount} onValueChange={handleApAccountChange}>
                                        <SelectTrigger id="ap-account" className='col-span-2'>
                                            <SelectValue placeholder="Select Accounts Payable..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accounts.filter(account => account.account_type === 'Liability' && account.account_no).map(account => (
                                                <SelectItem key={account.id ?? account.account_no} value={account.account_no?.toString() || ''}>
                                                    {account.account_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="account-balance">Account Balance:</Label>
                                    <Input id="account-balance" value={accountBalance} disabled className="col-span-2 bg-muted/50" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="amount">Amount:</Label>
                                    <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-2" />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="ref-number">Reference number:</Label>
                                    <Input
                                        id="ref-number"
                                        className="col-span-2"
                                        value={referenceNumber}
                                        onChange={(e) => setReferenceNumber(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-start gap-4">
                                    <Label htmlFor="memo">Memo:</Label>
                                    <Textarea
                                        id="memo"
                                        placeholder="Purchases"
                                        className="col-span-2"
                                        rows={3}
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mt-6">
                            <h3 className="text-lg font-medium">Account Allocation</h3>
                            <div className="border rounded-md overflow-hidden bg-background">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px]">Number</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="w-[150px] text-right">Amount</TableHead>
                                            <TableHead className="w-[100px] text-right">CR/DR</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allocations.length === 0 ? (
                                            <TableRow onDoubleClick={handleRowDoubleClick} className="cursor-pointer hover:bg-muted/50">
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                                                    Double-click here to allocate an amount to account(s).
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            allocations.map(allocation => (
                                                <TableRow key={allocation.id}>
                                                    <TableCell>
                                                        <Select value={allocation.account_no || undefined} onValueChange={(value) => handleAccountChange(allocation.id, value)}>
                                                            <SelectTrigger className="w-full border-0 shadow-none h-8">
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {accounts
                                                                    .filter(account =>
                                                                        account.account_name.toLowerCase().includes(accountNameFilter.toLowerCase()) && account.account_no
                                                                    )
                                                                    .map(account => (
                                                                        <SelectItem key={account.id ?? account.account_no} value={account.account_no!.toString()}>
                                                                            {account.account_no}
                                                                        </SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={allocation.account_name}
                                                            onValueChange={(value) => handleNameChange(allocation.id, value)}
                                                        >
                                                            <SelectTrigger className="w-full border-0 shadow-none h-8">
                                                                <SelectValue placeholder="Select account name" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {accounts
                                                                    .filter(account =>
                                                                        account.account_name && account.account_name.toLowerCase().includes(accountNameFilter.toLowerCase())
                                                                    )
                                                                    .map(account => (
                                                                        <SelectItem key={account.id ?? account.account_no ?? account.account_name} value={account.account_name}>
                                                                            {account.account_name}
                                                                        </SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Input
                                                            type="number"
                                                            value={allocation.amount}
                                                            onChange={(e) => handleAmountChange(allocation.id, e.target.value)}
                                                            className="w-full text-right border-0 shadow-none h-8 focus-visible:ring-0"
                                                            placeholder="0.00"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="text-right flex items-center justify-end gap-2 pr-4">
                                                        <span>{allocation.type}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteAllocation(allocation.id)}
                                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="mt-4">
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700">Record</Button>
                    <Button variant="secondary" onClick={() => closeDialog('enter-ap')}>Cancel</Button>
                    <Button variant="outline">Help</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
