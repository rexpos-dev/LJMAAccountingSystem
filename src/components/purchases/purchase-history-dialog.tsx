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
import { FileDown, FileText, Download, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ShieldCheck, X, History, Activity, Calculator } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-context';
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
    cost?: number | null;
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
                item.costPricePerCase || item.cost || '',
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
                                <td>${item.costPricePerCase || item.cost || '-'}</td>
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
            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] flex flex-col p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl">
                <DialogHeader className="px-8 py-4 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            <History className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none text-foreground">
                                Historical Audit
                            </DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">Archive Retrieval</span>
                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{order?.supplier.name || "System Node"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <Button variant="outline" size="sm" onClick={exportToCSV} disabled={!order || loading} className="rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px] gap-2" >
                            <Download className="h-3 w-3" />
                            Export CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportToPDF} disabled={!order || loading} className="rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px] gap-2" >
                            <FileDown className="h-3 w-3" />
                            Export PDF
                        </Button>
                        <div className="w-px h-8 bg-foreground/10 mx-2" />
                        
                    </div>
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
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Column - Order Information */}
                                <div className="grid grid-cols-3 gap-6 p-8 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <FileText className="h-20 w-20 text-foreground" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Execution Date</p>
                                        <p className="text-xl font-black italic tracking-tighter text-foreground">{format(new Date(order.date), 'MMMM dd, yyyy')}</p>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Primary Entity</p>
                                        <p className="text-xl font-black italic tracking-tighter text-foreground">{order.supplier.name}</p>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Payload Units</p>
                                        <p className="text-xl font-black italic tracking-tighter text-primary">{order.items.length}</p>
                                    </div>
                                </div>

                                {/* Right Column - Filter Controls */}
                                <div className="p-8 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md space-y-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/20" />
                                        <Input placeholder="SCAN DATA STREAM (SKU, BARCODE, DESC)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-12 h-14 bg-foreground/5 border-foreground/10 text-foreground rounded-2xl font-black uppercase tracking-wider text-xs placeholder:text-foreground/10"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger className=" bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-black uppercase tracking-widest text-[10px]">
                                                <SelectValue placeholder="Category Node" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                <SelectItem value="all" className="font-black uppercase tracking-widest text-[10px]">Global Domain</SelectItem>
                                                {uniqueCategories.map((category) => (
                                                    <SelectItem key={category} value={category} className="font-black uppercase tracking-widest text-[10px]">
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className={cn( " justify-start text-left bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-black uppercase tracking-widest text-[10px]", !dateFrom && !dateTo && "text-foreground/20" )} >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                                    {dateFrom ? (
                                                        dateTo ? (
                                                            <>
                                                                {format(dateFrom, "LLL dd, y")} - {format(dateTo, "LLL dd, y")}
                                                            </>
                                                        ) : (
                                                            format(dateFrom, "LLL dd, y")
                                                        )
                                                    ) : (
                                                        <span>Time Horizon Range</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-card border-foreground/10" align="start">
                                                <div className="flex">
                                                    <div className="border-r border-foreground/5">
                                                        <div className="p-3 text-[10px] font-black uppercase tracking-widest border-b border-foreground/5 text-foreground/40">Horizon Start</div>
                                                        <Calendar
                                                            mode="single"
                                                            selected={dateFrom}
                                                            onSelect={setDateFrom}
                                                            initialFocus
                                                            className="rounded-none border-0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="p-3 text-[10px] font-black uppercase tracking-widest border-b border-foreground/5 text-foreground/40">Horizon End</div>
                                                        <Calendar
                                                            mode="single"
                                                            selected={dateTo}
                                                            onSelect={setDateTo}
                                                            initialFocus
                                                            className="rounded-none border-0"
                                                        />
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-foreground/5 border border-foreground/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                                <div className="relative overflow-auto max-h-[400px]">
                                    <table className="w-full text-left text-sm">
                                        <thead className="sticky top-0 z-[1] bg-foreground/5 border-b border-foreground/10">
                                            <tr>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Category</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">SKU</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Barcode</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">Description</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">UOM</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">QTY/Case</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Offtake</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Order QTY</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Pieces</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Cost/Case</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Cost/Piece</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Disc 1</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Disc 2</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Disc 3</th>
                                                <th className="h-12 px-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Net Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {paginatedItems.length > 0 ? (
                                                paginatedItems.map((item) => (
                                                    <tr key={item.id} className="hover:bg-foreground/[0.02] transition-colors group">
                                                        <td className="text-[10px] font-black uppercase text-foreground/40">{item.category || '-'}</td>
                                                        <td className="font-mono text-[10px] text-foreground/60">{item.sku || '-'}</td>
                                                        <td className="font-mono text-[10px] text-foreground/60">{item.barcode || '-'}</td>
                                                        <td className="text-[11px] font-bold text-foreground uppercase tracking-tight">{item.itemDescription}</td>
                                                        <td className="text-[10px] font-black uppercase text-foreground/40">{item.buyingUom || '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{item.qtyPerCase || '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{item.offtake || '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{item.orderQty || '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{item.pieces || '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{(item.costPricePerCase || item.cost) ? `₱${formatCurrency(item.costPricePerCase || (item.cost ?? 0))}` : '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{item.costPricePerPiece ? `₱${formatCurrency(item.costPricePerPiece)}` : '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{item.discount1 || '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{item.discount2 || '-'}</td>
                                                        <td className="text-right text-xs text-foreground/60">{item.discount3 || '-'}</td>
                                                        <td className="text-right text-sm font-black italic text-primary">
                                                            {item.netCostAmount ? `₱${formatCurrency(item.netCostAmount)}` : '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={15} className="text-center">
                                                        <div className="flex flex-col items-center justify-center text-foreground/10 gap-2">
                                                            <Activity className="h-12 w-12 opacity-10" />
                                                            <p className="text-[10px] font-black uppercase tracking-widest">No matching telemetry found</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 0 && (
                                    <div className="flex items-center justify-between px-8 py-4 bg-foreground/5 border-t border-foreground/10">
                                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                            <span>Telemetry Display</span>
                                            <Select
                                                value={itemsPerPage.toString()}
                                                onValueChange={(value) => {
                                                    setItemsPerPage(Number(value));
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <SelectTrigger className="h-8 w-[70px] bg-foreground/5 border-foreground/10 text-foreground rounded-lg">
                                                    <SelectValue placeholder={itemsPerPage} />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                    {[10, 25, 50, 100].map((size) => (
                                                        <SelectItem key={size} value={size.toString()} className="text-[10px] font-black uppercase">
                                                            {size}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <span className="text-foreground/20">|</span>
                                            <span>
                                                Node {Math.min((currentPage - 1) * itemsPerPage + 1, filteredItems.length)} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button variant="outline" size="icon" className="w-8 rounded-lg border-foreground/10 hover:bg-foreground/5 text-foreground/40" onClick={() => setCurrentPage(1)}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronsLeft className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="w-8 rounded-lg border-foreground/10 hover:bg-foreground/5 text-foreground/40" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <div className="flex items-center px-4 h-8 text-[10px] font-black uppercase text-foreground tracking-widest">
                                                Page {currentPage} / {totalPages}
                                            </div>
                                            <Button variant="outline" size="icon" className="w-8 rounded-lg border-foreground/10 hover:bg-foreground/5 text-foreground/40" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="w-8 rounded-lg border-foreground/10 hover:bg-foreground/5 text-foreground/40" onClick={() => setCurrentPage(totalPages)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronsRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end p-8 bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Calculator className="h-16 w-16 text-primary" />
                                </div>
                                <div className="text-right relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Total Fiscal Impact</p>
                                    <p className="text-4xl font-black italic tracking-tighter text-primary">₱{formatCurrency(order.total)}</p>
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
