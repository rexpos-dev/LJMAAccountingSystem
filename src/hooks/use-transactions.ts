'use client';

import { useState, useEffect } from 'react';
import type { Transaction } from '@/types/transaction';

export function useTransactions(limit?: number, offset?: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (limit !== undefined) params.append('limit', limit.toString());
        if (offset !== undefined) params.append('offset', offset.toString());

        const response = await fetch(`/api/transactions?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        // Ensure seq is non-nullable to satisfy Transaction type
        setTransactions(Array.isArray(data) ? data.map((t: any) => ({ ...t, seq: t.seq ?? 0 })) : []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [limit, offset]);

  return { transactions, isLoading, error };
}

export function useTransactionsByAccount(accountNumber: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.append('accountNumber', accountNumber);

        const response = await fetch(`/api/transactions?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions by account');
        }

        const data = await response.json();
        setTransactions(Array.isArray(data) ? data.map((t: any) => ({ ...t, seq: t.seq ?? 0 })) : []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [accountNumber]);

  return { transactions, isLoading, error };
}
