'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccounts } from '@/hooks/use-accounts';
import type { Account } from '@/types/account';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

export function SummaryCards() {
  const { data: accounts, isLoading } = useAccounts();

  const summaryData = useMemo(() => {
    if (isLoading || !accounts) {
      return [
        { title: 'Checking Account', value: null },
        { title: 'Savings Account', value: null },
        { title: 'Accounts Receivable', value: null },
        { title: 'Total Assets', value: null },
        { title: 'Total Liabilities', value: null },
        { title: 'Total Equity', value: null },
      ];
    }

    const getBalance = (accountName: string) => {
      const account = accounts.find((acc) => acc.name === accountName);
      return account?.balance ?? 0;
    };

    const checkingBalance = getBalance('Checking Account');
    const savingsBalance = getBalance('Savings Account');
    const arBalance = getBalance('Accounts Receivable');

    const totalAssets = accounts.filter(a => a.type === 'Asset').reduce((sum, acc) => sum + (acc.balance ?? 0), 0);
    const totalLiabilities = accounts.filter(a => a.type === 'Liability').reduce((sum, acc) => sum + (acc.balance ?? 0), 0);
    const totalEquity = accounts.filter(a => a.type === 'Equity').reduce((sum, acc) => sum + (acc.balance ?? 0), 0);

    return [
      { title: 'Checking Account', value: formatCurrency(checkingBalance) },
      { title: 'Savings Account', value: formatCurrency(savingsBalance) },
      { title: 'Accounts Receivable', value: formatCurrency(arBalance) },
      { title: 'Total Assets', value: formatCurrency(totalAssets) },
      { title: 'Total Liabilities', value: formatCurrency(totalLiabilities) },
      { title: 'Total Equity', value: formatCurrency(totalEquity) },
    ];
  }, [accounts, isLoading]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {summaryData.map((item) => (
        <Card key={item.title} className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {item.value === null ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div className="text-2xl font-bold font-headline text-white">
                {item.value}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
