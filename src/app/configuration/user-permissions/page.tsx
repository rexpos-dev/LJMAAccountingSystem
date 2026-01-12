'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import UserPermissionsList from '@/components/configuration/user-permissions-list';

export default function UserPermissionsPage() {
  const { openDialog } = useDialog();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Permissions</h1>
          <p className="text-muted-foreground">
            Manage user accounts and their access permissions
          </p>
        </div>
        <Button onClick={() => openDialog('add-user-permission')}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserPermissionsList />
        </CardContent>
      </Card>
    </div>
  );
}
