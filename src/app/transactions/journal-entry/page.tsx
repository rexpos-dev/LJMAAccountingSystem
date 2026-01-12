'use client';

import { useEffect } from 'react';
import { useDialog } from '@/components/layout/dialog-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function JournalEntryPage() {
  const { openDialog } = useDialog();

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Journal Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <p className="text-muted-foreground">
              Journal entries are managed via a popup dialog.
            </p>
            <Button onClick={() => openDialog('journal-entry')}>
              Open Journal Entry Dialog
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
