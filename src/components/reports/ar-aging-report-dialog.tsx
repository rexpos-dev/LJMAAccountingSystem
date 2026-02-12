'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-provider';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function ARAgingReportDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const [reportDate, setReportDate] = useState<Date | undefined>(new Date());

    const handleRunReport = () => {
        setDialogData('ar-aging-report' as any, { reportDate });
        closeDialog('ar-aging-report-dialog' as any);
        openDialog('ar-aging-report' as any);
    };

    return (
        <Dialog open={openDialogs['ar-aging-report-dialog'] || false} onOpenChange={() => closeDialog('ar-aging-report-dialog' as any)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>AR Aging Report</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>As of Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !reportDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {reportDate ? format(reportDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={reportDate}
                                    onSelect={setReportDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => closeDialog('ar-aging-report-dialog')}
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
