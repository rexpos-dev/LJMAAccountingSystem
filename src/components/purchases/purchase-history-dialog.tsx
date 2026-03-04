"use client";

import React, { useEffect, useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FileDown, FileText, Download, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PurchaseHistoryItem {
    id: string;
    category: string | null;
    sku: string | null;
    barcode: string | null;
    itemDescription: string;
    buyingUom: string | null;
    qtyPerCase: number | null;
    offtake: number | null;
    orderQty: number | null;
    pieces: number | null;
    costPricePerCase: number | null;
    costPricePerPiece: number | null;
    discount1: number | null;
    discount2: number | null;
    discount3: number | null;
    netCostAmount: number | null;
}

interface PurchaseOrder {
    id: string;
    date: Date;
    supplier: {
        name: string;
    };
    items: PurchaseHistoryItem[];
    total: number;
}

export default function PurchaseHistoryDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const { toast } = useToast();
    const [order, setOrder] = useState<PurchaseOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Helper function to format currency with commas
    const formatCurrency = (amount: number): string => {
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const isOpen = openDialogs['purchase-history'];
    const data = getDialogData('purchase-history');

    useEffect(() => {
        if (isOpen && data?.orderId) {
            fetchPurchaseOrder(data.orderId);
        }
    }, [isOpen, data]);

    // Reset to page 1 when filters change or order changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, dateFrom, dateTo, order]);

    const fetchPurchaseOrder = async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/purchase-orders/${orderId}`);
            if (!response.ok) throw new Error('Failed to fetch purchase order');

            const data = await response.json();
            setOrder(data);
        } catch (error: any) {
            console.error('Error fetching purchase order:', error);
            setError(error.message === 'Failed to fetch purchase order' ? 'Failed to fetch purchase history.' : 'No connection on API. Please check your network and try again.');
            toast({
                title: "Error",
                description: "Failed to load purchase history.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!order) return;

        const csvRows = [];

        // Add header
        csvRows.push([
            'Supplier',
            'Categories',
            'SKU',
            'Barcode',
            'Product Description',
            'Buying UOM',
            'QTY/Case',
            'Offtake',
            'Order QTY',
            'Pieces',
            'Cost Price per Case',
            'Cost Price per Piece',
            'Discount 1',
            'Discount 2',
            'Discount 3',
            'Net Cost Amount'
        ].join(','));

        // Add data rows
        order.items.forEach((item) => {
            csvRows.push([
                order.supplier.name,
                item.category || '',
                item.sku || '',
                item.barcode || '',
                item.itemDescription || '',
                item.buyingUom || '',
                item.qtyPerCase || '',
                item.offtake || '',
                item.orderQty || '',
                item.pieces || '',
                item.costPricePerCase || '',
                item.costPricePerPiece || '',
                item.discount1 || '',
                item.discount2 || '',
                item.discount3 || '',
                item.netCostAmount || ''
            ].join(','));
        });

        // Create and download CSV file
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `purchase-history-${order.supplier.name}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful",
            description: "Purchase history exported to CSV."
        });
    };

    const exportToPDF = () => {
        if (!order) return;

        // Create printable content
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Purchase History - ${order.supplier.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; margin-bottom: 10px; }
                    .info { margin-bottom: 20px; color: #666; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
                    th { background-color: #f4f4f4; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .total { margin-top: 20px; text-align: right; font-weight: bold; font-size: 16px; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <h1>Purchase History</h1>
                <div class="info">
                    <strong>Supplier:</strong> ${order.supplier.name}<br>
                    <strong>Date:</strong> ${format(new Date(order.date), 'MMMM dd, yyyy')}<br>
                    <strong>Order ID:</strong> ${order.id}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>SKU</th>
                            <th>Barcode</th>
                            <th>Description</th>
                            <th>UOM</th>
                            <th>QTY/Case</th>
                            <th>Offtake</th>
                            <th>Order QTY</th>
                            <th>Pieces</th>
                            <th>Cost/Case</th>
                            <th>Cost/Piece</th>
                            <th>Disc 1</th>
                            <th>Disc 2</th>
                            <th>Disc 3</th>
                            <th>Net Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.category || '-'}</td>
                                <td>${item.sku || '-'}</td>
                                <td>${item.barcode || '-'}</td>
                                <td>${item.itemDescription}</td>
                                <td>${item.buyingUom || '-'}</td>
                                <td>${item.qtyPerCase || '-'}</td>
                                <td>${item.offtake || '-'}</td>
                                <td>${item.orderQty || '-'}</td>
                                <td>${item.pieces || '-'}</td>
                                <td>${item.costPricePerCase || '-'}</td>
                                <td>${item.costPricePerPiece || '-'}</td>
                                <td>${item.discount1 || '-'}</td>
                                <td>${item.discount2 || '-'}</td>
                                <td>${item.discount3 || '-'}</td>
                                <td>${item.netCostAmount || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">
                    Total: ₱${formatCurrency(order.total)}
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        toast({
            title: "Export Successful",
            description: "Purchase history opened for printing/PDF export."
        });
    };

    const handleClose = () => {
        closeDialog('purchase-history');
        // Reset filters when closing
        setSearchQuery('');
        setCategoryFilter('all');
        setDateFrom(undefined);
        setDateTo(undefined);
    };

    // Get unique categories from items
    const uniqueCategories = React.useMemo(() => {
        if (!order) return [];
        const categories = new Set(
            order.items
                .map(item => item.category)
                .filter((cat): cat is string => cat !== null && cat !== '')
        );
        return Array.from(categories).sort();
    }, [order]);

    // Filter items based on search query, category, and date range
    const filteredItems = React.useMemo(() => {
        if (!order) return [];

        let items = [...order.items];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.itemDescription?.toLowerCase().includes(query) ||
                item.sku?.toLowerCase().includes(query) ||
                item.barcode?.toLowerCase().includes(query) ||
                item.category?.toLowerCase().includes(query)
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            items = items.filter(item => item.category === categoryFilter);
        }

        // Apply date range filter
        if ((dateFrom || dateTo) && order.date) {
            const orderDate = new Date(order.date);
            orderDate.setHours(0, 0, 0, 0);

            if (dateFrom) {
                const fromDate = new Date(dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                if (orderDate < fromDate) {
                    items = [];
                }
            }

            if (dateTo) {
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59, 999);
                if (orderDate > toDate) {
                    items = [];
                }
            }
        }

        return items;
    }, [order, searchQuery, categoryFilter, dateFrom, dateTo]);

    // Paginate items
    const paginatedItems = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0 sm:rounded-lg overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-background">
                    <DialogTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Purchase History
                            {order && <span className="text-sm font-normal text-muted-foreground">- {order.supplier.name}</span>}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportToCSV}
                                disabled={!order || loading}
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportToPDF}
                                disabled={!order || loading}
                                className="gap-2"
                            >
                                <FileDown className="h-4 w-4" />
                                Export PDF
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Loading purchase history...</p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-red-500 font-medium">{error}</p>
                        </div>
                    ) : order ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Left Column - Order Information */}
                                <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order Date</p>
                                        <p className="font-medium">{format(new Date(order.date), 'MMMM dd, yyyy')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Supplier</p>
                                        <p className="font-medium">{order.supplier.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Items</p>
                                        <p className="font-medium">{order.items.length}</p>
                                    </div>
                                </div>

                                {/* Right Column - Filter Controls */}
                                <div className="flex flex-col gap-3 p-4 bg-muted/30 rounded-lg border">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by description, SKU, barcode, or category..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Filter by Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {uniqueCategories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !dateFrom && !dateTo && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {dateFrom ? (
                                                        dateTo ? (
                                                            <>
                                                                {format(dateFrom, "LLL dd, y")} - {format(dateTo, "LLL dd, y")}
                                                            </>
                                                        ) : (
                                                            format(dateFrom, "LLL dd, y")
                                                        )
                                                    ) : (
                                                        <span>Pick date range</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <div className="flex">
                                                    <div className="border-r">
                                                        <div className="p-3 text-sm font-medium border-b">From Date</div>
                                                        <Calendar
                                                            mode="single"
                                                            selected={dateFrom}
                                                            onSelect={setDateFrom}
                                                            initialFocus
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="p-3 text-sm font-medium border-b">To Date</div>
                                                        <Calendar
                                                            mode="single"
                                                            selected={dateTo}
                                                            onSelect={setDateTo}
                                                            initialFocus
                                                        />
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {(searchQuery || categoryFilter !== 'all' || dateFrom || dateTo) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setCategoryFilter('all');
                                                setDateFrom(undefined);
                                                setDateTo(undefined);
                                            }}
                                            className="w-fit"
                                        >
                                            Clear Filters
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="relative overflow-auto max-h-[400px]">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="sticky top-0 z-[1] bg-muted [&_tr]:border-b">
                                            <tr className="border-b transition-colors">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-muted">Category</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-muted">SKU</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-muted">Barcode</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-muted">Description</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-muted">UOM</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">QTY/Case</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Offtake</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Order QTY</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Pieces</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Cost/Case</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Cost/Piece</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Disc 1</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Disc 2</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Disc 3</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground bg-muted">Net Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {paginatedItems.length > 0 ? (
                                                paginatedItems.map((item) => (
                                                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                                        <td className="p-4 align-middle">{item.category || '-'}</td>
                                                        <td className="p-4 align-middle">{item.sku || '-'}</td>
                                                        <td className="p-4 align-middle">{item.barcode || '-'}</td>
                                                        <td className="p-4 align-middle max-w-[200px]">{item.itemDescription}</td>
                                                        <td className="p-4 align-middle">{item.buyingUom || '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.qtyPerCase || '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.offtake || '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.orderQty || '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.pieces || '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.costPricePerCase ? `₱${formatCurrency(item.costPricePerCase)}` : '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.costPricePerPiece ? `₱${formatCurrency(item.costPricePerPiece)}` : '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.discount1 || '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.discount2 || '-'}</td>
                                                        <td className="p-4 align-middle text-right">{item.discount3 || '-'}</td>
                                                        <td className="p-4 align-middle text-right font-medium">{item.netCostAmount ? `₱${formatCurrency(item.netCostAmount)}` : '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className="border-b transition-colors">
                                                    <td colSpan={15} className="p-4 align-middle text-center py-8 text-muted-foreground">
                                                        No items match your filters. Try adjusting your search or filter criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 0 && (
                                    <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-t">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>Show</span>
                                            <Select
                                                value={itemsPerPage.toString()}
                                                onValueChange={(value) => {
                                                    setItemsPerPage(Number(value));
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <SelectTrigger className="h-8 w-[70px]">
                                                    <SelectValue placeholder={itemsPerPage} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[10, 25, 50, 100].map((size) => (
                                                        <SelectItem key={size} value={size.toString()}>
                                                            {size}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <span>entries</span>
                                            <span className="mx-2">|</span>
                                            <span>
                                                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredItems.length)} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setCurrentPage(1)}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronsLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <div className="flex items-center px-3 h-8 text-sm font-medium">
                                                Page {currentPage} of {totalPages}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setCurrentPage(totalPages)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronsRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end p-4 bg-muted/50 rounded-lg">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-2xl font-bold">₱{formatCurrency(order.total)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No purchase history available.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
