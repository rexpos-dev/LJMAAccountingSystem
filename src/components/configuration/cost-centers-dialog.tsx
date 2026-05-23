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
import CostCenterPage from '@/app/configuration/cost-centers/page';

export default function CostCentersDialog() {
  const { openDialogs, closeDialog } = useDialog();

  return (
    <Dialog open={openDialogs['cost-centers']} onOpenChange={() => closeDialog('cost-centers' as any)}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline">Cost Centers Management</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <CostCenterPage />
        </div>

        <DialogFooter className="p-6 pt-0 border-t mt-auto">
          <Button variant="outline" onClick={() => closeDialog('cost-centers' as any)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
