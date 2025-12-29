'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface FinancialData {
  totalRevenue: number;
  totalExpense: number;
  netIncome: number;
  cashOnHand: number;
}

export function FinancialDonut() {
  const [data, setData] = useState<FinancialData>({
    totalRevenue: 45231.89,
    totalExpense: 12876.54,
    netIncome: 32355.35,
    cashOnHand: 78123.45,
  });

  const chartData = [
    { name: 'Total Revenue', value: data.totalRevenue, fill: '#10b981' },
    { name: 'Total Expense', value: data.totalExpense, fill: '#ef4444' },
    { name: 'Net Income', value: data.netIncome, fill: '#3b82f6' },
    { name: 'Cash on Hand', value: data.cashOnHand, fill: '#f59e0b' },
  ];

  const total = data.totalRevenue + data.totalExpense + data.netIncome + data.cashOnHand;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border rounded p-2 text-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-foreground">₱{data.value.toFixed(2)}</p>
          <p className="text-muted-foreground">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

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
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => {
              const percentage = ((entry.payload.value / total) * 100).toFixed(1);
              return `${value} (${percentage}%)`;
            }}
          />
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
