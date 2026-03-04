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
    FileText,
    Printer,
    Save,
    ListVideo,
} from 'lucide-react';
import { format } from 'date-fns';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';

export default function ARAgingReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const dialogData = getDialogData('ar-aging-report');
    const reportDate = dialogData?.reportDate || new Date();

    return (
        <Dialog open={openDialogs['ar-aging-report']} onOpenChange={() => closeDialog('ar-aging-report')}>
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
                                <MenubarItem onClick={() => closeDialog('ar-aging-report')}>Close</MenubarItem>
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
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white text-left">Accounts Receivable Aging Report</DialogTitle>
                            <DialogDescription className="text-left">
                                As of: {format(reportDate, 'MM/dd/yyyy')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-right">Current</TableHead>
                                <TableHead className="text-right">1-30 Days</TableHead>
                                <TableHead className="text-right">31-60 Days</TableHead>
                                <TableHead className="text-right">61-90 Days</TableHead>
                                <TableHead className="text-right">Over 90 Days</TableHead>
                                <TableHead className="text-right">Total Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                    AR Aging Data Placeholder
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
