import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPermission } from '@/types/user-permission';

const USER_PERMISSIONS_KEY = ['user-permissions'];

// Fetch all user permissions
export function useUserPermissions() {
  return useQuery({
    queryKey: USER_PERMISSIONS_KEY,
    queryFn: async (): Promise<UserPermission[]> => {
      const response = await fetch('/api/user-permissions');
      if (!response.ok) {
        throw new Error('Failed to fetch user permissions');
      }
      return response.json();
    },
  });
}

export interface CreateUserPermissionInput {
  username: string;
  firstName: string;
  lastName: string;
  contactNo?: string;
  accountType: string;
  password?: string;
  permissions: string[];
}

// Create a new user permission
export function useCreateUserPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserPermissionInput): Promise<UserPermission> => {
      const response = await fetch('/api/user-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...input,
          permissions: input.permissions || [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || 'Failed to create user permission');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PERMISSIONS_KEY });
    },
  });
}

// Update a user permission
export function useUpdateUserPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      username,
      firstName,
      lastName,
      contactNo,
      accountType,
      password,
      permissions,
      isActive,
    }: {
      id: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      contactNo?: string;
      accountType?: string;
      password?: string;
      permissions?: string[];
      isActive?: boolean;
    }): Promise<UserPermission> => {
      const response = await fetch('/api/user-permissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, username, firstName, lastName, contactNo, accountType, password, permissions, isActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || 'Failed to update user permission');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PERMISSIONS_KEY });
    },
  });
}

// Delete a user permission
export function useDeleteUserPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/user-permissions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || 'Failed to delete user permission');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PERMISSIONS_KEY });
    },
  });
}
