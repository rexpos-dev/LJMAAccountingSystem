"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useMemo } from "react"
import { useAccounts } from "@/hooks/use-accounts"
import { useTransactions } from "@/hooks/use-transactions"

export function Overview() {
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const data = useMemo(() => {
    if (!accounts.length || !transactions.length) return [];

    const monthlyData = new Map<string, { name: string, profit: number, expense: number, cost: number, sortKey: number }>();

    transactions.forEach((t) => {
      // 1. Validate transaction date
      let date: Date;
      if (typeof t.date === 'string') {
        date = new Date(t.date);
      } else if (typeof t.date === 'object' && t.date && 'seconds' in (t.date as any)) {
        date = new Date((t.date as any).seconds * 1000);
      } else {
        date = new Date(t.date as any);
      }

      if (isNaN(date.getTime())) return;

      // 2. Link transaction to Account
      // t.accountNumber (string) should match account.account_no (number or string)
      const account = accounts.find(acc => acc.account_no?.toString() === t.accountNumber?.toString());
      if (!account) return;

      // 3. Initialize monthly bucket
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyData.has(key)) {
        monthlyData.set(key, {
          name: date.toLocaleString('default', { month: 'short' }),
          profit: 0,
          expense: 0,
          cost: 0,
          sortKey: date.getTime()
        });
      }

      const entry = monthlyData.get(key)!;
      const debit = t.debit || 0;
      const credit = t.credit || 0;

      // 4. Calculate Metrics based on Account Type
      // Profit = Income - (Expenses + Cost)

      // Income Accounts: Credit increases Income, Debit decreases
      if (account.account_type === 'Income') {
        const netIncome = credit - debit;
        entry.profit += netIncome; // Add to profit
      }

      // Expense Accounts: Debit increases Expense, Credit decreases
      else if (account.account_type === 'Expense') {
        const netExpense = debit - credit;

        // Distinguish Cost (COGS) vs Regular Expense
        // Check for specific "Cost" naming conventions
        const isCost = account.account_name.toLowerCase().includes('cost') ||
          account.account_name.toLowerCase().includes('cogs') ||
          account.account_name.toLowerCase().includes('purchases');

        if (isCost) {
          entry.cost += netExpense;
          entry.profit -= netExpense; // Cost reduces profit
        } else {
          entry.expense += netExpense;
          entry.profit -= netExpense; // Expense reduces profit
        }
      }
    });

    return Array.from(monthlyData.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .slice(-3); // Show last 3 months as requested

  }, [accounts, transactions]);

  // Use real data only
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
      <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground">
        No financial data available from Chart of Accounts.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₱${value}`}
        />
        <Tooltip
          formatter={(value: number) => `₱${value.toFixed(2)}`}
          contentStyle={{
            backgroundColor: '#09090b', // zinc-950
            borderRadius: '0.5rem',
            border: '1px solid #27272a' // zinc-800
          }}
          itemStyle={{ color: '#e4e4e7' }} // zinc-200
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
        />

        <Area
          type="monotone"
          dataKey="cost"
          name="Cost"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorCost)"
          strokeWidth={2}
        />

        <Area
          type="monotone"
          dataKey="expense"
          name="Expenses"
          stroke="#8b5cf6"
          fillOpacity={1}
          fill="url(#colorExpenses)"
          strokeWidth={2}
        />

        <Area
          type="monotone"
          dataKey="profit"
          name="Profit"
          stroke="#06b6d4"
          fillOpacity={1}
          fill="url(#colorProfit)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
