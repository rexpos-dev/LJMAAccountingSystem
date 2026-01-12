import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SalesUser } from '@/types/sales-user';

const SALES_USERS_KEY = ['sales-users'];

// Fetch all sales users
export function useSalesUsers() {
  return useQuery({
    queryKey: SALES_USERS_KEY,
    queryFn: async (): Promise<SalesUser[]> => {
      const response = await fetch('/api/sales-users');
      if (!response.ok) {
        throw new Error('Failed to fetch sales users');
      }
      return response.json();
    },
  });
}

export interface CreateSalesUserInput {
  sp_id: string;
  username: string;
  complete_name: string;
}

// Create a new sales user
export function useCreateSalesUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSalesUserInput): Promise<SalesUser> => {
      const response = await fetch('/api/sales-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sp_id: input.sp_id,
          username: input.username,
          complete_name: input.complete_name,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create sales user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_USERS_KEY });
    },
  });
}

// Update a sales user
export function useUpdateSalesUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      username,
      isActive,
    }: {
      id: string;
      name?: string;
      username?: string;
      isActive?: boolean;
    }): Promise<SalesUser> => {
      const response = await fetch('/api/sales-users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, username, isActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update sales user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_USERS_KEY });
    },
  });
}

// Delete a sales user
export function useDeleteSalesUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/sales-users?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete sales user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALES_USERS_KEY });
    },
  });
}
