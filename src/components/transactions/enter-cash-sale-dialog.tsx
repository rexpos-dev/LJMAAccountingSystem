"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from "@/lib/utils";
import { useDialog } from '@/components/layout/dialog-context';
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
import { 
    Trash2, 
    Check, 
    ChevronsUpDown, 
    X, 
    ShoppingCart, 
    CreditCard, 
    Building2, 
    User, 
    ShieldCheck, 
    Plus, 
    Activity, 
    Calculator,
    ArrowUpRight,
    Save,
    ChevronDown
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExternalProducts } from '@/hooks/use-products';
import { useBankAccounts } from '@/hooks/use-accounts';

interface SalesItemRow {
    id: string;
    qty: number;
    itemId: string;
    description: string;
    unitPrice: number;
    tax: string;
    total: number;
}

interface ItemComboboxProps {
    value: string;
    products: any[];
    onChange: (value: string) => void;
}

function ItemCombobox({ value, products, onChange }: ItemComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((product) =>
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between px-3 bg-foreground/5 border-foreground/10 text-foreground hover:bg-foreground/10 transition-all rounded-xl text-xs font-bold uppercase" >
                    {value
                        ? products.find((product) => product.sku === value)?.sku || value
                        : <span className="text-foreground/20">Select Item Code...</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-card border-foreground/10 shadow-2xl backdrop-blur-xl" align="start">
                <div className="flex flex-col p-2">
                    <div className="flex items-center px-3 mb-2">
                        <Input placeholder="Filter node identification..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="h-10 bg-foreground/5 border-foreground/10 text-foreground text-xs placeholder:text-foreground/20 focus-visible:ring-0"
                        />
                    </div>
                    <ScrollArea className="h-72">
                        <div className="space-y-1 pr-4">
                            {filteredProducts.length === 0 ? (
                                <div className="py-6 text-center text-[10px] font-black uppercase tracking-widest text-foreground/20">No matching nodes</div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.sku}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-xs outline-none hover:bg-emerald-400 hover:text-black transition-all group",
                                            value === product.sku ? "bg-emerald-400/20 text-emerald-400" : "text-foreground/60"
                                        )}
                                        onClick={() => {
                                            onChange(product.sku);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-black uppercase tracking-widest">{product.sku}</span>
                                            <span className={cn(
                                                "text-[10px] font-bold opacity-60 truncate max-w-[220px]",
                                                value === product.sku ? "text-emerald-400" : "text-foreground/40"
                                            )}>{product.name}</span>
                                        </div>
                                        {value === product.sku && <Check className="ml-auto h-4 w-4" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default function EnterCashSaleDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const [depositToAccount, setDepositToAccount] = useState<string>('Checking Account');
    const [salesperson, setSalesperson] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [privateComments, setPrivateComments] = useState<string>('');
    const [items, setItems] = useState<SalesItemRow[]>([]);

    const { externalProducts } = useExternalProducts(1, 100, '', '', '');
    const { accounts: bankAccounts } = useBankAccounts();

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
        if (items.length === 1) {
            setItems(prev => prev.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        itemId: '',
                        description: '',
                        unitPrice: 0,
                        tax: 'None',
                        total: 0,
                        qty: 1
                    };
                }
                return item;
            }));
            return;
        }
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

    const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.total, 0), [items]);
    const total = subtotal;

    return (
        <Dialog open={openDialogs['enter-cash-sale']} onOpenChange={(open) => !open && closeDialog('enter-cash-sale')}>
            <DialogContent className="max-w-6xl p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
                {/* Premium Header */}
                <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-400/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-400/20 text-emerald-400 border border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground leading-none">Point of Sale Protocol</DialogTitle>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-400 border border-emerald-400/20">Instant Settlement</span>
                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Transaction Module v2.4</span>
                            </div>
                        </div>
                    </div>

                    
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1">
                        <div className="p-8 space-y-8">
                            {/* Summary Matrix */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-400">
                                        <Calculator className="h-10 w-10" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Settlement Total</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs font-bold text-emerald-400/60 uppercase">PHP</span>
                                        <span className="text-3xl font-black italic tracking-tighter text-emerald-400">{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-400">
                                        <Activity className="h-10 w-10" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Active Nodes</p>
                                    <span className="text-3xl font-black italic tracking-tighter text-blue-400">{items.filter(i => i.itemId).length} / {items.length}</span>
                                </div>

                                <div className="md:col-span-2 bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Sales Intelligence</p>
                                        <p className="text-xs font-bold text-foreground uppercase italic tracking-tight opacity-60">Revenue capture from direct retail channels.</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-foreground/5 border border-foreground/10">
                                        <ShieldCheck className="h-6 w-6 text-emerald-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Main Matrix Table */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Item Allocation Matrix</h3>
                                    </div>
                                    <Button onClick={addItemRow} variant="outline" className="rounded-xl bg-emerald-400/10 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all gap-2" >
                                        <Plus className="h-4 w-4" />
                                        <span className="font-black uppercase tracking-widest text-[10px]">Initialize Node</span>
                                    </Button>
                                </div>

                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                                    <Table>
                                        <TableHeader className="bg-foreground/5">
                                            <TableRow className="border-foreground/5 hover:bg-transparent">
                                                <TableHead className="w-24 text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">QTY</TableHead>
                                                <TableHead className="w-64 text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Item Code</TableHead>
                                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Description Particulars</TableHead>
                                                <TableHead className="w-32 text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right">Unit Value</TableHead>
                                                <TableHead className="w-40 text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right">Node Total</TableHead>
                                                <TableHead className="w-16"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item) => (
                                                <TableRow key={item.id} className="border-foreground/5 hover:bg-foreground/[0.02] group transition-colors">
                                                    <TableCell className="">
                                                        <Input type="number" className="bg-transparent border-0 shadow-none text-foreground font-black italic focus:ring-0 text-sm" value={item.qty} onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                                                            min={1}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="">
                                                        <ItemCombobox
                                                            value={item.itemId}
                                                            products={externalProducts}
                                                            onChange={(val) => handleItemChange(item.id, val)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="">
                                                        <div className="h-8 flex items-center px-3 border-0 bg-transparent text-foreground/60 text-xs font-bold uppercase italic tracking-tight truncate">
                                                            {item.description || "Awaiting Identification..."}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="font-mono text-xs text-foreground/40">₱{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="font-black text-sm text-emerald-400 italic">₱{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                    </TableCell>
                                                    <TableCell className="text-center pr-6">
                                                        <button
                                                            className="p-2 text-foreground/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                            onClick={() => removeItemRow(item.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Secondary Information */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-blue-400 rounded-full" />
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Capture Parameters</h3>
                                    </div>
                                    <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Deposit Channel</Label>
                                            <Select value={depositToAccount} onValueChange={setDepositToAccount}>
                                                <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                    {bankAccounts.map(account => (
                                                        <SelectItem key={account.id} value={account.account_name} className="text-xs font-bold uppercase">
                                                            {account.account_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Assigned Agent</Label>
                                            <Select value={salesperson} onValueChange={setSalesperson}>
                                                <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase">
                                                    <SelectValue placeholder="Identify Operative" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                    <SelectItem value="employee-1" className="text-xs font-bold uppercase">Operative 1</SelectItem>
                                                    <SelectItem value="employee-2" className="text-xs font-bold uppercase">Operative 2</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-amber-400 rounded-full" />
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Journal Commentary</h3>
                                    </div>
                                    <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Public Particulars</Label>
                                            <Textarea placeholder="[Internal receipt notes...]" className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl min-h-[68px] resize-none text-xs placeholder:text-foreground/10" value={comments} onChange={(e) => setComments(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Audit Intelligence (Private)</Label>
                                            <Textarea placeholder="[Internal risk assessment notes...]" className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl min-h-[68px] resize-none text-xs placeholder:text-foreground/10" value={privateComments} onChange={(e) => setPrivateComments(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Action Footer */}
                    <div className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Protocol Validation</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        total > 0 ? "bg-emerald-400 animate-pulse" : "bg-foreground/10"
                                    )} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
                                        {total > 0 ? "Matrix Verified" : "Awaiting Nodes"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Aggregate Value</span>
                                <span className="text-2xl font-black italic tracking-tighter text-emerald-400">
                                    ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="outline" onClick={() => closeDialog('enter-cash-sale')}
                                className="px-6 h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px]"
                            >
                                Abort Sale
                            </Button>
                            
                            <div className="flex rounded-xl overflow-hidden shadow-lg shadow-emerald-400/20">
                                <Button className="px-8 rounded-none bg-emerald-400 hover:bg-emerald-400/90 text-black font-black uppercase tracking-widest text-[10px] transition-all gap-2" >
                                    <Save className="h-4 w-4" />
                                    Record Protocol
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="w-10 rounded-none border-0 bg-emerald-500 hover:bg-emerald-600 text-black border-l border-black/10">
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-card border-foreground/10 text-foreground">
                                        <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest focus:bg-emerald-400 focus:text-black">Record Credit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest focus:bg-emerald-400 focus:text-black">Record Invoice</DropdownMenuItem>
                                        <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest focus:bg-emerald-400 focus:text-black">Record Check</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}
