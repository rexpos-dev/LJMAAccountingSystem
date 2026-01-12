"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAccounts } from '@/app/configuration/chart-of-accounts/mock-accounts';
import { useExternalProducts } from '@/hooks/use-products';

interface SalesItemRow {
    id: string;
    qty: number;
    itemId: string;
    description: string;
    unitPrice: number;
    tax: string;
    total: number;
}

export default function EnterCashSaleDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const [depositToAccount, setDepositToAccount] = useState<string>('Checking Account');
    const [salesperson, setSalesperson] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [privateComments, setPrivateComments] = useState<string>('');
    const [items, setItems] = useState<SalesItemRow[]>([]);

    // Fetch products (using first page, reasonably large size to get a list)
    const { externalProducts } = useExternalProducts(1, 100, '', '', '');

    // Initialize with one empty row if empty
    useEffect(() => {
        if (items.length === 0 && openDialogs['enter-cash-sale']) {
            addItemRow();
        }
    }, [items.length, openDialogs['enter-cash-sale']]);

    const addItemRow = () => {
        const newId = `item-${Date.now()}-${items.length}`;
        setItems(prev => [
            ...prev,
            {
                id: newId,
                qty: 1,
                itemId: '',
                description: '',
                unitPrice: 0,
                tax: 'None',
                total: 0,
            }
        ]);
    };

    const removeItemRow = (id: string) => {
        if (items.length <= 1) return;
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleItemChange = (id: string, productId: string) => {
        const product = externalProducts.find(p => p.sku === productId);
        setItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    const price = product ? parseFloat(product.price.toString()) : 0;
                    return {
                        ...item,
                        itemId: productId,
                        description: product ? product.name : '',
                        unitPrice: price,
                        total: item.qty * price
                    };
                }
                return item;
            })
        );
    };

    const handleQtyChange = (id: string, qty: number) => {
        setItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        qty: qty,
                        total: qty * item.unitPrice
                    };
                }
                return item;
            })
        );
    };

    // Calculate Totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal; // Add tax logic if needed

    return (
        <Dialog open={openDialogs['enter-cash-sale']} onOpenChange={() => closeDialog('enter-cash-sale')}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Non-Invoiced Cash Sale</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Items Grid */}
                    <div className="flex-1 overflow-auto m-4 border rounded-md shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-16">Qty</TableHead>
                                    <TableHead className="min-w-[200px]">Item</TableHead>
                                    <TableHead className="min-w-[200px]">Description</TableHead>
                                    <TableHead className="w-24 text-right">Unit Price</TableHead>
                                    <TableHead className="w-24 text-center">Tax</TableHead>
                                    <TableHead className="w-24 text-right">Total</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                className="w-16 h-8"
                                                value={item.qty}
                                                onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                                                min={1}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={item.itemId}
                                                onValueChange={(val) => handleItemChange(item.id, val)}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {externalProducts.map((p, idx) => (
                                                        <SelectItem key={`${p.sku}-${idx}`} value={p.sku}>
                                                            {p.sku}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-8 flex items-center px-3 border rounded-md bg-muted/20 truncate text-sm">
                                                {item.description || <span className="text-muted-foreground opacity-50">Select an item...</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.unitPrice.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.tax}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {item.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                                onClick={() => removeItemRow(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Middle Action Bar */}
                    <div className="px-4 pb-2 flex gap-2">
                        <Button variant="secondary" size="sm" onClick={addItemRow} className="h-8 shadow-sm border bg-gradient-to-b from-white to-gray-50">Add Item</Button>
                        <Button variant="secondary" size="sm" disabled className="h-8 shadow-sm border bg-gradient-to-b from-white to-gray-50">Remove Item</Button>
                        <Button variant="secondary" size="sm" disabled className="h-8 shadow-sm border bg-gradient-to-b from-white to-gray-50">Add Discount...</Button>
                    </div>

                    {/* Bottom Form Section */}
                    <div className="p-4 grid grid-cols-12 gap-6 border-t">
                        {/* Left Side Controls */}
                        <div className="col-span-12 md:col-span-7 space-y-4">
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-3 text-right pr-2">Deposit Account:</Label>
                                <div className="col-span-9">
                                    <Select value={depositToAccount} onValueChange={setDepositToAccount}>
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Select Account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockAccounts.filter(account => account.bank === 'Yes').map(account => (
                                                <SelectItem key={(account as any).number} value={account.name}>
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-3 text-right pr-2">Salesperson:</Label>
                                <div className="col-span-9">
                                    <Select value={salesperson} onValueChange={setSalesperson}>
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="employee-1">Employee 1</SelectItem>
                                            <SelectItem value="employee-2">Employee 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Comments</Label>
                                    <Textarea
                                        placeholder="[Enter receipt notes]"
                                        className="resize-none h-20 text-xs"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Private Comments</Label>
                                    <Textarea
                                        placeholder="[Enter internal notes]"
                                        className="resize-none h-20 text-xs"
                                        value={privateComments}
                                        onChange={(e) => setPrivateComments(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Side Summary */}
                        <div className="col-span-12 md:col-span-5 border shadow-sm rounded-md p-4 h-full flex flex-col justify-end">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                                    <span>Total:</span>
                                    <span>₱{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t">
                    <div className="flex gap-2 w-full justify-end">
                        <div className="flex rounded-md shadow-sm">
                            <Button className="rounded-r-none">Record Cash</Button>
                            <Button variant="outline" size="icon" className="rounded-l-none border-l-0 w-8 px-0">
                                <span className="sr-only">Open options</span>
                                <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </Button>
                        </div>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="secondary">Help</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
