'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';

export default function BalanceSheetDialog() {
    const { openDialogs, closeDialog } = useDialog();

    return (
        <Dialog open={openDialogs['balance-sheet']} onOpenChange={() => closeDialog('balance-sheet')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Balance Sheet</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <p>Balance Sheet Dialog Configuration Placeholder</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
