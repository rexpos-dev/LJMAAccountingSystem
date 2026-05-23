'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDialog } from '@/components/layout/dialog-context';
import { useExternalProducts, ExternalProduct } from '@/hooks/use-products';
import { 
  Search, 
  Filter, 
  CalendarIcon, 
  Plus, 
  X, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import format from '@/lib/date-format';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/providers/auth-provider';

export default function InventoryDialog() {
  const { openDialogs, closeDialog, openDialog } = useDialog();
  const { toast } = useToast();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<Record<string, string>>({});

  const isAuditor = user?.accountType === 'Auditor';

  const { externalProducts, isLoading, error, pagination, refreshExternalProducts } = useExternalProducts(
    currentPage,
    pageSize,
    search,
    filterBy,
    filterValue
  );

  // Calculate summary totals
  const summaryTotals = externalProducts.reduce(
    (totals, product) => {
      const cost = product.cost ? parseFloat(product.cost.toString()) : 0;
      const price = parseFloat(product.price.toString());
      const stock = parseInt(product.stock.toString()) || 0;

      return {
        itemCount: totals.itemCount + 1,
        totalCosts: totals.totalCosts + (cost * stock),
        totalProfit: totals.totalProfit + ((price - cost) * stock),
      };
    },
    { itemCount: 0, totalCosts: 0, totalProfit: 0 }
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  const applyFilters = () => {
    // Validate that both filterBy and filterValue are supplied
    if (!filterBy) {
      toast({
        title: 'Filter Validation',
        description: 'Please select a filter type (Filter By)',
        variant: 'destructive',
      });
      return;
    }

    if (!filterValue && filterBy !== 'date') {
      toast({
        title: 'Filter Validation',
        description: 'Please enter a filter value',
        variant: 'destructive',
      });
      return;
    }

    if (filterBy === 'date' && !filterDate) {
      toast({
        title: 'Filter Validation',
        description: 'Please select a date for filtering',
        variant: 'destructive',
      });
      return;
    }

    setCurrentPage(1); // Reset to first page when applying filters
    refreshExternalProducts();

    toast({
      title: 'Filters Applied',
      description: `Filtered by ${filterBy}: ${filterBy === 'date' ? format(filterDate!, 'MM/dd/yyyy') : filterValue}`,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setFilterBy('');
    setFilterValue('');
    setFilterDate(undefined);
    setCurrentPage(1); // Reset to first page when clearing filters
    refreshExternalProducts();
  };

    return (
        <Dialog open={openDialogs['inventory']} onOpenChange={() => closeDialog('inventory')}>
            <DialogContent variant="top-drawer" className="max-w-[95vw] w-[1450px] h-[92vh] flex flex-col p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-auto">
                {/* Premium Operational Header */}
                <div className="px-10 py-8 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="p-4 rounded-[2rem] bg-primary/20 text-primary border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                            <Filter className="h-8 w-8" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none text-foreground">Logistics Matrix</DialogTitle>
                            <div className="flex items-center gap-3 mt-3">
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-black">Inventory Core</span>
                                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.3em]">Stock Intelligence Network</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-foreground/5 border border-foreground/10">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Active Monitoring</span>
                        </div>
                        
                    </div>
                </div>

                {/* Advanced Control Interface */}
                <div className="flex-shrink-0 px-10 py-4 bg-foreground/[0.02] border-b border-foreground/5 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        {!isAuditor && (
                            <Button onClick={() => openDialog('add-product' as any)}
                                className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl px-8 shadow-xl shadow-primary/20 transition-all active:scale-95"
                            >
                                <Plus className="h-5 w-5 mr-2 stroke-[3]" />
                                Deploy Product
                            </Button>
                        )}
                        <div className="w-px h-8 bg-foreground/10 mx-2" />
                    </div>

                    {/* Filters Container */}
                    <div className="flex-1 flex flex-wrap items-center gap-4">
                        <div className="relative flex-[1.5]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                            <Input placeholder="Search by ID or Identity..." value={search} onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 h-12 bg-foreground/5 border-foreground/10 text-foreground rounded-2xl font-bold uppercase tracking-wider text-xs focus:ring-primary/20 placeholder:text-foreground/10"
                            />
                        </div>

                        <div className="w-48">
                            <Select value={filterBy} onValueChange={setFilterBy}>
                                <SelectTrigger className=" bg-foreground/5 border-foreground/10 rounded-2xl text-[10px] font-black uppercase text-foreground/60">
                                    <SelectValue placeholder="Protocol" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-foreground/10 text-foreground">
                                    <SelectItem value="date" className="text-[10px] font-black uppercase">Temporal</SelectItem>
                                    <SelectItem value="productName" className="text-[10px] font-black uppercase">Identity</SelectItem>
                                    <SelectItem value="category" className="text-[10px] font-black uppercase">Category</SelectItem>
                                    <SelectItem value="code" className="text-[10px] font-black uppercase">Serial</SelectItem>
                                    <SelectItem value="salesOrder" className="text-[10px] font-black uppercase">Directive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-48">
                            {filterBy === 'date' ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={'outline'} className={cn( ' w-full justify-start text-left font-black uppercase tracking-widest text-[10px] bg-foreground/5 border-foreground/10 rounded-2xl', !filterDate && 'text-foreground/20' )} >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filterDate ? format(filterDate, 'MM/dd/yyyy') : <span>Temporal Lock</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-card border-foreground/10 shadow-2xl">
                                        <Calendar
                                            mode="single"
                                            selected={filterDate}
                                            onSelect={(date) => {
                                                setFilterDate(date);
                                                setFilterValue(date ? format(date, 'yyyy-MM-dd') : '');
                                            }}
                                            initialFocus
                                            className="text-foreground"
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Input placeholder="Matrix Value..." value={filterValue} onChange={(e) => setFilterValue(e.target.value)}
                                    disabled={!filterBy}
                                    className="h-12 bg-foreground/5 border-foreground/10 text-foreground rounded-2xl font-black uppercase tracking-widest text-[10px] focus:ring-primary/20 placeholder:text-foreground/10 disabled:opacity-20"
                                />
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={applyFilters} variant="outline" className="border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-black font-black uppercase tracking-widest text-[10px] rounded-2xl px-6 transition-all shadow-xl shadow-primary/5" >
                                <Filter className="h-4 w-4 mr-2" />
                                Apply
                            </Button>
                            <Button onClick={clearFilters} variant="outline" className="border-foreground/10 bg-foreground/5 text-foreground/40 hover:bg-foreground/10 hover:text-foreground font-black uppercase tracking-widest text-[10px] rounded-2xl px-6 transition-all" >
                                Clear
                            </Button>
                        </div>
                    </div>

                    <button 
                        onClick={() => refreshExternalProducts()}
                        className="p-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground/40 hover:text-foreground transition-all shadow-xl active:scale-95"
                    >
                        <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
                    </button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col p-10 bg-black/20">
                    {/* Matrix Viewport */}
                    <div className="flex-1 flex flex-col min-h-0 bg-foreground/5 border border-foreground/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full border-separate border-spacing-0">
                                <thead className="sticky top-0 z-30">
                                    <tr className="bg-card/90 backdrop-blur-md">
                                        <th className="h-10 px-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/5">Signal</th>
                                        <th className="h-10 px-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/5">Serial</th>
                                        <th className="h-10 px-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/5">Identity</th>
                                        <th className="h-10 px-4 text-left text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/5">Category</th>
                                        <th className="h-10 px-4 text-right text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/5">Price Point</th>
                                        <th className="h-10 px-4 text-right text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/5">Unit Cost</th>
                                        <th className="h-10 px-4 text-right text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/5">Stock Level</th>
                                        <th className="h-10 px-4 text-center text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 border-b border-foreground/5 pr-6">Command</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={8} className="h-96 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-20">
                                                    <RefreshCw className="h-12 w-12 animate-spin text-primary" />
                                                    <span className="text-xs font-black uppercase tracking-[0.3em]">Synchronizing Logistics...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={8} className="h-96 text-center">
                                                <div className="flex flex-col items-center gap-4 text-red-500/60">
                                                    <X className="h-12 w-12 opacity-50" />
                                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Transmission Error Detected</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : externalProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="h-96 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-10">
                                                    <Search className="h-20 w-20" />
                                                    <span className="text-sm font-black uppercase tracking-[0.4em]">Zero Assets Identified</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        externalProducts.map((product, index) => (
                                            <tr 
                                                key={`${product.sku}-${index}`}
                                                onClick={() => setSelectedProducts(product.sku)}
                                                className={cn(
                                                    "cursor-pointer transition-all duration-300 group relative",
                                                    selectedProducts === product.sku ? "bg-primary/10" : "hover:bg-foreground/[0.02]"
                                                )}
                                            >
                                                <td className="px-4">
                                                    <div className="flex justify-center">
                                                        <div className={cn(
                                                            "w-3 h-3 rounded-[4px] border transition-all flex items-center justify-center",
                                                            selectedProducts === product.sku ? "border-primary bg-primary text-black" : "border-foreground/10 bg-foreground/5"
                                                        )}>
                                                            {selectedProducts === product.sku && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4">
                                                    <span className="font-mono text-[10px] font-black tracking-tighter text-foreground/40 group-hover:text-primary transition-colors">
                                                        {product.sku}
                                                    </span>
                                                </td>
                                                <td className="px-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black uppercase italic tracking-tight text-foreground group-hover:translate-x-1 transition-transform">
                                                            {product.name}
                                                        </span>
                                                        <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-[0.2em]">
                                                            {product.brand || "UNBRANDED ASSET"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4">
                                                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-foreground/5 bg-foreground/5 text-foreground/40">
                                                        {product.category || "UNCLASSIFIED"}
                                                    </span>
                                                </td>
                                                <td className="px-4 text-right">
                                                    <span className="text-xs font-black italic tracking-tighter text-primary">
                                                        ₱{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="px-4 text-right">
                                                    <span className="text-xs font-black italic tracking-tighter text-foreground/40">
                                                        ₱{product.cost ? Number(product.cost).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className={cn(
                                                            "text-xs font-black tracking-tighter",
                                                            product.stock <= 5 ? "text-red-400" : "text-foreground"
                                                        )}>
                                                            {product.stock.toLocaleString()}
                                                        </span>
                                                        {product.stock <= 5 && (
                                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500/60 animate-pulse">Critical Level</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 pr-6">
                                                    <div className="flex justify-center">
                                                        <Select
                                                            value={selectedActions[product.sku] || ''}
                                                            onValueChange={(value) => setSelectedActions(prev => ({ ...prev, [product.sku]: value }))}
                                                        >
                                                            <SelectTrigger className="h-7 w-24 bg-foreground/5 border-foreground/10 rounded-lg text-[9px] font-black uppercase text-foreground/60 hover:border-primary/20 transition-all">
                                                                <SelectValue placeholder="Protocol" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                                {!isAuditor && <SelectItem value="edit" className="text-[9px] font-black uppercase">Refine</SelectItem>}
                                                                <SelectItem value="view" className="text-[9px] font-black uppercase">Analyze</SelectItem>
                                                                {!isAuditor && <SelectItem value="update" className="text-[9px] font-black uppercase">Calibrate</SelectItem>}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* High-Tech Pagination */}
                        {pagination && (
                            <div className="px-10 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
                                <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">
                                    Showing <span className="text-foreground">{pagination.offset + 1}</span> - <span className="text-foreground">{Math.min(pagination.offset + externalProducts.length, pagination.total)}</span> of <span className="text-primary">{pagination.total}</span> Assets
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] mr-4">
                                        Cycle <span className="text-primary">{currentPage}</span> / {Math.ceil(pagination.total / pagination.limit)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="h-10 w-10 rounded-xl border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-foreground disabled:opacity-10 transition-all active:scale-90"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => prev + 1)}
                                            disabled={!pagination.hasMore}
                                            className="h-10 w-10 rounded-xl border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-foreground disabled:opacity-10 transition-all active:scale-90"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Premium Summary Intelligence */}
                    {!isLoading && externalProducts.length > 0 && (
                        <div className="mt-8 grid grid-cols-3 gap-8">
                            <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                                <div className="relative z-10">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-2">Asset Quantification</div>
                                    <div className="text-4xl font-black italic tracking-tighter text-foreground">{summaryTotals.itemCount.toLocaleString()}</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Total Managed SKU</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-500/10 transition-colors" />
                                <div className="relative z-10">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-2">Cumulative Exposure</div>
                                    <div className="text-4xl font-black italic tracking-tighter text-orange-500">₱{summaryTotals.totalCosts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Aggregate Cost Basis</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                                <div className="relative z-10">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-2">Projected Yield</div>
                                    <div className="text-4xl font-black italic tracking-tighter text-emerald-500">₱{summaryTotals.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Institutional Profit Margin</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
