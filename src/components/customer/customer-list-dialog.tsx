'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/providers/auth-provider';

interface Customer {
  id: string;
  code: string;
  customerName: string;
  contactFirstName: string | null;
  address: string | null;
  phonePrimary: string | null;
  phoneAlternative: string | null;
  email: string | null;
  isActive: boolean;
  creditLimit: number | null;
  isTaxExempt: boolean;
  paymentTerms: string | null;
  paymentTermsValue: string | null;
  salesperson: string | null;
  customerGroup: string | null;
  isEntitledToLoyaltyPoints: boolean;
  pointSetting: string | null;
  loyaltyCalculationMethod: string | null;
  loyaltyCardNumber: string | null;
  loyaltyPointsBalance: number;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerListDialog() {
  const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
  const { toast } = useToast();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const isAuditor = user?.accountType === 'Auditor';

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();

      // Transform the data to match frontend expectations
      const transformedData = data.map((customer: any) => ({
        ...customer,
        isActive: Boolean(customer.isActive),
        isTaxExempt: Boolean(customer.isTaxExempt),
        isEntitledToLoyaltyPoints: Boolean(customer.isEntitledToLoyaltyPoints),
        creditLimit: customer.creditLimit ? Number(customer.creditLimit) : null,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        loyaltyPointsBalance: customer.loyaltyPointsBalance || 0,
      }));

      setCustomers(transformedData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (openDialogs['customer-list']) {
      fetchCustomers();
    }
  }, [openDialogs['customer-list']]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchCustomers();
    };
    window.addEventListener('customer-list-refresh', handleRefresh);
    return () => {
      window.removeEventListener('customer-list-refresh', handleRefresh);
    };
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchQuery]);

  const handleDelete = async () => {
    if (!selectedCustomer) return;

    if (!confirm(`Are you sure you want to delete "${selectedCustomer.customerName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/customers?id=${selectedCustomer.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });

      fetchCustomers();
      setSelectedCustomer(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete customer',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    fetchCustomers();
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleEdit = () => {
    if (selectedCustomer) {
      setDialogData('add-customer', selectedCustomer);
      openDialog('add-customer');
    }
  };

  return (
    <Dialog open={openDialogs['customer-list']} onOpenChange={() => closeDialog('customer-list')}>
      <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Customer List</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {!isAuditor && (
              <>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => openDialog('add-customer')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
                <Button
                  variant="outline"
                  disabled={!selectedCustomer}
                  onClick={handleEdit}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  disabled={!selectedCustomer}
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </>
            )}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 pr-6 -mr-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Loyalty Card</TableHead>
                <TableHead>Loyalty Points Credit</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Loyalty Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    {searchQuery ? 'No customers found matching your search.' : 'No customers found.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className={selectedCustomer?.id === customer.id ? 'bg-muted/50' : 'cursor-pointer'}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <TableCell className="font-medium">{customer.code}</TableCell>
                    <TableCell>{customer.customerName}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {customer.loyaltyCardNumber || '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {customer.loyaltyPointsBalance || 0} pts
                    </TableCell>
                    <TableCell>{customer.phonePrimary || '-'}</TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${customer.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{customer.creditLimit ? `₱${Number(customer.creditLimit).toFixed(2)}` : '-'}</TableCell>
                    <TableCell>
                      {customer.isEntitledToLoyaltyPoints ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <Button
                variant={currentPage === 1 ? 'default' : 'outline'}
                size="sm"
                className="min-w-[40px]"
              >
                {currentPage}
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredCustomers.length} customers
              </span>
              <Button variant="ghost" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Refresh</span>
              </Button>
              <Button variant="outline" onClick={() => closeDialog('customer-list')}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
