'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';

export default function BalanceSheetDialog() {
    const { openDialogs, closeDialog, openDialog } = useDialog();

    return (
        <Dialog open={openDialogs['balance-sheet']} onOpenChange={() => closeDialog('balance-sheet')}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Balance Sheet</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">As of Date</label>
                        <div className="p-2 border rounded-md bg-muted/50 text-muted-foreground text-sm cursor-not-allowed">
                            Placeholder for Date Picker
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-2">
                        <button
                            className="px-4 py-2 text-sm font-medium rounded-md border"
                            onClick={() => closeDialog('balance-sheet')}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
                            onClick={() => {
                                closeDialog('balance-sheet');
                                openDialog('balance-sheet-report');
                            }}
                        >
                            Run Report
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
