'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';

export default function EnterPaymentDialog() {
    const { openDialogs, closeDialog } = useDialog();

    return (
        <Dialog open={openDialogs['enter-payment']} onOpenChange={() => closeDialog('enter-payment')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Payment</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <p>Enter Payment Dialog Configuration Placeholder</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
