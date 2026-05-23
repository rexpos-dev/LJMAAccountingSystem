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
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useDialog } from '../layout/dialog-context';
import { ScrollArea } from '../ui/scroll-area';
import { ReportToolbar } from './report-toolbar';

export default function ReconciliationReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const dialogData = getDialogData('reconciliation-report' as any);
    const reportDate = dialogData?.reportDate || new Date();
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <Dialog open={openDialogs['reconciliation-report'] || false} onOpenChange={() => closeDialog('reconciliation-report' as any)}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <ReportToolbar
                        contentRef={contentRef as any}
                        title="Reconciliation Report"
                        subtitle={`As of: ${format(reportDate, 'MM/dd/yyyy')}`}
                        closeKey="reconciliation-report"
                    />
                </header>

                <DialogHeader className="p-6 text-left">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border rounded-md bg-card">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-foreground text-left">Reconciliation Report</DialogTitle>
                            <DialogDescription className="text-left">
                                As of: {format(reportDate, 'MM/dd/yyyy')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <div ref={contentRef}>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Date</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Customer/Supplier</TableHead>
                                <TableHead className="text-right">Deposit</TableHead>
                                <TableHead className="text-right">Withdrawal</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                    Reconciliation Data Placeholder
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
