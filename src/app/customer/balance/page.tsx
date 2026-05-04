"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDialog } from '@/components/layout/dialog-context';
import { useToast } from '@/hooks/use-toast';
import { useSalesUsers } from '@/hooks/use-sales-users';
import { useCustomerBalances, CustomerBalance } from '@/hooks/use-customer-balances';
import { Search, RefreshCw, MoreVertical, Calculator } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CustomerBalancePage() {
  const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: salesUsers } = useSalesUsers();

  const { balances, isLoading: isLoadingBalances, refreshBalances } = useCustomerBalances();

  const filteredBalances = balances.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmountSum = filteredBalances.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
  const amountPaidSum = filteredBalances.reduce((sum, b) => sum + Number(b.amountPaid || 0), 0);
  const balanceSum = filteredBalances.reduce((sum, b) => sum + Number(b.balance || 0), 0);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (openDialogs['customer-balance']) {
      if (!fromDate) setFromDate(new Date().toISOString().slice(0, 10));
      if (!toDate) setToDate(new Date().toISOString().slice(0, 10));
    }
  }, [openDialogs['customer-balance']]);

  const handleRefresh = () => {
    refreshBalances();
    toast({ title: 'Refreshed', description: 'Refreshed customer balances' });
  };

  const handleRecalculate = () => {
    refreshBalances(true);
    toast({ title: 'Recalculating', description: 'Recalculating absolute customer balances...' });
  };

  return (
    <Dialog open={openDialogs['customer-balance']} onOpenChange={() => closeDialog('customer-balance' as any)}>
      <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Customer Balances</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh" className="h-8 w-8">
              <RefreshCw className={`h-4 w-4 ${isLoadingBalances ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRecalculate} title="Recalculate Balances" className="h-8 w-8">
              <Calculator className={`h-4 w-4 ${isLoadingBalances ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </DialogHeader>

        {/* Top controls: Save/Print, Date range, options, Show Statement, Search */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="outline">Save/Print</Button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">From Date</label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">To Date</label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            <div className="flex items-center gap-3 ml-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Show All</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Show Invoice Detail</label>
            </div>

            <div className="ml-auto">
              <Button onClick={() => toast({ title: 'Statement', description: 'Show statement clicked' })}>Show Statement</Button>
            </div>
          </div>

          {/* Filters row: Sales Area / Sales Group / Sales Person and Search */}
          <div className="flex items-center gap-4">
            <div className="w-1/3">
              <label className="block text-sm mb-1 text-muted-foreground">Sales Area</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/3">
              <label className="block text-sm mb-1 text-muted-foreground">Sales Group</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-1/3">
              <label className="block text-sm mb-1 text-muted-foreground">Sales Person</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {salesUsers?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-64 ml-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Customer Name/Code" className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-6 -mr-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Credit</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="w-[50px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingBalances ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading customer balances...
                  </TableCell>
                </TableRow>
              ) : filteredBalances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No customer balances to display.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBalances.map((customer: CustomerBalance) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium text-xs">{customer.id}</TableCell>
                    <TableCell className="font-semibold">{customer.name}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(customer.totalAmount || 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(customer.amountPaid || 0))}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(customer.balance || 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setDialogData('customer-statement' as any, { id: customer.id, name: customer.name, address: customer.address });
                            openDialog('customer-statement' as any);
                          }}>
                            Statement of Account
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setDialogData('customer-ledger' as any, { customer: { id: customer.id, name: customer.name } });
                            openDialog('customer-ledger' as any);
                          }}>
                            Ledger
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isLoadingBalances && filteredBalances.length > 0 && (
              <TableFooter>
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={2} className="text-right">Grand Total</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalAmountSum)}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amountPaidSum)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(balanceSum)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </ScrollArea>

        <DialogFooter className="border-t pt-4">
          <div className="flex items-center justify-end w-full gap-2">
            <Button variant="outline" onClick={() => closeDialog('customer-balance' as any)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
