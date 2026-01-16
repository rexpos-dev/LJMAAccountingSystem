'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDialog } from '@/components/layout/dialog-provider';
import { useExternalProducts, ExternalProduct } from '@/hooks/use-products';
import { Search, Filter, CalendarIcon, Plus, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import format from '@/lib/date-format';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/providers/auth-provider';

export default function InventoryDialog() {
  const { openDialogs, closeDialog, openDialog } = useDialog();
  const { toast } = useToast();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<Record<string, string>>({});

  const isAuditor = user?.accountType === 'Auditor';

  const { externalProducts, isLoading, error, pagination, refreshExternalProducts } = useExternalProducts(
    currentPage,
    pageSize,
    search,
    filterBy,
    filterValue
  );

  // Calculate summary totals
  const summaryTotals = externalProducts.reduce(
    (totals, product) => {
      const cost = product.cost ? parseFloat(product.cost.toString()) : 0;
      const price = parseFloat(product.price.toString());
      const stock = parseInt(product.stock.toString()) || 0;

      return {
        itemCount: totals.itemCount + 1,
        totalCosts: totals.totalCosts + (cost * stock),
        totalProfit: totals.totalProfit + ((price - cost) * stock),
      };
    },
    { itemCount: 0, totalCosts: 0, totalProfit: 0 }
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  const applyFilters = () => {
    // Validate that both filterBy and filterValue are supplied
    if (!filterBy) {
      toast({
        title: 'Filter Validation',
        description: 'Please select a filter type (Filter By)',
        variant: 'destructive',
      });
      return;
    }

    if (!filterValue && filterBy !== 'date') {
      toast({
        title: 'Filter Validation',
        description: 'Please enter a filter value',
        variant: 'destructive',
      });
      return;
    }

    if (filterBy === 'date' && !filterDate) {
      toast({
        title: 'Filter Validation',
        description: 'Please select a date for filtering',
        variant: 'destructive',
      });
      return;
    }

    setCurrentPage(1); // Reset to first page when applying filters
    refreshExternalProducts();

    toast({
      title: 'Filters Applied',
      description: `Filtered by ${filterBy}: ${filterBy === 'date' ? format(filterDate!, 'MM/dd/yyyy') : filterValue}`,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setFilterBy('');
    setFilterValue('');
    setFilterDate(undefined);
    setCurrentPage(1); // Reset to first page when clearing filters
    refreshExternalProducts();
  };

  return (
    <Dialog open={openDialogs['inventory']} onOpenChange={() => closeDialog('inventory')}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Stock Products</DialogTitle>
            {!isAuditor && (
              <Button onClick={() => openDialog('add-product' as any)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Products
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters and Search */}
          <div className="flex flex-wrap gap-4 p-4 border-b">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Search</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="min-w-[150px]">
              <Label htmlFor="filterBy">Filter By</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="productName">Product Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="salesOrder">Sales Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label htmlFor="filterValue">Filter Value</Label>
              {filterBy === 'date' ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filterDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDate ? format(filterDate, 'MM/dd/yyyy') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filterDate}
                      onSelect={(date) => {
                        setFilterDate(date);
                        setFilterValue(date ? format(date, 'yyyy-MM-dd') : '');
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  id="filterValue"
                  placeholder="Enter filter value"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  disabled={!filterBy}
                />
              )}
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={applyFilters} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button onClick={clearFilters} variant="outline">
                Clear
              </Button>
            </div>
          </div>

          {/* Products Table */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Fixed Header */}
            <div className="flex-shrink-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Select</TableHead>
                    <TableHead className="w-24">SKU</TableHead>
                    <TableHead className="min-w-48">Name</TableHead>
                    <TableHead className="w-32">Barcode</TableHead>
                    <TableHead className="w-32">Category</TableHead>
                    <TableHead className="w-32">Brand</TableHead>
                    <TableHead className="w-24 text-right">Price</TableHead>
                    <TableHead className="w-24 text-right">Cost</TableHead>
                    <TableHead className="w-20 text-right">Stock</TableHead>
                    <TableHead className="w-28">Action</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-red-500">
                        No Products Fetch
                      </TableCell>
                    </TableRow>
                  ) : externalProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    externalProducts.map((product: ExternalProduct, index: number) => (
                      <TableRow key={`${product.sku}-${index}`}>
                        <TableCell className="w-16">
                          <input
                            type="radio"
                            name="selectedProduct"
                            value={product.sku}
                            checked={selectedProducts === product.sku}
                            onChange={(e) => setSelectedProducts(e.target.value)}
                            className="w-4 h-4"
                          />
                        </TableCell>
                        <TableCell className="w-24 font-medium">{product.sku}</TableCell>
                        <TableCell className="min-w-48">{product.name}</TableCell>
                        <TableCell className="w-32">{product.barcode || '-'}</TableCell>
                        <TableCell className="w-32">{product.category || '-'}</TableCell>
                        <TableCell className="w-32">{product.brand || '-'}</TableCell>
                        <TableCell className="w-24 text-right">₱{Number(product.price).toFixed(2)}</TableCell>
                        <TableCell className="w-24 text-right">₱{product.cost ? Number(product.cost).toFixed(2) : '-'}</TableCell>
                        <TableCell className="w-20 text-right">{product.stock}</TableCell>
                        <TableCell className="w-28">
                          <Select
                            value={selectedActions[product.sku] || ''}
                            onValueChange={(value) => setSelectedActions(prev => ({ ...prev, [product.sku]: value }))}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Action" />
                            </SelectTrigger>
                            <SelectContent>
                              {!isAuditor && <SelectItem value="edit">Edit</SelectItem>}
                              <SelectItem value="view">View</SelectItem>
                              {!isAuditor && <SelectItem value="update">Update</SelectItem>}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.offset + 1} to {Math.min(pagination.offset + externalProducts.length, pagination.total)} of {pagination.total} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasMore}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Grand Total Summary */}
          {!isLoading && externalProducts.length > 0 && (
            <div className="flex-shrink-0 bg-muted/50 p-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-background rounded-lg p-3 border">
                  <div className="text-sm font-medium text-muted-foreground">No. of Items</div>
                  <div className="text-2xl font-bold text-primary">{summaryTotals.itemCount}</div>
                </div>
                <div className="bg-background rounded-lg p-3 border">
                  <div className="text-sm font-medium text-muted-foreground">Total Costs</div>
                  <div className="text-2xl font-bold text-orange-600">₱{summaryTotals.totalCosts.toFixed(2)}</div>
                </div>
                <div className="bg-background rounded-lg p-3 border">
                  <div className="text-sm font-medium text-muted-foreground">Total Profit</div>
                  <div className="text-2xl font-bold text-green-600">₱{summaryTotals.totalProfit.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex-shrink-0 flex justify-end p-4 border-t">
            <Button onClick={() => closeDialog('inventory')} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
