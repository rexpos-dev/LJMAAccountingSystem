"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useState, useEffect, useMemo } from "react"
import { useAccounts } from "@/hooks/use-accounts"
import { useTransactions } from "@/hooks/use-transactions"
import type { Account } from "@/types/account"
import type { Transaction } from "@/types/transaction"

export function Overview() {
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
  // Fetch all transactions (no limit) to generate accurate history
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();

  const data = useMemo(() => {
    if (!accounts.length || !transactions.length) return [];

    // Find the Checking Account (specifically 1110 based on verification)
    const checkingAccount = accounts.find(acc => acc.accnt_no?.toString() === '1110');
    const checkingAccountNumber = checkingAccount?.accnt_no?.toString();

    // Initialize monthly data map
    // Format: "YYYY-MM" -> { name: "Mon", income: 0, expense: 0, sortKey: time }
    const monthlyData = new Map<string, { name: string, income: number, expense: number, sortKey: number }>();

    transactions.forEach((t) => {
      if (!t.date || !t.accountNumber) return;

      // Filter: Only include transactions for the Checking Account
      // We check for the specific Account Number '1110'
      // AND we also check for the legacy/seed identifier 'acct_business_checking' which is present in the database transactions.
      if (
        (!checkingAccountNumber || t.accountNumber.toString() !== checkingAccountNumber) &&
        t.accountNumber !== 'acct_business_checking'
      ) return;

      // Handle both ISO strings (from API) and Timestamp objects (from Firebase legacy/types)
      let date: Date;
      if (typeof t.date === 'string') {
        date = new Date(t.date);
      } else if (typeof t.date === 'object' && 'seconds' in (t.date as any)) {
        // Handle Firestore Timestamp like objects
        date = new Date((t.date as any).seconds * 1000);
      } else {
        // Fallback or assume Date object if that happens in future
        date = new Date(t.date as any);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!monthlyData.has(key)) {
        monthlyData.set(key, {
          name: date.toLocaleString('default', { month: 'short' }),
          income: 0,
          expense: 0,
          sortKey: date.getTime()
        });
      }

      const entry = monthlyData.get(key)!;

      // For the Checking Account (Asset):
      // DEBIT = Increase (Cash In / Income)
      // CREDIT = Decrease (Cash Out / Expense)

      if (t.debit && t.debit > 0) {
        entry.income += t.debit;
      }
      if (t.credit && t.credit > 0) {
        entry.expense += t.credit;
      }
    });

    // Convert map to array and sort by date
    return Array.from(monthlyData.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      // Take last 12 months if needed, or show all available. 
      // For dashboard usually last 6-12 months is good.
      .slice(-12);

  }, [accounts, transactions]);

  if (isAccountsLoading || isTransactionsLoading) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground">
        Loading chart data...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground">
        No transaction data available for cashflow.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(var(--border))' }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar
          dataKey="income"
          name="Income"
          fill="#10b981" // Green
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expense"
          name="Expense"
          fill="#ef4444" // Red
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
