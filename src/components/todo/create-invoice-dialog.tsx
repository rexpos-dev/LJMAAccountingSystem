'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';

export default function CreateInvoiceDialog() {
    const { openDialogs, closeDialog } = useDialog();

    return (
        <Dialog open={openDialogs['create-invoice']} onOpenChange={() => closeDialog('create-invoice')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Invoice</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                    <p>Create Invoice Dialog Configuration Placeholder</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
