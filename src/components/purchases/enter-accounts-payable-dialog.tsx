'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';

export default function EnterAccountsPayableDialog() {
    const { openDialogs, closeDialog } = useDialog();

    return (
        <Dialog open={openDialogs['enter-ap']} onOpenChange={() => closeDialog('enter-ap')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Accounts Payable</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <p>Enter Accounts Payable Dialog Configuration Placeholder</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
