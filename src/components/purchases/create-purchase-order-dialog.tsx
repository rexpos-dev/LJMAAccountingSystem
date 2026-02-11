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
import { useDialog } from '@/components/layout/dialog-provider';
import { CalendarIcon, Plus, Trash2, Users, Pencil, HelpCircle, X, Search, Check } from 'lucide-react';
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
                <div className="relative w-full">
                    <Input
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (!open) setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        className="h-10 pl-4 pr-10 font-normal bg-[#1a1c23] border-[#2e313a] text-white placeholder:text-muted-foreground rounded-lg transition-colors shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                <div className="max-h-[300px] overflow-y-auto">
                    {loading && <div className="p-4 text-sm text-muted-foreground text-center">Loading inventory...</div>}
                    {error && <div className="p-4 text-sm text-destructive text-center font-medium">{error}</div>}
                    {!loading && !error && products.length === 0 && (
                        <div className="p-4 text-sm text-muted-foreground text-center">No products found.</div>
                    )}
                    {!loading && products.map((product) => (
                        <div
                            key={product.id}
                            className="p-3 text-sm hover:bg-muted cursor-pointer transition-colors border-b last:border-0"
                            onClick={() => {
                                onSelect(product);
                                setOpen(false);
                                setSearchTerm(''); // Clear after select
                            }}
                        >
                            <div className="font-semibold">{product.name}</div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-muted-foreground">{product.sku || 'No SKU'}</span>
                                {product.barcode && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{product.barcode}</span>}
                            </div>
                        </div>
                    ))}
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

    const [items, setItems] = useState<PurchaseOrderItem[]>([]);
    const [comments, setComments] = useState('');
    const [privateComments, setPrivateComments] = useState('');
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editOrderId, setEditOrderId] = useState<string | null>(null);
    const [customUomRows, setCustomUomRows] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (openDialogs['create-purchase-order']) {
            fetchSuppliers();
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

    const resetForm = () => {
        setSupplierId('');
        setVendorAddress('');
        setShippingAddress('');

        setItems([]);
        setComments('');
        setPrivateComments('');
        setDate(new Date());
        setMode('create');
        setEditOrderId(null);
    };

    const fetchOrderDetails = async (id: string) => {
        try {
            // Reusing list API logic: fetch all and find (since endpoint doesn't support direct ID fetch yet)
            // Ideally should be GET /api/purchase-orders/[id] or ?id=...
            const res = await fetch(`/api/purchase-orders`);
            if (res.ok) {
                const data = await res.json();
                const order = data.find((o: any) => o.id === id);
                if (order) {
                    setSupplierId(order.supplierId);
                    // Trigger address update based on supplier if needed, but order might have custom address
                    // We should trust the order's stored address if available
                    setVendorAddress(order.vendorAddress || '');
                    setShippingAddress(order.shippingAddress || '');
                    setDate(new Date(order.date));
                    setComments(order.comments || '');
                    setPrivateComments(order.privateComments || '');


                    // Map items
                    const mappedItems = order.items.map((item: any) => ({
                        id: item.id,
                        qty: item.quantity,
                        item: item.product?.name || item.itemDescription || 'Unknown Item',
                        barcode: item.product?.barcode || item.barcode || '',
                        productId: item.productId, // Important for tracking
                        qtyPerCase: item.qtyPerCase || 1,
                        orderQty: item.orderQty || item.quantity || 0,
                        costPricePerCase: item.costPricePerCase || (item.unitPrice * (item.qtyPerCase || 1)) || 0,
                        costPricePerPiece: item.costPricePerPiece || item.unitPrice || 0
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
        const costVal = product.cost ? parseFloat(product.cost.toString()) : 0;
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
            if (field === 'qtyPerCase' || field === 'costPricePerCase' || field === 'orderQty') {
                const qtyPerCase = parseFloat(updatedItem.qtyPerCase?.toString() || '1') || 1;
                const costPricePerCase = parseFloat(updatedItem.costPricePerCase?.toString() || '0') || 0;
                const orderQty = parseFloat(updatedItem.orderQty?.toString() || '0') || 0;

                updatedItem.costPricePerPiece = costPricePerCase / qtyPerCase;
                updatedItem.unitPrice = updatedItem.costPricePerPiece;
                updatedItem.qty = orderQty * qtyPerCase;
            } else if (field === 'costPricePerPiece') {
                const costPricePerPiece = parseFloat(value?.toString() || '0') || 0;
                const qtyPerCase = parseFloat(updatedItem.qtyPerCase?.toString() || '1') || 1;
                updatedItem.costPricePerCase = costPricePerPiece * qtyPerCase;
                updatedItem.unitPrice = costPricePerPiece;
            }

            return updatedItem;
        }));
    };


    const handleClose = () => {
        closeDialog('create-purchase-order');
        resetForm();
    };

    const handleSave = async () => {
        if (!supplierId) {
            toast({ title: 'Validation Error', description: 'Please select a supplier.', variant: 'destructive' });
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
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl">{mode === 'edit' ? 'Edit Purchase Order' : 'New Purchase Order'}</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Top Form Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="supplier">Order Supplier</Label>
                                <div className="flex gap-2">
                                    <Select value={supplierId} onValueChange={handleSupplierChange}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select Supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {suppliers.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                            ))}
                                            {suppliers.length === 0 && <SelectItem value="none" disabled>No suppliers found</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="icon" title="Manage Suppliers" onClick={handleManageSuppliers}>
                                        <Users className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" title="Edit Supplier" onClick={handleEditSupplier} disabled={!supplierId}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Vendor Address</Label>
                                <Textarea
                                    placeholder="[Enter vendor address]"
                                    className="min-h-[100px] resize-none"
                                    value={vendorAddress || ''}
                                    onChange={(e) => setVendorAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "MM/dd/yyyy") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="grid gap-2">
                                <Label>Ship To</Label>
                                <Textarea
                                    placeholder="[Enter shipping address]"
                                    className="min-h-[100px] resize-none"
                                    value={shippingAddress || ''}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Items Table */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                            <div className="flex-1 max-w-sm">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Search to Add Item</Label>
                                <ProductSearch value="" onSelect={handleProductSelect} />
                            </div>
                            <div className="text-xs text-muted-foreground pt-4">
                                Select a product to automatically add it to the order list.
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[12%]">Barcode</TableHead>
                                        <TableHead className="w-[30%]">Item Name</TableHead>
                                        <TableHead className="w-[80px] text-right">QTY/Case</TableHead>
                                        <TableHead className="w-[80px] text-right">Order QTY</TableHead>
                                        <TableHead className="w-[100px] text-right">Cost/Case</TableHead>
                                        <TableHead className="w-[100px] text-right">Cost/Piece</TableHead>
                                        <TableHead className="w-[100px] text-right">UOM</TableHead>
                                        <TableHead className="w-[110px] text-right">Total</TableHead>
                                        <TableHead className="w-[40px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-[200px] text-center text-muted-foreground">
                                                Click "Add Item" to add items to this order.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Input
                                                        value={item.barcode || ''}
                                                        className="h-8"
                                                        placeholder="Barcode"
                                                        onChange={(e) => updateItem(item.id, 'barcode', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="relative">
                                                    <Input
                                                        value={item.item || ''}
                                                        className="h-8 font-medium"
                                                        placeholder="Item Name"
                                                        onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.qtyPerCase ?? 1}
                                                        className="h-8 text-right"
                                                        onChange={(e) => updateItem(item.id, 'qtyPerCase', parseFloat(e.target.value) || 1)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.orderQty ?? 0}
                                                        className="h-8 text-right"
                                                        onChange={(e) => updateItem(item.id, 'orderQty', parseFloat(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.costPricePerCase ?? 0}
                                                        className="h-8 text-right"
                                                        onChange={(e) => updateItem(item.id, 'costPricePerCase', parseFloat(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.costPricePerPiece ?? 0}
                                                        className="h-8 text-right"
                                                        onChange={(e) => updateItem(item.id, 'costPricePerPiece', parseFloat(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {customUomRows[item.id] ? (
                                                        <div className="flex items-center gap-1">
                                                            <Input
                                                                value={item.uom || ''}
                                                                className="h-8 text-right"
                                                                placeholder="Enter UOM"
                                                                autoFocus
                                                                onChange={(e) => updateItem(item.id, 'uom', e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        setCustomUomRows(prev => ({ ...prev, [item.id]: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-primary shadow-none"
                                                                onClick={() => setCustomUomRows(prev => ({ ...prev, [item.id]: false }))}
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
                                                                    updateItem(item.id, 'uom', ''); // Clear to let user type
                                                                } else {
                                                                    updateItem(item.id, 'uom', val);
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 text-right">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pc">pc</SelectItem>
                                                                <SelectItem value="case">case</SelectItem>
                                                                <SelectItem value="bottle">bottle</SelectItem>
                                                                <SelectItem value="box">box</SelectItem>
                                                                <SelectItem value="kg">kg</SelectItem>
                                                                <SelectItem value="each">each</SelectItem>
                                                                <div className="border-t my-1 h-[1px] bg-muted" />
                                                                <SelectItem value="CUSTOM_NEW" className="text-primary font-medium cursor-pointer">
                                                                    <div className="flex items-center">
                                                                        <Plus className="mr-2 h-3 w-3" />
                                                                        + Add New...
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right align-middle font-medium">
                                                    {(item.qty * item.unitPrice).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                                                        setItems(items.filter(i => i.id !== item.id));
                                                    }}>
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


                    {/* Footer Notes & Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Comments</Label>
                                <Textarea
                                    placeholder="[Enter order notes]"
                                    className="h-[100px] resize-none"
                                    value={comments || ''}
                                    onChange={(e) => setComments(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Private Comments</Label>
                                <Textarea
                                    placeholder="[Enter internal notes]"
                                    className="h-[100px] resize-none"
                                    value={privateComments || ''}
                                    onChange={(e) => setPrivateComments(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
                                <span>Total</span>
                                <span className="text-primary">₱{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t p-4">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex gap-2">
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save and Preview"}
                            </Button>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
