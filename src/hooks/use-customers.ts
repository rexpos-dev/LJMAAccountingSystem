'use client';

import { useState, useEffect } from 'react';

export interface Customer {
  id: string;
  code: string;
  customerName: string;
  contactFirstName?: string;
  address?: string;
  phonePrimary?: string;
  phoneAlternative?: string;
  email?: string;
  isActive: boolean;
  creditLimit: number;
  isTaxExempt: boolean;
  paymentTerms: string;
  paymentTermsValue: string;
  salesperson?: string;
  customerGroup: string;
  isEntitledToLoyaltyPoints: boolean;
  pointSetting?: string;
  loyaltyCalculationMethod: string;
  loyaltyCardNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export function useCustomers(limit?: number, offset?: number) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (limit !== undefined) params.append('limit', limit.toString());
      if (offset !== undefined) params.append('offset', offset.toString());

      const url = `/api/customers${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create customer');
      }

      const newCustomer = await response.json();

      // Refresh the customer list
      await fetchCustomers();

      return newCustomer;
    } catch (err) {
      console.error('Error creating customer:', err);
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...customerData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update customer');
      }

      const updatedCustomer = await response.json();

      // Update the customer in the local state
      setCustomers(prev => prev.map(customer =>
        customer.id === id ? updatedCustomer : customer
      ));

      return updatedCustomer;
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const response = await fetch(`/api/customers?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete customer');
      }

      // Remove the customer from the local state
      setCustomers(prev => prev.filter(customer => customer.id !== id));

      return await response.json();
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  const refreshCustomers = () => {
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, [limit, offset]);

  return {
    customers,
    isLoading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomers,
  };
}

export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomer = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll fetch all customers and find the one with the matching ID
      // In a real application, you'd want a dedicated endpoint for fetching a single customer
      const response = await fetch('/api/customers');

      if (!response.ok) {
        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }

      const customers = await response.json();
      const foundCustomer = customers.find((c: Customer) => c.id === id);

      if (!foundCustomer) {
        throw new Error('Customer not found');
      }

      setCustomer(foundCustomer);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching customer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  return {
    customer,
    isLoading,
    error,
    refetch: fetchCustomer,
  };
}
