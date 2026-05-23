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
import { useDialog } from '@/components/layout/dialog-context';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { X, Printer, FileText, ShieldCheck } from 'lucide-react';
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
    cost?: number;
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
            <DialogContent className="max-w-[1200px] h-[95vh] flex flex-col p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl">

                <DialogHeader className="px-8 py-4 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0 print:hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none text-foreground">
                                Procurement Audit
                            </DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">System Payload</span>
                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Operational Intelligence</span>
                            </div>
                        </div>
                    </div>

                    
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-card/50 p-4 md:p-12 custom-scrollbar relative print:bg-white print:p-0">
                    {/* Thematic Background Pattern - Screen Only */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none print:hidden" 
                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
                    />

                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-full gap-4 text-foreground/20">
                            <div className="h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest italic">Decrypting Payload...</span>
                        </div>
                    ) : order ? (
                        <div className="relative mx-auto max-w-[850px] bg-white text-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm print:shadow-none print:rounded-none print:max-w-none" id="printable-content">
                            <div className="p-8 md:p-16 space-y-10 print:p-0">
                                {/* Top Header Section */}
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">{businessProfile?.businessName || "GAUDENCIOS LUGAWAN"}</h1>
                                            <div className="h-1 w-12 bg-background" />
                                        </div>
                                        <div className="text-[11px] font-bold text-slate-500 space-y-0.5 uppercase tracking-wide">
                                            <p>{businessProfile?.address || "TAGUM CITY, DAVAO DEL NORTE"}</p>
                                            <p>COMMUNICATION: {businessProfile?.contactPhone || "NOT REGISTERED"}</p>
                                            <p>DIGITAL: {businessProfile?.email || "pos@nenapps.com"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="text-[10px] font-black bg-background text-foreground px-3 py-1 mb-6 tracking-[0.3em] uppercase italic">
                                            Purchase Order
                                        </div>
                                        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-right">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Date</span>
                                            <span className="text-xs font-bold">{format(new Date(order.date), 'MMMM d, yyyy')}</span>

                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment</span>
                                            <span className="text-xs font-bold">{format(new Date(new Date(order.date).setDate(new Date(order.date).getDate() + 1)), 'MMMM d, yyyy')}</span>

                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Control No.</span>
                                            <span className="text-xs font-black font-mono">#{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Addresses */}
                                <div className="grid grid-cols-2 gap-16 pt-8 border-t border-slate-100">
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recipient Vendor</h3>
                                        <div className="space-y-1">
                                            <div className="font-black text-sm uppercase italic">{order.supplier.name}</div>
                                            <div className="text-[11px] font-bold text-slate-500 whitespace-pre-wrap uppercase leading-relaxed">
                                                {order.vendorAddress || order.supplier.address || "DAVAO CITY"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deployment Point</h3>
                                        <div className="space-y-1">
                                            <div className="font-black text-sm uppercase italic">{businessProfile?.businessName || "GAUDENCIOS LUGAWAN"}</div>
                                            <div className="text-[11px] font-bold text-slate-500 whitespace-pre-wrap uppercase leading-relaxed">
                                                {businessProfile?.address || "TAGUM CITY"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes / Terms */}
                                <div className="bg-slate-50 p-4 border-l-4 border-slate-950 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                                        <span className="text-xs font-black uppercase italic">{order.supplier.paymentTerms || "Standard Net 30"}</span>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase italic">Reference: Ledger Phase 1</div>
                                </div>

                                {/* Items Table */}
                                <div className="mt-8 border border-slate-200">
                                    <table className="w-full text-left text-[11px]">
                                        <thead className="bg-background text-foreground">
                                            <tr>
                                                <th className="px-3 font-black uppercase tracking-widest border-r border-foreground/10 w-[15%]">Identifier</th>
                                                <th className="px-3 font-black uppercase tracking-widest border-r border-foreground/10 w-[40%]">Designation</th>
                                                <th className="px-2 font-black uppercase tracking-widest border-r border-foreground/10 text-right w-[10%]">Quantum</th>
                                                <th className="px-3 font-black uppercase tracking-widest border-r border-foreground/10 text-right w-[12%]">Cost/Unit</th>
                                                <th className="px-3 font-black uppercase tracking-widest border-r border-foreground/10 text-center w-[10%]">UOM</th>
                                                <th className="px-4 font-black uppercase tracking-widest text-right w-[13%]">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {order.items.map((item, idx) => (
                                                <tr key={item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-3 border-r border-slate-100 font-mono text-[10px] text-slate-400">{item.barcode || item.product?.barcode || "NON-EXT"}</td>
                                                    <td className="px-3 border-r border-slate-100 font-black uppercase text-slate-800">{item.itemDescription}</td>
                                                    <td className="px-3 border-r border-slate-100 text-right font-bold">{item.orderQty || item.quantity}</td>
                                                    <td className="px-3 border-r border-slate-100 text-right font-bold text-slate-600">{(item.costPricePerPiece || item.unitPrice).toFixed(2)}</td>
                                                    <td className="px-3 border-r border-slate-100 text-center font-bold text-slate-400 uppercase">{item.buyingUom || "pc"}</td>
                                                    <td className="px-4 text-right font-black text-slate-950 italic">₱{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                </tr>
                                            ))}
                                            {/* Filler rows for aesthetic balance */}
                                            {Array.from({ length: Math.max(0, 3 - order.items.length) }).map((_, i) => (
                                                <tr key={`filler-${i}`}>
                                                    <td className="px-4 border-r border-slate-100">&nbsp;</td>
                                                    <td className="px-4 border-r border-slate-100">&nbsp;</td>
                                                    <td className="px-4 border-r border-slate-100">&nbsp;</td>
                                                    <td className="px-4 border-r border-slate-100">&nbsp;</td>
                                                    <td className="px-4 border-r border-slate-100">&nbsp;</td>
                                                    <td className="px-4">&nbsp;</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="border-t-2 border-slate-950">
                                            <tr className="bg-slate-50">
                                                <td colSpan={4} className="align-top border-r border-slate-200">
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Authorization Notes</span>
                                                            <div className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed italic max-w-[400px]">
                                                                {order.comments || "THIS IS A COMPUTER-GENERATED PAYLOAD. PHYSICAL SIGNATURE MAY BE REQUIRED BY EXTERNAL ENTITIES FOR COMPLETE PROTOCOL VALIDATION."}
                                                            </div>
                                                        </div>
                                                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                                                            // SYSTEM_AUTH_HASH: {order.id.toUpperCase()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td colSpan={2} className="align-top">
                                                    <div className="grid grid-cols-2 text-[10px] font-black uppercase tracking-widest">
                                                        <div className="px-4 py-3 border-b border-r border-slate-200 text-slate-400">Subtotal</div>
                                                        <div className="px-4 py-3 border-b border-slate-200 text-right font-bold text-slate-600">₱{order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                        
                                                        <div className="px-4 py-3 border-b border-r border-slate-200 text-slate-400 italic">VAT Base</div>
                                                        <div className="px-4 py-3 border-b border-slate-200 text-right font-bold text-slate-600">₱{order.taxTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                        
                                                        <div className="px-4 py-3 border-r border-slate-200 text-slate-400">Logistics</div>
                                                        <div className="px-4 py-3 text-right font-bold text-slate-600">₱0.00</div>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-background text-foreground p-4">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Total Payload</span>
                                                        <span className="text-xl font-black italic tracking-tighter">₱{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Footer Signature */}
                                <div className="mt-16 pt-12 flex justify-between items-end">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Financial Channel</div>
                                        <div className="text-xs font-black uppercase italic text-slate-700">
                                            {businessProfile?.bankDetails || "SETTLEMENT VIA CORPORATE CHECK / DEPOSIT"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="w-64 border-b-2 border-slate-950"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Intelligence Representative</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-foreground/10">
                            <X className="h-12 w-12" />
                            <p className="text-xs font-black uppercase tracking-widest">Data Stream Terminated</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0 print:hidden">

                    <div className="flex items-center gap-2 text-foreground/20">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Audit Trail Synchronized</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => closeDialog('view-purchase-order')}
                            className="px-6 h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-xs"
                        >
                            Dismiss
                        </Button>
                        <Button onClick={handlePrint} className="px-8 rounded-xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all gap-2" >
                            <Printer className="h-4 w-4" />
                            Print Payload
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
