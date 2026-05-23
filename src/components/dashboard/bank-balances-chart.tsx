"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useBankingStats } from "@/hooks/use-banking-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";

export function BankBalancesChart() {
    const { data, isLoading } = useBankingStats();

    if (isLoading) {
        return (
            <Card className="col-span-1 lg:col-span-4 overflow-hidden border border-foreground/10 bg-foreground/5">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                </CardContent>
            </Card>
        );
    }

    const chartData = data?.bankWiseBalances || [];

    if (!chartData.length) {
        return (
            <Card className="col-span-1 lg:col-span-4 overflow-hidden border border-foreground/10 bg-foreground/5">
                <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 to-violet-500 opacity-60" />
                <CardHeader>
                    <CardTitle className="font-headline text-foreground flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        Bank-wise Balances
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Current balance distribution across all banks</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground italic text-sm">
                    No bank account data available.
                </CardContent>
            </Card>
        );
    }

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#0ea5e9', '#14b8a6'];

    return (
        <Card className="col-span-1 lg:col-span-4 overflow-hidden border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent backdrop-blur-sm shadow-sm hover:shadow transition-all">
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 to-violet-500 opacity-60" />
            <CardHeader className="pt-5">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-foreground">Bank-wise Balances</CardTitle>
                        <CardDescription className="text-muted-foreground">Liquidity distribution by bank account</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                                dx={-5}
                            />
                            <Tooltip
                                cursor={{ fill: '#ffffff', opacity: 0.04 }}
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #1e293b',
                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
                                    color: '#f1f5f9',
                                    fontSize: '12px',
                                    padding: '10px 14px',
                                }}
                                formatter={(value: number) => [
                                    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(value),
                                    'Balance'
                                ]}
                            />
                            <Bar dataKey="balance" radius={[8, 8, 0, 0]} maxBarSize={56}>
                                {chartData.map((_: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
