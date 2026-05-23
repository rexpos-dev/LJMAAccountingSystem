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

export default function IncomeStatementAnalysisReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const dialogData = getDialogData('income-statement-analysis-report');
    const fromDate = dialogData?.fromDate || new Date();
    const toDate = dialogData?.toDate || new Date();
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <Dialog open={openDialogs['income-statement-analysis-report']} onOpenChange={() => closeDialog('income-statement-analysis-report')}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <ReportToolbar
                        contentRef={contentRef as any}
                        title="Income Statement Analysis"
                        subtitle={`Period: ${format(fromDate, 'MM/dd/yyyy')} - ${format(toDate, 'MM/dd/yyyy')}`}
                        closeKey="income-statement-analysis-report"
                    />
                </header>

                <DialogHeader className="p-6 text-left">
                    <div className="flex items-center gap-4">
                        <div className="p-2 border rounded-md bg-card">
                            <File className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-foreground text-left">Income Statement Analysis</DialogTitle>
                            <DialogDescription className="text-left">
                                Period: {format(fromDate, 'MM/dd/yyyy')} - {format(toDate, 'MM/dd/yyyy')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <div ref={contentRef}>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Account/Entity</TableHead>
                                <TableHead className="text-right">Budget</TableHead>
                                <TableHead className="text-right">Actual</TableHead>
                                <TableHead className="text-right">Variance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                                    Analysis Data Placeholder
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
