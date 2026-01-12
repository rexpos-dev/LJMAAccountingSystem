'use client';

import { useDialog } from '@/components/layout/dialog-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function ViewJournalPage() {
  const { openDialog } = useDialog();

  // Automatically open the dialog when landing on this page
  useEffect(() => {
    openDialog('view-journal');
  }, [openDialog]);

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>View Journal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Journal entries are viewed and managed via a popup dialog.
            </p>
            <Button onClick={() => openDialog('view-journal')}>
              Open View Journal Dialog
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
