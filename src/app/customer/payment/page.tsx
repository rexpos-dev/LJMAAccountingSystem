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
import { useCustomerPayments, CustomerPayment } from '@/hooks/use-customer-payments';
import { Plus, Search, RefreshCw } from 'lucide-react';

export default function CustomerPaymentPage() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [paymentType, setPaymentType] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { payments, isLoading, error: apiError, refreshPayments } = useCustomerPayments();

  // Create robust filtering to prevent crashes if name/reference are null
  const filteredPayments = payments.filter((p) => {
    if (!p) return false;
    const name = (p.customer_name || '').toLowerCase();
    const ref = (p.reference || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();

    return name.includes(query) || ref.includes(query);
  });

  const totalAmountPaid = filteredPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

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
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Customer Payments</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => { refreshPayments(); toast({ title: 'Refreshed', description: 'Refreshed customer payments' }); }} title="Refresh" className="h-8 w-8">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground font-medium">Loading payment information...</span>
                    </div>
                  </td>
                </tr>
              ) : apiError ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 bg-red-50/30">
                    <div className="text-red-500 font-semibold mb-1">Failed to Load Payments</div>
                    <div className="text-xs text-red-400 max-w-md mx-auto">{apiError.message}</div>
                    <Button variant="link" size="sm" onClick={() => refreshPayments()} className="mt-2 text-red-600">Try Again</Button>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-muted-foreground italic border-dashed border-2 rounded-lg">
                    No payment information to display{searchQuery ? ` matching "${searchQuery}"` : ''}.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment: CustomerPayment) => (
                  <tr key={payment.id} className="border-b text-sm hover:bg-muted/50 transition-colors">
                    <td className="p-2 font-medium">{payment.customer_name || 'N/A'}</td>
                    <td className="p-2 text-green-600 font-semibold">
                      {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(payment.amount || 0))}
                    </td>
                    <td className="p-2 text-muted-foreground">-</td>
                    <td className="p-2 text-muted-foreground">-</td>
                    <td className="p-2">{payment.payment_type || 'N/A'}</td>
                    <td className="p-2">
                      {(() => {
                        try {
                          return payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A';
                        } catch (e) {
                          return 'Invalid Date';
                        }
                      })()}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground truncate max-w-[120px]" title={payment.reference}>{payment.reference || '-'}</td>
                    <td className="p-2 text-xs text-muted-foreground truncate max-w-[150px]" title={payment.note}>{payment.note || '-'}</td>
                  </tr>
                ))
              )}
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
            <div className="text-lg font-semibold text-green-600">
              {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(totalAmountPaid)}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => closeDialog('customer-payment')}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
