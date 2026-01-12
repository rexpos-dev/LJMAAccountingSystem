'use client';

import { useDialog } from '@/components/layout/dialog-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function LoyaltySettingsPage() {
  const { openDialog } = useDialog();

  // Automatically open the dialog when landing on this page
  useEffect(() => {
    openDialog('loyalty-settings');
  }, [openDialog]);

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Points Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Loyalty points settings are managed via a popup dialog.
            </p>
            <Button onClick={() => openDialog('loyalty-settings')}>
              Open Loyalty Settings Dialog
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
