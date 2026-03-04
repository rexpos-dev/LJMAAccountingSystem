"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useBankingStats } from "@/hooks/use-banking-stats";
import { Skeleton } from "@/components/ui/skeleton";

export function BankBalancesChart() {
    const { data, isLoading } = useBankingStats();

    if (isLoading) {
        return (
            <Card className="col-span-1 lg:col-span-4 h-[400px]">
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
            <Card className="col-span-1 lg:col-span-4 h-[400px]">
                <CardHeader>
                    <CardTitle className="font-headline text-white">Bank-wise Balances</CardTitle>
                    <CardDescription>Current balance distribution across all banks</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground italic">
                    No bank account data available.
                </CardContent>
            </Card>
        );
    }

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#0ea5e9', '#14b8a6'];

    return (
        <Card className="col-span-1 lg:col-span-4 border-none bg-white/5 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline text-white">Bank-wise Balances</CardTitle>
                <CardDescription className="text-slate-400">Liquidity distribution by bank account</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                                dx={-10}
                            />
                            <Tooltip
                                cursor={{ fill: '#ffffff', opacity: 0.05 }}
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #334155',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    color: '#f1f5f9',
                                    fontSize: '12px'
                                }}
                                formatter={(value: number) => [
                                    new Intl.NumberFormat('en-PH', {
                                        style: 'currency',
                                        currency: 'PHP',
                                        minimumFractionDigits: 2
                                    }).format(value),
                                    'Balance'
                                ]}
                            />
                            <Bar
                                dataKey="balance"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={50}
                            >
                                {chartData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
