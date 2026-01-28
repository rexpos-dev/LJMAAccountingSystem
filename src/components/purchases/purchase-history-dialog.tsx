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
import { FileDown, FileText, Download } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

    const isOpen = openDialogs['purchase-history'];
    const data = getDialogData('purchase-history');

    useEffect(() => {
        if (isOpen && data?.orderId) {
            fetchPurchaseOrder(data.orderId);
        }
    }, [isOpen, data]);

    const fetchPurchaseOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/purchase-orders/${orderId}`);
            if (!response.ok) throw new Error('Failed to fetch purchase order');

            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error('Error fetching purchase order:', error);
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
                    Total: ₱${order.total.toFixed(2)}
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
    };

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
                    ) : order ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
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

                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Category</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Barcode</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>UOM</TableHead>
                                            <TableHead className="text-right">QTY/Case</TableHead>
                                            <TableHead className="text-right">Offtake</TableHead>
                                            <TableHead className="text-right">Order QTY</TableHead>
                                            <TableHead className="text-right">Pieces</TableHead>
                                            <TableHead className="text-right">Cost/Case</TableHead>
                                            <TableHead className="text-right">Cost/Piece</TableHead>
                                            <TableHead className="text-right">Disc 1</TableHead>
                                            <TableHead className="text-right">Disc 2</TableHead>
                                            <TableHead className="text-right">Disc 3</TableHead>
                                            <TableHead className="text-right">Net Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.category || '-'}</TableCell>
                                                <TableCell>{item.sku || '-'}</TableCell>
                                                <TableCell>{item.barcode || '-'}</TableCell>
                                                <TableCell className="max-w-[200px]">{item.itemDescription}</TableCell>
                                                <TableCell>{item.buyingUom || '-'}</TableCell>
                                                <TableCell className="text-right">{item.qtyPerCase || '-'}</TableCell>
                                                <TableCell className="text-right">{item.offtake || '-'}</TableCell>
                                                <TableCell className="text-right">{item.orderQty || '-'}</TableCell>
                                                <TableCell className="text-right">{item.pieces || '-'}</TableCell>
                                                <TableCell className="text-right">{item.costPricePerCase ? `₱${item.costPricePerCase.toFixed(2)}` : '-'}</TableCell>
                                                <TableCell className="text-right">{item.costPricePerPiece ? `₱${item.costPricePerPiece.toFixed(2)}` : '-'}</TableCell>
                                                <TableCell className="text-right">{item.discount1 || '-'}</TableCell>
                                                <TableCell className="text-right">{item.discount2 || '-'}</TableCell>
                                                <TableCell className="text-right">{item.discount3 || '-'}</TableCell>
                                                <TableCell className="text-right font-medium">{item.netCostAmount ? `₱${item.netCostAmount.toFixed(2)}` : '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-end p-4 bg-muted/50 rounded-lg">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-2xl font-bold">₱{order.total.toFixed(2)}</p>
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
