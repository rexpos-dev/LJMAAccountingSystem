'use client';

import { useRef } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { File } from 'lucide-react';
import { format } from 'date-fns';
import { useDialog } from '../layout/dialog-context';
import { ScrollArea } from '../ui/scroll-area';
import { ReportToolbar } from './report-toolbar';

export default function TrialBalanceReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const dialogData = getDialogData('trial-balance-report');
    const asOfDate = dialogData?.asOfDate || new Date();
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <Dialog open={openDialogs['trial-balance-report']} onOpenChange={() => closeDialog('trial-balance-report')}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <ReportToolbar
                        contentRef={contentRef as any}
                        title="Trial Balance"
                        subtitle={`As at: ${format(asOfDate, 'MM/dd/yyyy')}`}
                        closeKey="trial-balance-report"
                    />
                </header>

                <DialogHeader className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border rounded-md bg-card">
                            <File className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-foreground text-left">Trial Balance</DialogTitle>
                            <DialogDescription className="text-left">
                                As at: {format(asOfDate, 'MM/dd/yyyy')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <div ref={contentRef}>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Account</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                                    Trial Balance Data Placeholder
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
