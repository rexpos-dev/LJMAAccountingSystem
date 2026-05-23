"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { useBankingStats } from "@/hooks/use-banking-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

export function DailyCashFlowChart() {
    const { data, isLoading } = useBankingStats();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return (
            <Card className="h-full border-none bg-foreground/5 backdrop-blur-sm">
                <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                </CardContent>
            </Card>
        );
    }

    const inflow = data?.inflowToday || 0;
    const outflow = data?.outflowToday || 0;

    const chartData = [
        { name: 'Inflow', value: inflow, color: '#10b981' },
        { name: 'Outflow', value: outflow, color: '#ef4444' },
    ];

    const total = inflow + outflow;
    const net = inflow - outflow;

    return (
        <Card className="border-none bg-foreground/5 backdrop-blur-sm flex flex-col">
            <CardHeader className="flex-none">
                <CardTitle className="font-headline text-foreground text-xl">Daily Cash Flow</CardTitle>
                <CardDescription className="text-slate-400">Inflow vs Outflow for today</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pb-6">
                <div className="h-[250px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: '#ffffff', opacity: 0.05 }}
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #334155',
                                    color: '#f1f5f9',
                                    fontSize: '12px'
                                }}
                                formatter={(value: number) => [formatCurrency(value), '']}
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] font-medium text-emerald-500 uppercase">Inflow</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">{formatCurrency(inflow)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingDown className="h-3 w-3 text-red-500" />
                                <span className="text-[10px] font-medium text-red-500 uppercase">Outflow</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">{formatCurrency(outflow)}</p>
                        </div>
                    </div>

                    <div className={`p-2 text-center rounded text-xs font-medium ${net >= 0 ? 'text-emerald-400 bg-emerald-400/5' : 'text-red-400 bg-red-400/5'}`}>
                        Net Movement: {net >= 0 ? '+' : ''}{formatCurrency(net)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
