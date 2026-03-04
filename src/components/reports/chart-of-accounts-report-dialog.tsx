'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/components/layout/dialog-provider';

export default function ChartOfAccountsReportDialog() {
    const { openDialogs, closeDialog, openDialog } = useDialog();

    const handleRunReport = () => {
        closeDialog('chart-of-accounts-report-dialog' as any);
        openDialog('chart-of-accounts-report' as any);
    };

    return (
        <Dialog open={openDialogs['chart-of-accounts-report-dialog'] || false} onOpenChange={() => closeDialog('chart-of-accounts-report-dialog' as any)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Chart Of Accounts Report</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This will generate a complete list of your accounts including their current balances and types.
                    </p>

                    <div className="pt-4 border-t flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => closeDialog('chart-of-accounts-report-dialog' as any)}
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
