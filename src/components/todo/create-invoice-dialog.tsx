
'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CalendarIcon, UserPlus, Pencil, Search, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useExternalProducts } from '@/hooks/use-products';
import { useAccounts } from '@/hooks/use-accounts';
import { useCustomers } from '@/hooks/use-customers';
import { useSalesUsers } from '@/hooks/use-sales-users';
import format from '@/lib/date-format';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export default function CreateInvoiceDialog() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [date, setDate] = useState<Date | undefined>(new Date(2025, 9, 7));
    const { openDialogs, closeDialog, openDialog } = useDialog();
    const [productQuery, setProductQuery] = useState<string>('');
    const {
        externalProducts: products,
        isLoading: productsLoading,
        error: productsError,
    } = useExternalProducts(1, 10, productQuery);
    const [items, setItems] = useState<any[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const resultsRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { data: accounts, isLoading: accountsLoading } = useAccounts();
    const { data: salesUsers = [], isLoading: salesUsersLoading } = useSalesUsers();
    const [selectedDepositAccount, setSelectedDepositAccount] = useState<string>('');
    const { customers, refreshCustomers } = useCustomers();
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [customerPONumber, setCustomerPONumber] = useState<string>('');
    const [salesperson, setSalesperson] = useState<string>('');
    const [invoiceNumber, setInvoiceNumber] = useState<string>('');
    const [terms, setTerms] = useState<string>('pay-in-days');

    const [billingAddress, setBillingAddress] = useState<string>('');
    const [shippingAddress, setShippingAddress] = useState<string>('');
    const [customerTax, setCustomerTax] = useState<string>('default');

    // Fetch next invoice number
    useEffect(() => {
        if (openDialogs['create-invoice']) {
            fetch('/api/invoices/next-number')
                .then(res => res.json())
                .then(data => {
                    if (data.nextNumber) {
                        setInvoiceNumber(data.nextNumber);
                    }
                })
                .catch(err => console.error('Failed to fetch next invoice number', err));
        }
    }, [openDialogs]);

    // Fetch next PO number when customer is selected
    useEffect(() => {
        if (selectedCustomer) {
            fetch('/api/invoices/next-po-number')
                .then(res => res.json())
                .then(data => {
                    if (data.nextNumber) {
                        setCustomerPONumber(data.nextNumber);
                    }
                })
                .catch(err => console.error('Failed to fetch next PO number', err));

            // Auto-select tax status
            const customer = customers.find(c => c.id === selectedCustomer);
            if (customer?.isTaxExempt) {
                setCustomerTax('exempt');
            } else {
                setCustomerTax('default');
            }
        } else {
            setCustomerPONumber('');
            setCustomerTax('default');
        }
    }, [selectedCustomer]);



    const addItem = (product: any) => {
        setItems(prev => {
            const existing = prev.find(it => it.id === product.id);
            if (existing) {
                return prev.map(it => it.id === product.id ? { ...it, qty: (it.qty || 0) + 1 } : it);
            }

            return [
                ...prev,
                {
                    id: product.id,
                    lineId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    name: product.name || product.code || product.sku || 'Product',
                    description: product.description || product.description || '',
                    qty: 1,
                    unitPrice: Number(product.price) || 0,
                },
            ];
        });
        setProductQuery('');
        setHighlightedIndex(null);
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!products || products.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => {
                const next = prev === null ? 0 : Math.min(products.length - 1, prev + 1);
                return next;
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => {
                const next = prev === null ? products.length - 1 : Math.max(0, prev - 1);
                return next;
            });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const idx = highlightedIndex ?? 0;
            const p = products[idx];
            if (p) addItem(p);
        } else if (e.key === 'Escape') {
            setProductQuery('');
            setHighlightedIndex(null);
        }
    };

    useEffect(() => {
        if (resultsRef.current && highlightedIndex !== null) {
            const nodes = resultsRef.current.querySelectorAll('li');
            const node = nodes[highlightedIndex] as HTMLElement | undefined;
            node?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    const updateQty = (lineId: string, value: number) => {
        setItems(prev => prev.map(it => it.lineId === lineId ? { ...it, qty: value } : it));
    };

    const deleteItem = (lineId: string) => {
        setItems(prev => prev.filter(it => it.lineId !== lineId));
    };

    const subtotal = items.reduce((s, it) => s + (it.qty || 0) * (it.unitPrice || 0), 0);
    const total = subtotal; // Add tax logic if needed later

    const handleRecord = async () => {
        if (!selectedCustomer) {
            toast({
                title: "Validation Error",
                description: "Please select a customer.",
                variant: "destructive"
            });
            return;
        }
        if (items.length === 0) {
            toast({
                title: "Validation Error",
                description: "Please add at least one item.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: selectedCustomer,
                    date: date,
                    dueDate: date, // Simplified logic for now
                    terms,
                    salesperson,
                    depositAccount: selectedDepositAccount,
                    billingAddress,
                    shippingAddress,
                    invoiceNumber,
                    customerPONumber,
                    items,
                    subtotal,
                    total
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Failed to save invoice');
            }

            toast({
                title: "Success",
                description: "Invoice saved successfully.",
            });
            closeDialog('create-invoice');
            setItems([]); // Reset items
            // Reset other fields as needed
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <Dialog open={openDialogs['create-invoice']} onOpenChange={() => closeDialog('create-invoice')}>
                <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>New Invoice</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1 pr-6 -mr-6">
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        <div className="lg:col-span-4">
                                            <Tabs defaultValue="billing">
                                                <TabsList>
                                                    <TabsTrigger value="billing">Billing</TabsTrigger>
                                                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="billing" className="pt-4">
                                                    <div className="space-y-4">
                                                        <div className="grid gap-2">
                                                            <label>Customer</label>
                                                            <div className="flex gap-2">
                                                                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a customer" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {customers.map(customer => (
                                                                            <SelectItem key={customer.id} value={customer.id}>
                                                                                {customer.customerName}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Button variant="outline" size="icon" onClick={() => openDialog('add-customer')}>
                                                                    <UserPlus className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="outline" size="icon">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label>Bill To</label>
                                                            <Textarea placeholder="Enter billing address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="grid gap-2">
                                                                <label>Customer PO No.</label>
                                                                <Input value={customerPONumber} readOnly className="bg-muted" />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <label>Customer Tax</label>
                                                                <Select value={customerTax} onValueChange={setCustomerTax}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="default">Default</SelectItem>
                                                                        <SelectItem value="exempt">Exempt</SelectItem>
                                                                    </SelectContent>
                                                                </Select>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="shipping" className="pt-4">
                                                    <div className="space-y-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="shipping-address">Ship To</Label>
                                                            <Textarea id="shipping-address" placeholder="Enter shipping address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox id="same-as-billing" />
                                                            <Label htmlFor="same-as-billing" className="font-normal">Same as billing</Label>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="ship-by">Ship By</Label>
                                                                <Input id="ship-by" />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="tracking-ref">Tracking Ref No.</Label>
                                                                <Input id="tracking-ref" />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label>Shipping Costs/Tax</Label>
                                                            <div className="flex gap-2">
                                                                <Input type="number" placeholder="0.00" />
                                                                <Select defaultValue="none">
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="none">
                                                                            None
                                                                        </SelectItem>
                                                                        <SelectItem value="exempt">
                                                                            Exempt
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </div>

                                        <Card className="bg-muted/30 lg:col-span-8">
                                            <CardHeader>
                                                <CardTitle className="text-lg font-headline">Invoice</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <Label>Create From</Label>
                                                    <Select defaultValue="new-invoice">
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="new-invoice">
                                                                [New Invoice]
                                                            </SelectItem>
                                                            <SelectItem value="existing-invoice">
                                                                Existing Invoice
                                                            </SelectItem>
                                                            <SelectItem value="quote">
                                                                Quote
                                                            </SelectItem>
                                                            <SelectItem value="order">
                                                                Order
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-2 items-center gap-4">
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
                                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
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
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <Label>Terms</Label>
                                                    <div className="flex gap-2">
                                                        <Select value={terms} onValueChange={setTerms}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pay-in-days">
                                                                    Pay in Days
                                                                </SelectItem>
                                                                <SelectItem value="COD">
                                                                    COD
                                                                </SelectItem>

                                                            </SelectContent>
                                                        </Select>
                                                        <Input type="number" defaultValue="30" className="w-20" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <Label>Salesperson</Label>
                                                    <Select value={salesperson} onValueChange={setSalesperson}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={salesUsersLoading ? "Loading..." : "Select salesperson"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {salesUsers.map((user: any) => (
                                                                <SelectItem key={user.id} value={user.complete_name || user.name}>
                                                                    {user.complete_name || user.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <Label>Invoice Number</Label>
                                                    <Input value={invoiceNumber} readOnly className="bg-muted" />
                                                </div>
                                                <div className="grid grid-cols-2 items-center gap-4">
                                                    <Label>Deposit Account</Label>
                                                    <Select value={selectedDepositAccount} onValueChange={setSelectedDepositAccount}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="-- Select account --" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {accountsLoading ? (
                                                                <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                                                            ) : accounts.length === 0 ? (
                                                                <div className="p-2 text-sm text-muted-foreground">No accounts found</div>
                                                            ) : (
                                                                <>
                                                                    {accounts.filter(acc => acc.bank === 'Yes' || acc.account_type === 'Asset').map(account => (
                                                                        <SelectItem key={account.id || account.account_name} value={account.id || account.account_name}>
                                                                            {account.account_name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <label className="sr-only">Search products</label>
                                        <div className="relative">
                                            <Input
                                                placeholder="Search products"
                                                value={productQuery}
                                                onChange={(e) => setProductQuery(e.target.value)}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Search className="h-4 w-4" />
                                            </div>

                                            {productQuery && (
                                                <div ref={resultsRef} className="absolute left-0 right-0 mt-1 bg-popover border rounded shadow z-50 max-h-60 overflow-auto">
                                                    {productsLoading ? (
                                                        <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                                                    ) : productsError ? (
                                                        <div className="p-2 text-sm text-red-500">No Products Fetch</div>
                                                    ) : products.length === 0 ? (
                                                        <div className="p-2 text-sm text-muted-foreground">No products found</div>
                                                    ) : (
                                                        <ul>
                                                            {products.map((p: any, idx: number) => (
                                                                <li
                                                                    key={`${p.id}-${idx}`}
                                                                    className={`p-2 cursor-pointer ${highlightedIndex === idx ? 'bg-muted' : 'hover:bg-muted'}`}
                                                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                                                    onMouseLeave={() => setHighlightedIndex(null)}
                                                                    onClick={() => addItem(p)}
                                                                    role="option"
                                                                    aria-selected={highlightedIndex === idx}
                                                                >
                                                                    <div className="font-medium">{p.name || p.sku || p.barcode}</div>
                                                                    <div className="text-sm text-muted-foreground">{p.description || p.category || ''}</div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[80px]">Qty</TableHead>
                                                    <TableHead className="w-[200px]">Item</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead className="w-[120px] text-right">
                                                        Unit Price
                                                    </TableHead>
                                                    <TableHead className="w-[100px] text-right">Tax</TableHead>
                                                    <TableHead className="w-[120px] text-right">Total</TableHead>
                                                    <TableHead className="w-[48px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {items.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                            Click here to add items to this invoice.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    items.map(item => (
                                                        <TableRow key={item.lineId ?? item.id}>
                                                            <TableCell className="w-[80px]">
                                                                <Input
                                                                    type="number"
                                                                    value={String(item.qty)}
                                                                    onChange={(e) => updateQty(item.lineId ?? item.id, Math.max(0, Number(e.target.value || 0)))}
                                                                    className="w-20"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="w-[200px]">{item.name}</TableCell>
                                                            <TableCell>{item.description}</TableCell>
                                                            <TableCell className="w-[120px] text-right">{item.unitPrice.toFixed(2)}</TableCell>
                                                            <TableCell className="w-[100px] text-right">0.00</TableCell>
                                                            <TableCell className="w-[120px] text-right">{(item.qty * item.unitPrice).toFixed(2)}</TableCell>
                                                            <TableCell className="w-[48px] text-right">
                                                                <Button variant="ghost" size="icon" onClick={() => deleteItem(item.lineId ?? item.id)}>
                                                                    <Trash className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>₱{subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </ScrollArea >
                    <DialogFooter className="border-t pt-4">
                        <div className="flex gap-2 ml-auto">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleRecord} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Record'}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent >
            </Dialog >
        </>
    );
}
