'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
import { Button } from '@/components/ui/button';
import ProfitCenterPage from '@/app/configuration/profit-centers/page';

export default function ProfitCentersDialog() {
  const { openDialogs, closeDialog } = useDialog();

  return (
    <Dialog open={openDialogs['profit-centers']} onOpenChange={() => closeDialog('profit-centers' as any)}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline">Profit Centers Management</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <ProfitCenterPage />
        </div>

        <DialogFooter className="p-6 pt-0 border-t mt-auto">
          <Button variant="outline" onClick={() => closeDialog('profit-centers' as any)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
