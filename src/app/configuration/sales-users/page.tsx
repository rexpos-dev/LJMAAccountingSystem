'use client';

import { useDialog } from '@/components/layout/dialog-provider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSalesUsers } from '@/hooks/use-sales-users';

export default function SalesUsersPage() {
  const { openDialog } = useDialog();
  const { data: salesUsers = [], isLoading, error } = useSalesUsers();

  return (
    <div className="p-4 md:p-8 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-headline">Sales Users</CardTitle>
          <Button onClick={() => openDialog('add-sales-user')}>Add Sales User</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading sales users...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load sales users.</div>
          ) : salesUsers.length === 0 ? (
            <div className="text-sm text-muted-foreground">No sales users yet.</div>
          ) : (
            <div className="space-y-2">
              {salesUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border rounded px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">{user.complete_name || user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      SP ID: {user.sp_id || user.uniqueId} • Username: {user.username || '-'}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


