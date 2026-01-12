'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';

export default function IncomeStatementDialog() {
    const { openDialogs, closeDialog } = useDialog();

    return (
        <Dialog open={openDialogs['income-statement']} onOpenChange={() => closeDialog('income-statement')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Income Statement</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <p>Income Statement Dialog Configuration Placeholder</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
