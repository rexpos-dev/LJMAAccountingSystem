"use client";

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { X, Printer } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists

interface PurchaseOrderItem {
    id: string;
    product: {
        barcode: string;
        name: string;
    } | null;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    total: number;
    barcode?: string;
    buyingUom?: string;
    qtyPerCase?: number;
    orderQty?: number;
    costPricePerCase?: number;
    costPricePerPiece?: number;
}

interface PurchaseOrder {
    id: string;
    date: string;
    supplier: {
        name: string;
        address?: string;
        paymentTerms?: string;
    };
    vendorAddress?: string;
    shippingAddress?: string;
    paymentTerms?: string;
    items: PurchaseOrderItem[];
    subtotal: number;
    taxTotal: number;
    total: number;
    orderNumber?: string; // If available
    comments?: string;
}

interface BusinessProfile {
    businessName: string;
    address?: string;
    contactPhone?: string;
    email?: string;
    bankDetails?: string;
}

export default function ViewPurchaseOrderDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const [order, setOrder] = useState<PurchaseOrder | null>(null);
    const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const dialogData = getDialogData('view-purchase-order');
    const orderId = dialogData?.orderId;

    useEffect(() => {
        if (openDialogs['view-purchase-order'] && orderId) {
            fetchOrder(orderId);
            fetchBusinessProfile();
        } else {
            setOrder(null);
        }
    }, [openDialogs['view-purchase-order'], orderId]);

    const fetchOrder = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/purchase-orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                toast({ title: "Order not found", variant: "destructive" });
            }
        } catch (error) {
            console.error('Failed to fetch order', error);
            toast({ title: "Failed to load order", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessProfile = async () => {
        try {
            const res = await fetch('/api/business-profile');
            if (res.ok) {
                const data = await res.json();
                setBusinessProfile(data);
            }
        } catch (error) {
            console.error('Failed to fetch business profile', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!openDialogs['view-purchase-order']) return null;

    return (
        <Dialog open={openDialogs['view-purchase-order']} onOpenChange={() => closeDialog('view-purchase-order')}>
            <DialogContent className="max-w-[1200px] h-screen sm:h-auto max-h-[95vh] flex flex-col p-0 overflow-hidden sm:rounded-lg">

                {/* Header / Title Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-background print:hidden">
                    <DialogTitle>Purchase order details</DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => closeDialog('view-purchase-order')}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-12 bg-background text-foreground text-sm" id="printable-content">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">Loading details...</div>
                    ) : order ? (
                        <div className="space-y-8">

                            {/* Top Header Section */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-xl font-bold uppercase tracking-wide">{businessProfile?.businessName || "GAUDENCIOS LUGAWAN"}</h1>
                                    <div className="text-muted-foreground mt-1">
                                        <p>{businessProfile?.address || "TAGUM CITY"}</p>
                                        <p>Phone: {businessProfile?.contactPhone || ""}</p>
                                        <p>Email: {businessProfile?.email || "pos@nenapps.com"}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h1 className="text-3xl font-bold text-muted-foreground/30 uppercase tracking-widest mb-4">PURCHASE ORDER</h1>
                                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-right text-sm">
                                        <span className="text-muted-foreground">Issue Date</span>
                                        <span>{format(new Date(order.date), 'MMMM d, yyyy')}</span>

                                        <span className="text-muted-foreground">Delivery Date</span>
                                        <span>{format(new Date(new Date(order.date).setDate(new Date(order.date).getDate() + 1)), 'MMMM d, yyyy')}</span> {/* Mock Delivery +1 Day */}

                                        <span className="text-muted-foreground">Reference No.</span>
                                        <span>{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Addresses */}
                            <div className="grid grid-cols-2 gap-12 mt-8">
                                <div>
                                    <h3 className="text-muted-foreground mb-1">Order To</h3>
                                    <div className="font-semibold uppercase">{order.supplier.name}</div>
                                    <div className="text-muted-foreground whitespace-pre-wrap uppercase">
                                        {order.vendorAddress || order.supplier.address || "DAVAO CITY"}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-muted-foreground mb-1">Deliver To</h3>
                                    <div className="font-semibold uppercase">{businessProfile?.businessName || "GAUDENCIOS LUGAWAN"}</div>
                                    <div className="text-muted-foreground whitespace-pre-wrap uppercase">
                                        {businessProfile?.address || "TAGUM CITY"}
                                    </div>
                                </div>
                            </div>

                            {/* Notes / Terms */}
                            <div className="mt-8">
                                <span className="underline">Payment Terms: {order.supplier.paymentTerms || "CASH"}</span>
                            </div>

                            {/* Items Table - Custom Styled to match image */}
                            <div className="mt-4 border rounded-none overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="px-3 py-2 font-medium border-r w-[12%] text-xs uppercase tracking-wider">Barcode</th>
                                            <th className="px-3 py-2 font-medium border-r w-[43%] text-xs uppercase tracking-wider">Name</th>
                                            <th className="px-2 py-2 font-medium border-r text-right w-[5%] text-[10px] uppercase">QTY/Case</th>
                                            <th className="px-3 py-2 font-medium border-r text-right w-[7%] text-[10px] uppercase">Order QTY</th>
                                            <th className="px-3 py-2 font-medium border-r text-right w-[9%] text-[10px] uppercase">Cost/Case</th>
                                            <th className="px-3 py-2 font-medium border-r text-right w-[9%] text-[10px] uppercase">Cost/Piece</th>
                                            <th className="px-3 py-2 font-medium border-r text-right w-[5%] text-[10px] uppercase">UOM</th>
                                            <th className="px-4 py-2 font-medium text-right w-[10%] text-xs uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {order.items.map((item, idx) => (
                                            <tr key={item.id || idx}>
                                                <td className="px-3 py-2 border-r align-top text-[10px] break-all">{item.barcode || item.product?.barcode || "N/A"}</td>
                                                <td className="px-3 py-2 border-r align-top text-xs font-medium">{item.itemDescription}</td>
                                                <td className="px-2 py-2 border-r align-top text-right text-xs">{item.qtyPerCase || 1}</td>
                                                <td className="px-2 py-2 border-r align-top text-right text-xs font-semibold">{item.orderQty || item.quantity}</td>
                                                <td className="px-3 py-2 border-r align-top text-right text-xs">{(item.costPricePerCase || (item.unitPrice * (item.qtyPerCase || 1))).toFixed(2)}</td>
                                                <td className="px-3 py-2 border-r align-top text-right text-xs">{(item.costPricePerPiece || item.unitPrice).toFixed(2)}</td>
                                                <td className="px-3 py-2 border-r align-top text-right text-xs text-muted-foreground">{item.buyingUom || "pc"}</td>
                                                <td className="px-4 py-2 align-top text-right text-xs font-bold">{item.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        {/* Filler rows to match height if needed, or min-height on tbody */}
                                        {Array.from({ length: Math.max(0, 5 - order.items.length) }).map((_, i) => (
                                            <tr key={`filler-${i}`}>
                                                <td className="px-4 py-4 border-r">&nbsp;</td>
                                                <td className="px-4 py-4 border-r">&nbsp;</td>
                                                <td className="px-4 py-4 border-r">&nbsp;</td>
                                                <td className="px-4 py-4 border-r">&nbsp;</td>
                                                <td className="px-4 py-4 border-r">&nbsp;</td>
                                                <td className="px-4 py-4 border-r">&nbsp;</td>
                                                <td className="px-4 py-4 border-r">&nbsp;</td>
                                                <td className="px-4 py-4">&nbsp;</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t">
                                        <tr>
                                            <td colSpan={6} rowSpan={4} className="border-r border-b text-xs p-4 align-top text-muted-foreground italic">
                                                {order.comments && (
                                                    <div className="mb-2">
                                                        <span className="font-semibold block not-italic uppercase text-[10px] mb-1">Remarks:</span>
                                                        {order.comments}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-1 border-r text-right text-muted-foreground border-b text-xs">Shipping</td>
                                            <td className="px-4 py-1 text-right border-b font-medium">0.00</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-1 border-r text-right text-muted-foreground border-b text-xs">Vat included</td>
                                            <td className="px-4 py-1 text-right border-b font-medium">{order.taxTotal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-1 border-r text-right text-muted-foreground border-b text-xs">Discount</td>
                                            <td className="px-4 py-1 text-right border-b font-medium">0.00</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 border-r text-right font-bold text-foreground bg-muted/50 border-b">Grand total</td>
                                            <td className="px-4 py-2 text-right font-bold bg-muted/50 border-b">{order.total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Footer Signature */}
                            <div className="mt-12 mb-8 pt-8">
                                <div className="text-sm uppercase mb-12">
                                    {businessProfile?.bankDetails || "CASH DEPOSIT / PAYMENT"}
                                </div>
                                <div className="flex justify-end items-end gap-2">
                                    <span className="mb-1 text-sm text-muted-foreground">Authorized by:</span>
                                    <div className="w-64 border-b border-muted-foreground/50"></div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            Failed to load order details.
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t p-4 flex justify-between items-center bg-background print:hidden">
                    <div className="flex-1"></div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                        <Button variant="outline" onClick={() => closeDialog('view-purchase-order')}>
                            Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
