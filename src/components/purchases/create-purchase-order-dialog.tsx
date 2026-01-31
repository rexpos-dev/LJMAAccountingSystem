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
import { CalendarIcon, Plus, Trash2, Users, Pencil, HelpCircle, X, Search } from 'lucide-react';
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
    description: string;
    unitPrice: number;
    tax: string;
    productId?: string;
}

const ProductSearch = ({ value, onSelect }: { value: string, onSelect: (product: any) => void }) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            const timeoutId = setTimeout(() => {
                fetchProducts(searchTerm);
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm, open]);

    const fetchProducts = async (term: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?search=${encodeURIComponent(term)}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-8 px-2 font-normal"
                >
                    {value || "Search product..."}
                    <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50 rotate-45" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <div className="p-2 border-b">
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8"
                        autoFocus
                    />
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                    {loading && <div className="p-2 text-sm text-muted-foreground text-center">Loading...</div>}
                    {!loading && products.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">No products found.</div>
                    )}
                    {!loading && products.map((product) => (
                        <div
                            key={product.id}
                            className="p-2 text-sm hover:bg-muted cursor-pointer truncate"
                            onClick={() => {
                                onSelect(product);
                                setOpen(false);
                            }}
                        >
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.code}</div>
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
    const [taxType, setTaxType] = useState('default');
    const [items, setItems] = useState<PurchaseOrderItem[]>([]);
    const [comments, setComments] = useState('');
    const [privateComments, setPrivateComments] = useState('');
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editOrderId, setEditOrderId] = useState<string | null>(null);

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
        setTaxType('default');
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
                    setTaxType(order.taxType || 'default');

                    // Map items
                    const mappedItems = order.items.map((item: any) => ({
                        id: item.id,
                        qty: item.quantity,
                        item: item.product?.name || 'Unknown Item', // Or itemDescription
                        description: item.itemDescription || '',
                        unitPrice: item.unitPrice,
                        tax: 'None', // Default or from DB if stored
                        productId: item.productId // Important for tracking
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

    const handleAddItem = () => {
        const newItem: PurchaseOrderItem = {
            id: Math.random().toString(36).substr(2, 9),
            qty: 1,
            item: '',
            description: '',
            unitPrice: 0,
            tax: 'None'
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
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
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
                taxType,
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
                toast({ title: 'Success', description: 'Purchase Order created successfully.' });
                handleClose();
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
                                    value={vendorAddress}
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
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Label>Tax Method</Label>
                        <Select value={taxType} onValueChange={setTaxType}>
                            <SelectTrigger className="w-[240px]">
                                <SelectValue placeholder="Select Tax" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[80px]">Qty</TableHead>
                                        <TableHead className="w-[30%]">Item</TableHead>
                                        <TableHead className="w-[30%]">Description</TableHead>
                                        <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                                        <TableHead className="w-[100px] text-right">Tax</TableHead>
                                        <TableHead className="w-[120px] text-right">Total</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-[200px] text-center text-muted-foreground">
                                                Click "Add Item" to add items to this order.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.qty}
                                                        className="h-8"
                                                        onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell className="relative">
                                                    <ProductSearch
                                                        value={item.item}
                                                        onSelect={(product) => {
                                                            updateItem(item.id, 'item', product.name);
                                                            updateItem(item.id, 'description', product.description || '');
                                                            updateItem(item.id, 'unitPrice', product.costPrice || 0);
                                                            updateItem(item.id, 'productId', product.id);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={item.description}
                                                        className="h-8"
                                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.unitPrice}
                                                        className="h-8 text-right"
                                                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right align-middle">
                                                    {item.tax}
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

                        <div className="flex gap-2">
                            <Button onClick={handleAddItem} variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                            <Button variant="outline">
                                Add Discount
                            </Button>
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
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Private Comments</Label>
                                <Textarea
                                    placeholder="[Enter internal notes]"
                                    className="h-[100px] resize-none"
                                    value={privateComments}
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
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save and Preview"}
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button variant="ghost">Help</Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
