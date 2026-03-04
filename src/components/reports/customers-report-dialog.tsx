'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/components/layout/dialog-provider';

export default function CustomersReportDialog() {
    const { openDialogs, closeDialog, openDialog } = useDialog();

    const handleRunReport = () => {
        closeDialog('customers-report-dialog' as any);
        openDialog('customers-report' as any);
    };

    return (
        <Dialog open={openDialogs['customers-report-dialog'] || false} onOpenChange={() => closeDialog('customers-report-dialog' as any)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Customers Report</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-4">
                    <p>Generate a comprehensive list of all customers and their status.</p>

                    <div className="pt-4 border-t flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => closeDialog('customers-report-dialog')}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRunReport}
                        >
                            Run Report
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
