'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BudgetReportDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const [year, setYear] = useState(new Date().getFullYear().toString());

    const handleRunReport = () => {
        setDialogData('budget-report' as any, { year });
        closeDialog('budget-report-dialog' as any);
        openDialog('budget-report' as any);
    };

    return (
        <Dialog open={openDialogs['budget-report-dialog'] || false} onOpenChange={() => closeDialog('budget-report-dialog' as any)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Budget Report</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Financial Year</Label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2026">2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => closeDialog('budget-report-dialog' as any)}
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
