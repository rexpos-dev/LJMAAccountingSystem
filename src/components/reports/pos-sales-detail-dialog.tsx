'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhilippinePeso, ShoppingCart, Package, AlertTriangle, Hash } from 'lucide-react';

interface PosStats {
    totalRevenueAllTime: number;
    totalRevenueMonth: number;
    totalSalesMonth: number;
    productsSoldMonth: number;
    lowStockItems: number;
    totalItems: number;
}

export default function PosSalesDetailDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const [stats, setStats] = useState<PosStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!openDialogs['pos-sales-detail']) return;
            setLoading(true);
            setError(null);
            try {
                console.log('Fetching POS stats from proxy...');

                const response = await fetch('/api/pos/stats', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    console.error('Response not OK:', response.status, response.statusText);
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                console.log('POS Stats raw data received:', data);

                if (data && data.summary) {
                    setStats(data.summary);
                } else if (data && data.totalRevenueAllTime !== undefined) {
                    // Just in case it returns the object directly without a summary wrapper
                    setStats(data as PosStats);
                } else {
                    console.warn('Unexpected data format:', data);
                    throw new Error('Received unexpected data format from server');
                }
            } catch (err: any) {
                console.error('Error fetching POS stats:', err);

                // Provide more helpful error messages
                if (err instanceof TypeError && err.message === 'Failed to fetch') {
                    setError('Unable to connect to the POS server. Please ensure the server (192.168.1.163) is running and accessible on the network, and that CORS is configured correctly.');
                } else {
                    setError(err.message || 'Failed to fetch data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [openDialogs['pos-sales-detail']]);

    return (
        <Dialog open={openDialogs['pos-sales-detail'] || false} onOpenChange={() => closeDialog('pos-sales-detail' as any)}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-white dark:bg-slate-950 z-10">
                    <DialogTitle className="text-2xl font-bold">POS Sales Detail Dashboard</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900 border-t">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full text-red-500 font-medium bg-red-50 dark:bg-red-950/20 p-4 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    ) : stats ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-8">
                            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg overflow-hidden relative border-0">
                                <div className="absolute right-0 top-0 opacity-10 p-4">
                                    <PhilippinePeso size={100} />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-indigo-100 tracking-wide uppercase">
                                        Total Revenue (All Time)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">₱{stats.totalRevenueAllTime.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <p className="text-xs text-indigo-100 mt-2 font-medium">Lifetime total sales limit</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg overflow-hidden relative border-0">
                                <div className="absolute right-0 top-0 opacity-10 p-4">
                                    <PhilippinePeso size={100} />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-emerald-100 tracking-wide uppercase">
                                        Revenue (This Month)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">₱{stats.totalRevenueMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <p className="text-xs text-emerald-100 mt-2 font-medium">Total revenue generated this month</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg overflow-hidden relative border-0">
                                <div className="absolute right-0 top-0 opacity-10 p-4">
                                    <ShoppingCart size={100} />
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-blue-100 tracking-wide uppercase">
                                        Sales Count (This Month)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stats.totalSalesMonth.toLocaleString()}</div>
                                    <p className="text-xs text-blue-100 mt-2 font-medium">Total transactions completed</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-slate-800 shadow-md border-0 ring-1 ring-slate-100 dark:ring-slate-700">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                                        Products Sold (This Month)
                                    </CardTitle>
                                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                                        <Package className="h-5 w-5 md:h-6 md:w-6 text-blue-500 dark:text-blue-400" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.productsSoldMonth.toLocaleString()}</div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Total units moved</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-slate-800 shadow-md border-0 ring-1 ring-slate-100 dark:ring-slate-700 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
                                    <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                                        Low Stock Items
                                    </CardTitle>
                                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-amber-500 dark:text-amber-400" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pl-6">
                                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.lowStockItems.toLocaleString()}</div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Items requiring restock</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-slate-800 shadow-md border-0 ring-1 ring-slate-100 dark:ring-slate-700">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                                        Total Products Catalog
                                    </CardTitle>
                                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                                        <Hash className="h-5 w-5 md:h-6 md:w-6 text-purple-500 dark:text-purple-400" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.totalItems.toLocaleString()}</div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Distinct items in inventory</p>
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
