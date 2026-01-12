"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, RefreshCw } from 'lucide-react';

export default function CustomerPaymentPage() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [paymentType, setPaymentType] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (openDialogs['customer-payment']) {
      if (!fromDate) setFromDate(new Date().toISOString().slice(0, 10));
      if (!toDate) setToDate(new Date().toISOString().slice(0, 10));
    }
  }, [openDialogs['customer-payment']]);

  const handleAdd = () => {
    // open add payment dialog or route
    toast({ title: 'Add Payment', description: 'Open add payment form (not implemented)' });
  };

  const handleExport = () => {
    toast({ title: 'Export', description: 'Export payments (not implemented)' });
  };

  const handleShowReport = () => {
    toast({ title: 'Show Report', description: 'Showing report (not implemented)' });
  };

  return (
    <Dialog open={openDialogs['customer-payment']} onOpenChange={() => closeDialog('customer-payment')}>
      <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Customer Payments</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Payment
            </Button>
            <Button variant="outline" onClick={handleExport}>Export</Button>
          </div>

          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue>{customerFilter === 'all' ? 'All Customers' : customerFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-md mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">From Date</label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">To Date</label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            <div className="w-40">
              <label className="block text-sm mb-1 text-muted-foreground">Payment Type</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue>{paymentType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto">
              <Button onClick={handleShowReport}>Show Report</Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-6 -mr-6">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-sm text-muted-foreground border-b">
                <th className="p-2 text-left">Customer Name</th>
                <th className="p-2 text-left">Amount Paid</th>
                <th className="p-2 text-left">Allocated</th>
                <th className="p-2 text-left">Left to allocate</th>
                <th className="p-2 text-left">Payment Type</th>
                <th className="p-2 text-left">Date of Payment</th>
                <th className="p-2 text-left">Reference</th>
                <th className="p-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="text-center py-8">No payment information to display.</td>
              </tr>
            </tbody>
          </table>
        </ScrollArea>

        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Prev</Button>
            <div className="px-3 py-1 bg-muted text-sm rounded">1</div>
            <Button variant="outline" size="sm">Next</Button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Limit</label>
            <Select>
              <SelectTrigger className="w-20">
                <SelectValue>50</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 border rounded-md p-4 bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Grand Total</div>
              <div className="text-xs text-muted-foreground">Amount Paid</div>
            </div>
            <div className="text-lg font-semibold">0.00</div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => closeDialog('customer-payment')}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
