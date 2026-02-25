"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"
import { useMemo } from "react"
import { useAccounts } from "@/hooks/use-accounts"
import { useTransactions } from "@/hooks/use-transactions"

export function Overview() {
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const data = useMemo(() => {
    if (!accounts || !accounts.length || !transactions || !transactions.length) return [];

    const groupedData = new Map<string, { name: string, balance: number }>();

    // Group transactions by account
    const accountTotals = new Map<string, { debit: number, credit: number }>();
    transactions.forEach(t => {
      const accNo = t.accountNumber?.toString();
      if (!accNo) return;
      const current = accountTotals.get(accNo) || { debit: 0, credit: 0 };
      accountTotals.set(accNo, {
        debit: current.debit + (t.debit || 0),
        credit: current.credit + (t.credit || 0)
      });
    });

    accounts.forEach((account) => {
      const accNo = account.account_no.toString();
      const txs = accountTotals.get(accNo);
      if (!txs) return;

      const type = account.account_type || "Unknown";
      const debit = txs.debit;
      const credit = txs.credit;

      let balance = 0;
      // Asset/Expense: Debit - Credit
      // Liability/Equity/Income: Credit - Debit
      if (['Asset', 'Expense', 'Bank', 'Cost of Sales'].includes(type) || account.account_name.toLowerCase().includes('purchases')) {
        balance = debit - credit;
      } else {
        balance = credit - debit;
      }

      if (!groupedData.has(type)) {
        groupedData.set(type, {
          name: type,
          balance: 0,
        });
      }

      const entry = groupedData.get(type)!;
      entry.balance += balance;
    });

    return Array.from(groupedData.values())
      .sort((a, b) => b.balance - a.balance);

  }, [accounts, transactions]);

  const chartData = data;

  if (isAccountsLoading || isTransactionsLoading) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground">
        Loading chart data...
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground italic">
        No financial data available.
      </div>
    );
  }

  const COLORS = {
    'Asset': '#3b82f6',
    'Liability': '#f43f5e',
    'Equity': '#8b5cf6',
    'Income': '#10b981',
    'Expense': '#f59e0b',
    'Bank': '#0ea5e9',
    'Cost of Sales': '#ef4444',
    'Other Income': '#14b8a6',
    'Other Expense': '#f97316',
    'Unknown': '#71717a'
  } as Record<string, string>;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
        <XAxis
          dataKey="name"
          stroke="#71717a"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#71717a"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
          dx={-10}
        />
        <Tooltip
          cursor={{ fill: '#27272a', opacity: 0.4 }}
          formatter={(value: number) => `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          contentStyle={{
            backgroundColor: '#09090b',
            borderRadius: '0.5rem',
            border: '1px solid #27272a',
            fontSize: '12px',
            color: '#fafafa',
          }}
          itemStyle={{ padding: '0px', color: '#fafafa' }}
          labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
        />
        <Bar
          dataKey="balance"
          name="Balance"
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS['Unknown']} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
