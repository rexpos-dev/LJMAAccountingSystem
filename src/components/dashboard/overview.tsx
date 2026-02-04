"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useMemo } from "react"
import { useAccounts } from "@/hooks/use-accounts"
import { useTransactions } from "@/hooks/use-transactions"
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  format,
  subWeeks,
  subMonths,
  subYears,
  isAfter,
  parseISO
} from "date-fns"

export interface OverviewProps {
  timeframe?: "weekly" | "monthly" | "yearly";
}

export function Overview({ timeframe = "monthly" }: OverviewProps) {
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const data = useMemo(() => {
    if (!accounts.length || !transactions.length) return [];

    const groupedData = new Map<string, { name: string, profit: number, expense: number, cost: number, sortKey: number }>();

    // Determine cutoff date for Weekly and Monthly (last 12 units)
    let cutoffDate: Date | null = null;
    const now = new Date();
    if (timeframe === "weekly") {
      cutoffDate = subWeeks(now, 12);
    } else if (timeframe === "monthly") {
      cutoffDate = subMonths(now, 12);
    }

    transactions.forEach((t) => {
      // 1. Validate transaction date
      let date: Date;
      if (typeof t.date === 'string') {
        date = parseISO(t.date);
      } else if (typeof t.date === 'object' && t.date && 'seconds' in (t.date as any)) {
        date = new Date((t.date as any).seconds * 1000);
      } else {
        date = new Date(t.date as any);
      }

      if (isNaN(date.getTime())) return;
      if (cutoffDate && !isAfter(date, cutoffDate)) return;

      // 2. Link transaction to Account
      const account = accounts.find(acc => acc.account_no?.toString() === t.accountNumber?.toString());
      if (!account) return;

      // 3. Determine Group Key and Name
      let key: string;
      let name: string;
      let sortKey: number;

      if (timeframe === "weekly") {
        const weekStart = startOfWeek(date);
        key = format(weekStart, "yyyy-ww");
        name = `Week ${format(weekStart, "ww")}`;
        sortKey = weekStart.getTime();
      } else if (timeframe === "monthly") {
        const monthStart = startOfMonth(date);
        key = format(monthStart, "yyyy-MM");
        name = format(monthStart, "MMM");
        sortKey = monthStart.getTime();
      } else {
        const yearStart = startOfYear(date);
        key = format(yearStart, "yyyy");
        name = format(yearStart, "yyyy");
        sortKey = yearStart.getTime();
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, {
          name,
          profit: 0,
          expense: 0,
          cost: 0,
          sortKey
        });
      }

      const entry = groupedData.get(key)!;
      const debit = t.debit || 0;
      const credit = t.credit || 0;

      // 4. Calculate Metrics based on Account Type
      // Income Accounts: Credit increases Income, Debit decreases
      if (account.account_type === 'Income') {
        const netIncome = credit - debit;
        entry.profit += netIncome;
      }

      // Expense Accounts: Debit increases Expense, Credit decreases
      else if (account.account_type === 'Expense') {
        const netExpense = debit - credit;

        // Distinguish Cost (COGS) vs Regular Expense
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

    return Array.from(groupedData.values())
      .sort((a, b) => a.sortKey - b.sortKey);

  }, [accounts, transactions, timeframe]);

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
        No financial data available for the selected timeframe.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          stroke="#71717a"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis
          stroke="#71717a"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(value: number) => `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          contentStyle={{
            backgroundColor: '#09090b',
            borderRadius: '0.5rem',
            border: '1px solid #27272a',
            fontSize: '12px'
          }}
          itemStyle={{ padding: '0px' }}
        />
        <Legend
          verticalAlign="top"
          height={40}
          iconType="circle"
          wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
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
          stroke="#f43f5e"
          fillOpacity={1}
          fill="url(#colorExpenses)"
          strokeWidth={2}
        />

        <Area
          type="monotone"
          dataKey="profit"
          name="Profit"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#colorProfit)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
