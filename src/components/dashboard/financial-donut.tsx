'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useAccounts } from '@/hooks/use-accounts';
import type { Account } from '@/types/account';

interface FinancialData {
  totalRevenue: number;
  totalExpense: number;
  netIncome: number;
  cashOnHand: number;
}

// Helper to safely sum account balances
function sumBalances(accounts: Account[] = []): number {
  return accounts.reduce((sum, acc) => sum + (acc.balance ?? 0), 0);
}

export function FinancialDonut() {
  const { data: accounts, isLoading, error } = useAccounts();

  const data: FinancialData = useMemo(() => {
    if (!accounts || accounts.length === 0) {
      return {
        totalRevenue: 0,
        totalExpense: 0,
        netIncome: 0,
        cashOnHand: 0,
      };
    }

    const incomeAccounts = accounts.filter(acc => acc.type === 'Income');
    const expenseAccounts = accounts.filter(acc => acc.type === 'Expense');
    const assetAccounts = accounts.filter(acc => acc.type === 'Asset');

    const totalRevenue = sumBalances(incomeAccounts);
    const totalExpense = sumBalances(expenseAccounts);
    const cashOnHand = sumBalances(
      assetAccounts.filter(acc => acc.bank === 'Yes' || (acc.category ?? '').toLowerCase().includes('cash'))
    );

    const netIncome = totalRevenue - totalExpense;

    return {
      totalRevenue,
      totalExpense,
      netIncome,
      cashOnHand,
    };
  }, [accounts]);

  const chartData = [
    { name: 'Total Revenue', value: data.totalRevenue, fill: '#10b981' },
    { name: 'Total Expense', value: data.totalExpense, fill: '#ef4444' },
    { name: 'Net Income', value: data.netIncome, fill: '#3b82f6' },
    { name: 'Cash on Hand', value: data.cashOnHand, fill: '#f59e0b' },
  ].filter(item => item.value !== 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0) || 1; // avoid divide-by-zero

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const percentage = ((dataPoint.value / total) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border rounded p-2 text-sm">
          <p className="font-medium">{dataPoint.name}</p>
          <p className="text-foreground">₱{dataPoint.value.toFixed(2)}</p>
          <p className="text-muted-foreground">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center py-6 text-sm text-muted-foreground">
        Loading financial summary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center py-6 text-sm text-destructive">
        Unable to load financial summary.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-6">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {chartData.length > 0 && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => {
                const percentage = ((entry.payload.value / total) * 100).toFixed(1);
                return `${value} (${percentage}%)`;
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-lg font-bold text-green-600">₱{data.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Expense</p>
          <p className="text-lg font-bold text-red-600">₱{data.totalExpense.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Net Income</p>
          <p className="text-lg font-bold text-blue-600">₱{data.netIncome.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Cash on Hand</p>
          <p className="text-lg font-bold text-amber-600">₱{data.cashOnHand.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
