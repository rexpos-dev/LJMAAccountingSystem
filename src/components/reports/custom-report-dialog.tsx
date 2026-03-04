'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-provider';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function CustomReportDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const [reportName, setReportName] = useState('');

    const handleRunReport = () => {
        setDialogData('custom-report' as any, { reportName });
        closeDialog('custom-report-dialog' as any);
        openDialog('custom-report' as any);
    };

    return (
        <Dialog open={openDialogs['custom-report-dialog'] || false} onOpenChange={() => closeDialog('custom-report-dialog' as any)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Custom Reports</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Select Custom Report</Label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search custom report..."
                                className="pl-8"
                                value={reportName}
                                onChange={(e) => setReportName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => closeDialog('custom-report-dialog' as any)}
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
