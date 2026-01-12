'use client';

import { useState, useEffect } from 'react';
import type { Account } from '@/types/account';

export function useAccounts() {
  const [data, setData] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const accounts = await response.json();
      // Transform balance from null to undefined to match Account type
      const transformedAccounts = accounts.map((account: any) => ({
        ...account,
        balance: account.balance ?? undefined,
      }));
      setData(transformedAccounts);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchAccounts();
    };
    window.addEventListener('accounts-refresh', handleRefresh);
    return () => {
      window.removeEventListener('accounts-refresh', handleRefresh);
    };
  }, []);

  return { data, isLoading, error, refetch: fetchAccounts };
}

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/accounts?bank=yes');
        if (!response.ok) {
          throw new Error('Failed to fetch bank accounts');
        }
        const accounts = await response.json();
        // Transform balance from null to undefined to match Account type
        const transformedAccounts = accounts.filter((account: any) => account.bank === 'Yes').map((account: any) => ({
          ...account,
          balance: account.balance ?? undefined,
        }));
        setAccounts(transformedAccounts);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return { accounts, isLoading, error };
}
