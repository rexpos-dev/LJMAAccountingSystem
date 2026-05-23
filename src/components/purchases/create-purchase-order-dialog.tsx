'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
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
import { useDialog } from '@/components/layout/dialog-context';
import { CalendarIcon, Plus, Trash2, Users, Pencil, HelpCircle, X, Search, Check, Save, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PurchaseOrderItem {
    id: string;
    qty: number;
    item: string;
    unitPrice: number;
    total: number;
    barcode?: string;
    productId?: string;
    uom: string;
    qtyPerCase?: number;
    orderQty?: number;
    costPricePerCase?: number;
    costPricePerPiece?: number;
    cost?: number;
}

const ProductSearch = ({ value, onSelect }: { value: string, onSelect: (product: any) => void }) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && allProducts.length === 0) {
            fetchInitialProducts();
        }
    }, [open]);

    const fetchInitialProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/external-products?limit=1000`);
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setAllProducts(data.data || []);
                    setProducts(data.data || []);
                } else {
                    setError('Unable to fetch external inventory');
                }
            } else {
                setError('Inventory API error');
            }
        } catch (error) {
            console.error(error);
            setError('Connection failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setProducts(allProducts);
            return;
        }

        const filtered = allProducts.filter(p =>
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filtered);
    }, [searchTerm, allProducts]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full group">
                    <Input placeholder="Search Intelligence Matrix..." value={searchTerm} onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (!open) setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        className="h-11 pl-11 pr-4 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/20 rounded-xl transition-all shadow-xl focus-visible:ring-primary/50 focus-visible:bg-foreground/10 group-hover:border-foreground/20"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40 group-hover:text-primary transition-colors pointer-events-none" />
                </div>
            </PopoverTrigger>
            <PopoverContent 
                className="w-[450px] p-0 bg-background/95 border-foreground/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden" 
                align="start" 
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="p-2 border-b border-foreground/5 bg-foreground/5">
                    <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Inventory Stream</span>
                        <span className="text-[10px] font-bold text-primary/60">{products.length} Node{products.length !== 1 ? 's' : ''} Online</span>
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {loading && (
                        <div className="p-12 flex flex-col items-center justify-center gap-4">
                            <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 animate-pulse">Scanning Grid...</span>
                        </div>
                    )}
                    
                    {error && (
                        <div className="p-8 text-center">
                            <div className="inline-flex p-3 rounded-xl bg-destructive/10 text-destructive mb-3">
                                <HelpCircle className="h-5 w-5" />
                            </div>
                            <div className="text-sm font-bold text-foreground uppercase mb-1">Signal Interrupted</div>
                            <div className="text-xs text-foreground/40">{error}</div>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="inline-flex p-3 rounded-xl bg-foreground/5 text-foreground/20 mb-3">
                                <Search className="h-5 w-5" />
                            </div>
                            <div className="text-sm font-bold text-foreground uppercase mb-1">Null Results</div>
                            <div className="text-xs text-foreground/40">No matching signatures found in the matrix.</div>
                        </div>
                    )}

                    {!loading && products.map((product) => (
                        <div
                            key={product.id}
                            className="p-4 text-sm hover:bg-foreground/5 cursor-pointer transition-all border-b border-foreground/5 last:border-0 group/item"
                            onClick={() => {
                                onSelect(product);
                                setOpen(false);
                                setSearchTerm('');
                            }}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <div className="font-bold text-foreground group-hover/item:text-primary transition-colors uppercase tracking-tight">{product.name}</div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest bg-foreground/5 px-2 py-0.5 rounded-md border border-foreground/5 group-hover/item:text-foreground/40 transition-colors">
                                            {product.sku || 'NO-SKU'}
                                        </span>
                                        {product.barcode && (
                                            <span className="text-[10px] font-bold text-foreground/40 font-mono tracking-tighter italic">
                                                // {product.barcode}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    {product.cost && (
                                        <div className="text-sm font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                                            ₱{parseFloat(product.cost.toString()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    )}
                                    <div className="text-[9px] font-bold text-foreground/20 uppercase tracking-tighter mt-1 group-hover/item:text-primary/40 transition-colors">Unit Value</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-3 border-t border-foreground/5 bg-foreground/5 text-center">
                    <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest italic tracking-[0.2em]">Select node to mount into payload</span>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default function CreatePurchaseOrderDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData, getDialogData } = useDialog();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const { toast } = useToast();

    // Form State
    const [supplierId, setSupplierId] = useState('');
    const [vendorAddress, setVendorAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [depositAccount, setDepositAccount] = useState('');
    const [liabilityAccounts, setLiabilityAccounts] = useState<any[]>([]);

    const [items, setItems] = useState<PurchaseOrderItem[]>([]);
    const [comments, setComments] = useState('');
    const [privateComments, setPrivateComments] = useState('');
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editOrderId, setEditOrderId] = useState<string | null>(null);
    const [customUomRows, setCustomUomRows] = useState<Record<string, boolean>>({});

    const resetForm = () => {
        setSupplierId('');
        setVendorAddress('');
        setShippingAddress('');
        setDepositAccount('');

        setItems([]);
        setComments('');
        setPrivateComments('');
        setDate(new Date());
        setMode('create');
        setEditOrderId(null);
    };

    const handleClose = () => {
        closeDialog('create-purchase-order');
        resetForm();
    };

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('/api/suppliers');
            if (res.ok) {
                const data = await res.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error('Failed to fetch suppliers', error);
        }
    };

    const fetchLiabilityAccounts = async () => {
        try {
            const res = await fetch('/api/accounts');
            if (res.ok) {
                const data = await res.json();
                const liabilities = data.filter((acc: any) =>
                    acc.account_type?.toLowerCase().includes('liability') ||
                    acc.header?.toLowerCase().includes('liability') ||
                    acc.account_category?.toLowerCase().includes('liability')
                );
                setLiabilityAccounts(liabilities);
            }
        } catch (error) {
            console.error('Failed to fetch liability accounts', error);
        }
    };

    const fetchOrderDetails = async (id: string) => {
        try {
            const res = await fetch(`/api/purchase-orders/${id}`);
            if (res.ok) {
                const order = await res.json();
                if (order) {
                    setSupplierId(order.supplierId);
                    // Trigger address update based on supplier if needed, but order might have custom address
                    // We should trust the order's stored address if available
                    setVendorAddress(order.vendorAddress || '');
                    setShippingAddress(order.shippingAddress || '');
                    setDate(new Date(order.date));
                    setComments(order.comments || '');
                    setPrivateComments(order.privateComments || '');
                    setDepositAccount(order.depositAccount || '');

                    // Map items
                    const mappedItems = order.items.map((item: any) => ({
                        id: item.id,
                        qty: item.quantity,
                        item: item.product?.name || item.itemDescription || 'Unknown Item',
                        barcode: item.product?.barcode || item.barcode || '',
                        productId: item.productId, // Important for tracking
                        qtyPerCase: item.qtyPerCase || 1,
                        orderQty: item.orderQty || item.quantity || 0,
                        costPricePerCase: item.costPricePerCase || item.cost || (item.unitPrice * (item.qtyPerCase || 1)) || 0,
                        costPricePerPiece: item.costPricePerPiece || item.unitPrice || 0,
                        unitPrice: item.unitPrice || item.costPricePerPiece || 0,
                        cost: item.cost || item.costPricePerCase || 0
                    }));
                    setItems(mappedItems);
                } else {
                    toast({ title: 'Error', description: 'Order not found', variant: 'destructive' });
                    handleClose();
                }
            }
        } catch (error) {
            console.error('Failed to fetch order details', error);
            handleClose();
        }
    };

    useEffect(() => {
        if (openDialogs['create-purchase-order']) {
            fetchSuppliers();
            fetchLiabilityAccounts();
            const data = getDialogData('create-purchase-order');
            if (data?.mode === 'edit' && data?.orderId) {
                setMode('edit');
                setEditOrderId(data.orderId);
                fetchOrderDetails(data.orderId);
            } else {
                // Reset form for create mode
                resetForm();
            }
        }
    }, [openDialogs['create-purchase-order']]);


    const handleSupplierChange = (id: string) => {
        setSupplierId(id);
        const selected = suppliers.find(s => s.id === id);
        if (selected) {
            setVendorAddress(selected.address || '');
            // Could also set payment terms logic here if applicable
        }
    };

    const handleManageSuppliers = () => {
        openDialog('supplier-list');
    };

    const handleEditSupplier = () => {
        if (!supplierId) return;
        const selected = suppliers.find(s => s.id === supplierId);
        if (selected) {
            setDialogData('add-supplier', { mode: 'edit', supplier: selected });
            openDialog('add-supplier');
        }
    };

    // Refresh suppliers when list dialog closes (optional, but good UX if they added one)
    useEffect(() => {
        if (!openDialogs['supplier-list'] && openDialogs['create-purchase-order']) {
            fetchSuppliers();
        }
    }, [openDialogs['supplier-list']]);


    // Values calculation
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const taxAmount = 0; // Placeholder for tax calculation logic
    const total = subtotal + taxAmount;

    const handleProductSelect = (product: any) => {
        // Robust cost detection from external/internal data
        const rawCost = product.cost ?? product.costPrice ?? product.cost_price ?? product.unitPrice ?? product.price ?? 0;
        const costVal = typeof rawCost === 'string' ? parseFloat(rawCost.replace(/,/g, '')) : (typeof rawCost === 'number' ? rawCost : 0);

        const newItem: PurchaseOrderItem = {
            id: Math.random().toString(36).substr(2, 9),
            qty: 1,
            item: product.name,
            uom: 'pc', // Default to 'pc' as it's a standard unit in the new dropdown
            barcode: product.barcode || '',
            productId: product.id,
            qtyPerCase: 1,
            orderQty: 1,
            costPricePerCase: costVal,
            costPricePerPiece: costVal,
            cost: costVal,
            unitPrice: costVal,
            total: costVal
        };
        setItems([...items, newItem]);
    };

    const handleRemoveItem = () => {
        // Logic to remove selected item(s). For now, removing the last one or implementing selection state.
        // Simplified: remove last item if exists
        if (items.length > 0) {
            setItems(items.slice(0, -1));
        }
    };

    const updateItem = (id: string, field: keyof PurchaseOrderItem, value: any) => {
        setItems(items.map(item => {
            if (item.id !== id) return item;

            const updatedItem = { ...item, [field]: value };

            // Recalculate based on changed fields
            if (field === 'qtyPerCase' || field === 'costPricePerCase' || field === 'costPricePerPiece' || field === 'orderQty') {
                const qtyPerCase = parseFloat(updatedItem.qtyPerCase?.toString() || '1') || 1;
                const costPricePerCase = parseFloat(updatedItem.costPricePerCase?.toString() || '0') || 0;
                const orderQty = parseFloat(updatedItem.orderQty?.toString() || '0') || 0;

                if (field === 'costPricePerPiece') {
                    updatedItem.unitPrice = value;
                    // If piece cost changed, update case cost as well
                    updatedItem.costPricePerCase = value * qtyPerCase;
                } else if (field === 'costPricePerCase') {
                    updatedItem.costPricePerPiece = costPricePerCase / qtyPerCase;
                    updatedItem.unitPrice = updatedItem.costPricePerPiece;
                } else {
                    // qtyPerCase or orderQty changed
                    updatedItem.costPricePerPiece = costPricePerCase / qtyPerCase;
                    updatedItem.unitPrice = updatedItem.costPricePerPiece;
                }
                updatedItem.qty = orderQty * qtyPerCase;
            }

            return updatedItem;
        }));
    };



    const handleSave = async () => {
        if (!supplierId) {
            toast({ title: 'Validation Error', description: 'Please select a supplier.', variant: 'destructive' });
            return;
        }
        if (!depositAccount) {
            toast({ title: 'Validation Error', description: 'Please select a deposit account.', variant: 'destructive' });
            return;
        }
        if (items.length === 0) {
            toast({ title: 'Validation Error', description: 'Please add at least one item.', variant: 'destructive' });
            return;
        }

        setSaving(true);
        try {
            const payload = {
                id: editOrderId, // Include ID for update
                supplierId,
                date: date,
                vendorAddress,
                shippingAddress,
                depositAccount,

                comments,
                privateComments,
                items,
                subtotal,
                taxTotal: taxAmount,
                total,
                status: mode === 'edit' ? undefined : 'Open' // Don't reset status on edit unless intended
            };

            const method = mode === 'edit' ? 'PUT' : 'POST';
            const res = await fetch('/api/purchase-orders', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const savedOrder = await res.json();
                toast({ title: 'Success', description: `Purchase Order ${mode === 'edit' ? 'updated' : 'created'} successfully.` });

                // Close create/edit dialog
                handleClose();

                // Automatically open preview/details dialog
                setTimeout(() => {
                    setDialogData('view-purchase-order', { orderId: savedOrder.id });
                    openDialog('view-purchase-order');
                }, 100);
            } else {
                const data = await res.json();
                toast({ title: 'Error', description: data.error || 'Failed to save order.', variant: 'destructive' });
            }
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
        } finally {
            setSaving(false);
        }
    };
    return (
        <Dialog open={openDialogs['create-purchase-order']} onOpenChange={handleClose}>
            <DialogContent className="max-w-[95vw] w-[1400px] h-[95vh] flex flex-col p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl">
                {/* Premium Header */}
                <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-400/20 text-blue-400 border border-blue-400/20 shadow-[0_0_20px_rgba(96,165,250,0.2)]">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none text-foreground">
                                {mode === 'edit' ? 'Order Modification' : 'Procurement Protocol'}
                            </DialogTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-400/20 text-blue-400 border border-blue-400/20">Supply Acquisition</span>
                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Global Resource Network</span>
                            </div>
                        </div>
                    </div>

                    
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Top Form Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column: Vendor Intelligence */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Vendor Intelligence</span>
                            </div>
                            
                            <div className="grid gap-4 bg-foreground/[0.02] border border-foreground/5 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Order Supplier</Label>
                                    <div className="flex gap-2">
                                        <Select value={supplierId} onValueChange={handleSupplierChange}>
                                            <SelectTrigger className="flex-1 bg-foreground/5 border-foreground/10 text-foreground rounded-xl focus:ring-blue-400/20">
                                                <SelectValue placeholder="Select Provider Node" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                {suppliers.map(s => (
                                                    <SelectItem key={s.id} value={s.id} className="focus:bg-blue-400/10 focus:text-blue-400">{s.name}</SelectItem>
                                                ))}
                                                {suppliers.length === 0 && <SelectItem value="none" disabled>No providers detected</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" size="icon" onClick={handleManageSuppliers} className="w-12 rounded-xl border-foreground/10 bg-foreground/5 text-foreground/40 hover:text-foreground hover:bg-foreground/10" >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={handleEditSupplier} disabled={!supplierId} className="w-12 rounded-xl border-foreground/10 bg-foreground/5 text-foreground/40 hover:text-foreground hover:bg-foreground/10 disabled:opacity-20" >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Vendor Logistics Base</Label>
                                    <Textarea placeholder="Enter logistics coordinates..." className="min-h-[100px] bg-foreground/5 border-foreground/10 text-foreground rounded-xl focus:ring-blue-400/20 resize-none" value={vendorAddress || ''} onChange={(e) => setVendorAddress(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Financial Settlement Node</Label>
                                    <Select value={depositAccount} onValueChange={setDepositAccount}>
                                        <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl focus:ring-blue-400/20">
                                            <SelectValue placeholder="Select Settlement Account" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-foreground/10 text-foreground">
                                            {liabilityAccounts.map(account => (
                                                <SelectItem key={account.id} value={account.id} className="focus:bg-blue-400/10 focus:text-blue-400">
                                                    {account.account_name} <span className="opacity-40 text-[10px] ml-2">[{account.account_no}]</span>
                                                </SelectItem>
                                            ))}
                                            {liabilityAccounts.length === 0 && (
                                                <SelectItem value="none" disabled>No settlement nodes available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Tactical Parameters */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarIcon className="h-4 w-4 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Tactical Parameters</span>
                            </div>

                            <div className="grid gap-4 bg-foreground/[0.02] border border-foreground/5 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Deployment Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn( "w-full justify-start text-left rounded-xl border-foreground/10 bg-foreground/5 text-foreground hover:bg-foreground/10", !date && "text-foreground/20" )} >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-emerald-400" />
                                                {date ? format(date, "MMMM dd, yyyy") : <span>Initiate Timestamp</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-card border-foreground/10 shadow-2xl" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                                className="bg-card text-foreground"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Destination Coordinates</Label>
                                    <Textarea placeholder="Enter delivery destination..." className="min-h-[160px] bg-foreground/5 border-foreground/10 text-foreground rounded-xl focus:ring-emerald-400/20 resize-none" value={shippingAddress || ''} onChange={(e) => setShippingAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Manifest / Items Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/60">Resource Manifest</span>
                            </div>
                            <div className="flex items-center gap-4 bg-foreground/5 border border-foreground/10 px-4 py-2 rounded-xl backdrop-blur-sm w-96">
                                <Search className="h-4 w-4 text-foreground/20 shrink-0" />
                                <ProductSearch value="" onSelect={handleProductSelect} />
                            </div>
                        </div>

                        <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                            <Table>
                                <TableHeader className="bg-foreground/5">
                                    <TableRow className="border-foreground/5 hover:bg-transparent">
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14">Identity</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14">Resource Designation</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 text-right">Units/Pack</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 text-right">Pack Qty</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 text-right">Pack Cost</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 text-right">Unit Cost</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 text-right">Protocol Unit</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-14 text-right">Net Allocation</TableHead>
                                        <TableHead className="w-[60px] h-14"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center text-foreground/20 gap-4">
                                                    <div className="p-4 rounded-full bg-foreground/5 border border-foreground/10">
                                                        <HelpCircle className="h-8 w-8 opacity-20" />
                                                    </div>
                                                    <p className="text-sm font-black uppercase tracking-widest italic">Awaiting Resource Initialization</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((item) => (
                                            <TableRow key={item.id} className="border-foreground/5 group hover:bg-foreground/[0.02] transition-colors">
                                                <TableCell className="">
                                                    <Input value={item.barcode || ''} className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-xs font-mono focus:ring-blue-400/20" placeholder="N/A" onChange={(e) => updateItem(item.id, 'barcode', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="">
                                                    <Input value={item.item || ''} className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-sm font-black italic uppercase tracking-tight focus:ring-blue-400/20" placeholder="Resource Name" onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="">
                                                    <Input type="number" value={item.qtyPerCase ?? 1} className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-right font-bold focus:ring-blue-400/20 w-24 ml-auto" onChange={(e) => updateItem(item.id, 'qtyPerCase', parseFloat(e.target.value) || 1)}
                                                    />
                                                </TableCell>
                                                <TableCell className="">
                                                    <Input type="number" value={item.orderQty ?? 0} className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-right font-bold focus:ring-blue-400/20 w-24 ml-auto" onChange={(e) => updateItem(item.id, 'orderQty', parseFloat(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="text-[10px] font-black text-foreground/20">₱</span>
                                                        <Input type="number" value={item.costPricePerCase || item.cost || 0} className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-right font-bold focus:ring-emerald-400/20 w-28" onChange={(e) => updateItem(item.id, 'costPricePerCase', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest mb-1">Estimated Unit</span>
                                                        <span className="text-sm font-black italic text-blue-400">₱{(item.costPricePerPiece ?? 0).toFixed(2)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {customUomRows[item.id] ? (
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Input value={item.uom || ''} className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-right focus:ring-blue-400/20 w-24" placeholder="UNIT" autoFocus onChange={(e) => updateItem(item.id, 'uom', e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        setCustomUomRows(prev => ({ ...prev, [item.id]: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <Button variant="ghost" size="icon" className="w-10 text-blue-400 hover:bg-blue-400/10 rounded-lg" onClick={() => setCustomUomRows(prev => ({ ...prev, [item.id]: false }))}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Select
                                                            value={item.uom || 'pc'}
                                                            onValueChange={(val) => {
                                                                if (val === 'CUSTOM_NEW') {
                                                                    setCustomUomRows(prev => ({ ...prev, [item.id]: true }));
                                                                    updateItem(item.id, 'uom', ''); 
                                                                } else {
                                                                    updateItem(item.id, 'uom', val);
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger className=" bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-right focus:ring-blue-400/20 w-24 ml-auto">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                                <SelectItem value="pc" className="focus:bg-blue-400/10 focus:text-blue-400">pc</SelectItem>
                                                                <SelectItem value="case" className="focus:bg-blue-400/10 focus:text-blue-400">case</SelectItem>
                                                                <SelectItem value="bottle" className="focus:bg-blue-400/10 focus:text-blue-400">bottle</SelectItem>
                                                                <SelectItem value="box" className="focus:bg-blue-400/10 focus:text-blue-400">box</SelectItem>
                                                                <SelectItem value="kg" className="focus:bg-blue-400/10 focus:text-blue-400">kg</SelectItem>
                                                                <SelectItem value="each" className="focus:bg-blue-400/10 focus:text-blue-400">each</SelectItem>
                                                                <div className="border-t my-1 border-foreground/10 h-[1px]" />
                                                                <SelectItem value="CUSTOM_NEW" className="text-blue-400 font-black uppercase tracking-widest text-[10px] focus:bg-blue-400/10">
                                                                    <div className="flex items-center gap-2">
                                                                        <Plus className="h-3 w-3" />
                                                                        Define Unit
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right align-middle">
                                                    <span className="text-lg font-black italic tracking-tighter text-foreground">₱{(item.qty * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                </TableCell>
                                                <TableCell className="">
                                                    <Button variant="ghost" size="icon" className="w-10 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all" onClick={() => {
                                                            setItems(items.filter(i => i.id !== item.id));
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>


                    {/* Intelligence Summary & Financial Terminal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-foreground/5 pt-12">
                        {/* Intelligence Summary */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Pencil className="h-3 w-3 text-foreground/40" />
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">External Memo</Label>
                                </div>
                                <Textarea placeholder="Order annotations for provider..." className="bg-foreground/5 border-foreground/10 text-foreground rounded-2xl focus:ring-blue-400/20 resize-none text-xs italic" value={comments || ''} onChange={(e) => setComments(e.target.value)}
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-foreground/40" />
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Secure Internal Logs</Label>
                                </div>
                                <Textarea placeholder="Encrypted internal observations..." className="bg-foreground/5 border-foreground/10 text-foreground rounded-2xl focus:ring-slate-400/20 resize-none text-xs italic" value={privateComments || ''} onChange={(e) => setPrivateComments(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Financial Terminal */}
                        <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <CreditCard className="h-32 w-32" />
                            </div>
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Subtotal Allocation</span>
                                    <span className="text-xl font-bold text-foreground/60">₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Tax Matrix</span>
                                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">Automatic VAT Computation</span>
                                    </div>
                                    <span className="text-xl font-bold text-foreground/60">₱0.00</span>
                                </div>
                                <div className="h-px bg-foreground/10 my-4" />
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Total Fiscal Liability</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                                            <span className="text-[8px] font-black text-foreground/20 uppercase tracking-widest">Active Computation</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-4xl font-black italic tracking-tighter text-foreground">
                                            ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Integrity Verified</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/5">
                            <TrendingUp className="h-4 w-4 text-foreground/40" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Flow: Optimized</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleClose} className="px-8 rounded-2xl border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-all font-black uppercase tracking-widest text-xs" >
                            Abort
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="px-12 rounded-2xl bg-blue-400 hover:bg-blue-400/90 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-400/20 transition-all gap-2" >
                            {saving ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {mode === 'edit' ? 'Update Protocol' : 'Authorize Order'}
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const TrendingUp = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
);
