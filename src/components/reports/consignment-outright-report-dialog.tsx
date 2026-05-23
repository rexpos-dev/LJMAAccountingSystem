'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-context';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function ConsignmentOutrightReportDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
    const [toDate, setToDate] = useState<Date | undefined>(new Date());

    const handleRunReport = () => {
        setDialogData('consignment-outright-report', { fromDate, toDate });
        closeDialog('consignment-outright-report-dialog');
        openDialog('consignment-outright-report');
    };

    return (
        <Dialog open={openDialogs['consignment-outright-report-dialog']} onOpenChange={() => closeDialog('consignment-outright-report-dialog')}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Consignment/Outright Report</DialogTitle>
                </DialogHeader>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground" )} >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {fromDate ? format(fromDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={fromDate}
                                        onSelect={setFromDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>To Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !toDate && "text-muted-foreground" )} >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {toDate ? format(toDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={toDate}
                                        onSelect={setToDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-2">
                        <Button variant="outline" onClick={() => closeDialog('consignment-outright-report-dialog')}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRunReport} >
                            Run Report
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
