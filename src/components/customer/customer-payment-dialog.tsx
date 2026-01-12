'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';

export default function CustomerPaymentDialog() {
    const { openDialogs, closeDialog } = useDialog();

    return (
        <Dialog open={openDialogs['customer-payment']} onOpenChange={() => closeDialog('customer-payment')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customer Payment</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <p>Customer Payment Dialog Configuration Placeholder</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
