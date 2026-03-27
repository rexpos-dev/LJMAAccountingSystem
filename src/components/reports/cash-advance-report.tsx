'use client';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from '@/components/ui/menubar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Printer,
    Save,
    ListVideo,
    FileCheck,
} from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';

import { useState, useEffect } from 'react';

export default function CashAdvanceReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const dialogData = getDialogData('cash-advance-report');
    const fromDate = dialogData?.fromDate || new Date();
    const toDate = dialogData?.toDate || new Date();

    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/requests');
                if (response.ok) {
                    const allRequests = await response.json();

                    const start = startOfDay(new Date(fromDate));
                    const end = endOfDay(new Date(toDate));

                    // Filter for Cash Advance form and Date Range
                    const filtered = allRequests.filter((req: any) => {
                        const isCashAdvance = req.formName === "REQUEST AND AUTHORIZATION OF CASH ADVANCES";
                        const reqDate = new Date(req.date);
                        const isInRange = isWithinInterval(reqDate, { start, end });
                        return isCashAdvance && isInRange;
                    });
                    setData(filtered);
                }
            } catch (error) {
                console.error('Failed to fetch cash advances:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (openDialogs['cash-advance-report']) {
            fetchData();
        }
    }, [openDialogs['cash-advance-report'], fromDate, toDate]);

    return (
        <Dialog open={openDialogs['cash-advance-report']} onOpenChange={() => closeDialog('cash-advance-report')}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <Menubar className="rounded-none border-x-0 border-b border-t-0">
                        <MenubarMenu>
                            <MenubarTrigger>Report</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>Print Preview</MenubarItem>
                                <MenubarItem>Print</MenubarItem>
                                <MenubarItem>Save</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('cash-advance-report')}>Close</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>Help</MenubarTrigger>
                        </MenubarMenu>
                    </Menubar>
                    <div className="flex items-center gap-2 p-2 border-b">
                        <Button variant="ghost" size="sm" className="flex-col h-auto"><ListVideo className="h-5 w-5" /><span>Preview</span></Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto"><Printer className="h-5 w-5" /><span>Print</span></Button>
                        <Button variant="ghost" size="sm" className="flex-col h-auto"><Save className="h-5 w-5" /><span>Save</span></Button>
                    </div>
                </header>

                <DialogHeader className="p-6 text-left">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border rounded-md bg-card">
                            <FileCheck className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white text-left">Cash Advance Report</DialogTitle>
                            <DialogDescription className="text-left">
                                Period: {format(fromDate, 'MM/dd/yyyy')} - {format(toDate, 'MM/dd/yyyy')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Date</TableHead>
                                <TableHead>Request #</TableHead>
                                <TableHead>Employee Name</TableHead>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                        No cash advance records found for this period.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>{format(new Date(req.date), 'MM/dd/yyyy')}</TableCell>
                                        <TableCell className="font-medium">{req.requestNumber}</TableCell>
                                        <TableCell>{req.requesterName}</TableCell>
                                        <TableCell>{req.accountNo || 'N/A'}</TableCell>
                                        <TableCell>{req.position}</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-semibold",
                                                req.status === 'Approved' ? "bg-green-500/20 text-green-500" :
                                                    req.status === 'To Verify' ? "bg-yellow-500/20 text-yellow-500" :
                                                        "bg-gray-500/20 text-gray-500"
                                            )}>
                                                {req.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(req.amount)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
