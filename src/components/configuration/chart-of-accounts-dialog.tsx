'use client';

import { useState, useMemo, Fragment, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search, RefreshCw, Undo, Upload, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
    MenubarShortcut,
} from '@/components/ui/menubar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAccounts } from '@/hooks/use-accounts';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function ChartOfAccountsDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const { data: accounts, isLoading, refetch } = useAccounts();
    const { toast } = useToast();

    const [searchName, setSearchName] = useState('');
    const [searchNumber, setSearchNumber] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

    const handleRowClick = (account: any) => {
        setSelectedAccount(account);
    }

    const handleRowDoubleClick = (account: any) => {
        setDialogData('edit-account' as any, account);
        openDialog('edit-account' as any);
    };

    const handleEditClick = () => {
        if (selectedAccount) {
            setDialogData('edit-account' as any, selectedAccount);
            openDialog('edit-account' as any);
        }
    };

    const handleDeleteClick = () => {
        if (selectedAccount) {
            setDialogData('delete-account' as any, selectedAccount);
            openDialog('delete-account' as any);
        }
    };

    const [showDeleted, setShowDeleted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, searchNumber, showDeleted]);

    // Group accounts by category (Asset, Liability, Equity, Income, Cost of Sales, Expense)
    const groupedAccounts = useMemo(() => {
        if (!accounts) return [];

        let processedAccounts = accounts;

        // Helper to check if string matches search
        const matches = (text: string, search: string) => text.toLowerCase().includes(search.toLowerCase());

        // Filter first
        if (searchName || searchNumber || !showDeleted) {
            processedAccounts = processedAccounts.filter(account => {
                const nameMatch = !searchName || matches(account.account_name, searchName);
                const numberMatch = !searchNumber || (account.account_no?.toString().includes(searchNumber) ?? true);
                // Assumption: 'showDeleted' not fully implemented in backend yet, but UI toggle is here.
                // If backend sends 'deleted' flag, usage: !account.deleted || showDeleted
                return nameMatch && numberMatch;
            });
        }

        const groups: { [key: string]: typeof accounts } = {};

        // Pre-define order if needed, or dynamic. Page used dynamic.
        processedAccounts.forEach(account => {
            const category = account.account_category || 'Uncategorized';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(account);
        });

        // Sort accounts within groups by number
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => (a.account_no || 0) - (b.account_no || 0));
        });

        return Object.entries(groups).map(([category, groupAccounts]) => ({
            category,
            accounts: groupAccounts,
            totalBalance: groupAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0),
        })).sort((a, b) => {
            const minQA = Math.min(...a.accounts.map(acc => acc.account_no || 0));
            const minQB = Math.min(...b.accounts.map(acc => acc.account_no || 0));
            return minQA - minQB;
        });

    }, [accounts, searchName, searchNumber, showDeleted]);

    const flattenedList = useMemo(() => {
        const list: any[] = [];
        groupedAccounts.forEach(group => {
            list.push({ isHeader: true, category: group.category, totalBalance: group.totalBalance, id: `header-${group.category}` });
            group.accounts.forEach(account => {
                list.push({ isHeader: false, ...account });
            });
        });
        return list;
    }, [groupedAccounts]);

    const totalPages = Math.max(1, Math.ceil(flattenedList.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedList = flattenedList.slice(startIndex, startIndex + itemsPerPage);

    const formatCurrency = (amount?: number | null) => {
        if (amount === undefined || amount === null) return '₱0.00';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <Dialog open={openDialogs['chart-of-accounts']} onOpenChange={() => closeDialog('chart-of-accounts')}>
            <DialogContent className="max-w-[95vw] w-[1450px] h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Premium Operational Header */}
                <div className="px-10 py-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="p-4 rounded-[2rem] bg-primary/20 text-primary border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                            <Plus className="h-8 w-8" />
                        </div>
                        <div>
                            <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">Fiscal Architecture</DialogTitle>
                            <div className="flex items-center gap-3 mt-3">
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-black">Core Ledger</span>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">Institutional Account Matrix</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Real-time Sync</span>
                        </div>
                        <button 
                            onClick={() => closeDialog('chart-of-accounts')}
                            className="p-3 rounded-2xl hover:bg-white/10 text-white/40 hover:text-white transition-all group"
                        >
                            <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Advanced Control Interface */}
                <div className="flex-shrink-0 px-10 py-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={() => openDialog('new-account' as any)}
                            className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl px-8 shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            <Plus className="h-5 w-5 mr-2 stroke-[3]" />
                            Initialize Account
                        </Button>
                        <div className="w-px h-8 bg-white/10 mx-2" />
                        <Button 
                            variant="outline" 
                            disabled={!selectedAccount}
                            onClick={handleEditClick}
                            className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl px-6 gap-2 disabled:opacity-20 transition-all"
                        >
                            <Pencil className="h-4 w-4" />
                            Refine
                        </Button>
                        <Button 
                            variant="outline" 
                            disabled={!selectedAccount}
                            onClick={handleDeleteClick}
                            className="border-white/10 bg-white/5 text-red-400/60 hover:bg-red-400/10 hover:text-red-400 font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl px-6 gap-2 disabled:opacity-20 transition-all"
                        >
                            <Trash2 className="h-4 w-4" />
                            Purge
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => openDialog('bulk-upload-accounts' as any)}
                            className="border-white/10 bg-white/5 text-blue-400/60 hover:bg-blue-400/10 hover:text-blue-400 font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl px-6 gap-2 transition-all"
                        >
                            <Upload className="h-4 w-4" />
                            Matrix Ingest
                        </Button>
                    </div>

                    <div className="flex-1 flex gap-4 max-w-2xl ml-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <Input
                                placeholder="Filter by Node ID..."
                                value={searchNumber}
                                onChange={(e) => setSearchNumber(e.target.value)}
                                className="pl-12 h-12 bg-white/5 border-white/10 text-white rounded-2xl font-mono text-xs focus:ring-primary/20 placeholder:text-white/10"
                            />
                        </div>
                        <div className="relative flex-[1.5]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <Input
                                placeholder="Filter by Account Identity..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="pl-12 h-12 bg-white/5 border-white/10 text-white rounded-2xl font-bold uppercase tracking-wider text-xs focus:ring-primary/20 placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => refetch()}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
                    </button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col p-10 bg-black/20">
                    {/* View Parameters */}
                    <div className="flex items-center justify-between mb-6 px-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Label htmlFor="account-digits" className="text-[10px] font-black uppercase tracking-widest text-white/40">Node Precision:</Label>
                                <Input id="account-digits" type="number" defaultValue="4" className="w-20 h-10 bg-white/5 border-white/10 text-white rounded-xl text-center font-black" />
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center space-x-3">
                                <Checkbox 
                                    id="show-deleted" 
                                    checked={showDeleted} 
                                    onCheckedChange={(c) => setShowDeleted(!!c)} 
                                    className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                                />
                                <Label htmlFor="show-deleted" className="text-[10px] font-black uppercase tracking-widest text-white/40 cursor-pointer">Archive Visibility Enabled</Label>
                            </div>
                        </div>
                    </div>

                    {/* Matrix Viewport */}
                    <div className="flex-1 flex flex-col min-h-0 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full border-separate border-spacing-0">
                                <thead className="sticky top-0 z-30">
                                    <tr className="bg-slate-900/90 backdrop-blur-md">
                                        <th className="h-16 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5">Serial</th>
                                        <th className="h-16 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5">Identity</th>
                                        <th className="h-16 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5">Logic Def</th>
                                        <th className="h-16 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5">Origin</th>
                                        <th className="h-16 px-8 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5 text-center">Protocol</th>
                                        <th className="h-16 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/40 border-b border-white/5 pr-10">Valuation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="h-96 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-20">
                                                    <RefreshCw className="h-12 w-12 animate-spin text-primary" />
                                                    <span className="text-xs font-black uppercase tracking-[0.3em]">Synchronizing Matrix...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : flattenedList.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="h-96 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-10">
                                                    <Search className="h-20 w-20" />
                                                    <span className="text-sm font-black uppercase tracking-[0.4em]">Zero Results Identified</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedList.map((item) => (
                                            item.isHeader ? (
                                                <tr key={item.id} className="bg-white/5 hover:bg-white/10 transition-colors border-b border-white/5">
                                                    <td className="px-8 py-6"></td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                                            <span className="text-sm font-black uppercase tracking-[0.2em] text-white">{item.category}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6" colSpan={3}></td>
                                                    <td className="px-8 py-6 text-right pr-10">
                                                        <span className="text-sm font-black italic tracking-tighter text-white">{formatCurrency(item.totalBalance)}</span>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr 
                                                    key={item.id} 
                                                    onClick={() => handleRowClick(item)} 
                                                    onDoubleClick={() => handleRowDoubleClick(item)}
                                                    className={cn(
                                                        "cursor-pointer transition-all duration-300 group relative",
                                                        selectedAccount?.id === item.id ? "bg-primary/10" : "hover:bg-white/[0.02]",
                                                        item.header === 'Yes' && "bg-white/[0.01]"
                                                    )}
                                                >
                                                    <td className="px-8 py-5">
                                                        <span className="font-mono text-xs font-black tracking-tighter text-white/40 group-hover:text-primary transition-colors">
                                                            {item.account_no}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className={cn(
                                                                "text-sm font-black uppercase italic tracking-tight transition-all group-hover:translate-x-1",
                                                                item.header === 'Yes' ? "text-primary" : "text-white"
                                                            )}>
                                                                {item.account_name}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                                                                {item.account_type || "Generic Node"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider line-clamp-1 max-w-[200px]">
                                                            {item.account_description || "NULL DEF"}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                            {item.date_created ? new Date(item.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'EST. PHASE'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex justify-center">
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                                                item.account_status === 'Active' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                                                            )}>
                                                                {item.account_status || 'Active'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right pr-10">
                                                        <span className="text-sm font-black italic tracking-tighter text-white group-hover:scale-110 transition-transform inline-block">
                                                            {formatCurrency(item.balance)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* High-Tech Pagination */}
                        <div className="px-10 py-6 border-t border-white/5 bg-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                    Showing <span className="text-white">{startIndex + 1}</span> - <span className="text-white">{Math.min(startIndex + itemsPerPage, flattenedList.length)}</span> of <span className="text-primary">{flattenedList.length}</span> Matrix Nodes
                                </div>
                                <div className="w-px h-6 bg-white/10" />
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Page Size</span>
                                    <Select value={itemsPerPage.toString()} onValueChange={(val: string) => { setItemsPerPage(Number(val)); setCurrentPage(1); }}>
                                        <SelectTrigger className="h-8 w-20 bg-white/5 border-white/10 rounded-xl text-[10px] font-black text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            {[10, 20, 50, 100].map((size) => (
                                                <SelectItem key={size} value={size.toString()} className="text-[10px] font-black uppercase">{size}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mr-4">
                                    Cycle <span className="text-primary">{currentPage}</span> / {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-10 transition-all active:scale-90"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage >= totalPages}
                                        className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-10 transition-all active:scale-90"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
