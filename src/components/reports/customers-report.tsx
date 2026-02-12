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
} from '@/components/ui/dialog';
import {
    FileText,
    Printer,
    Save,
    ListVideo,
} from 'lucide-react';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';

export default function CustomersReport() {
    const { openDialogs, closeDialog } = useDialog();

    return (
        <Dialog open={openDialogs['customers-report'] || false} onOpenChange={() => closeDialog('customers-report' as any)}>
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
                                <MenubarItem onClick={() => closeDialog('customers-report')}>Close</MenubarItem>
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
                            <DialogTitle className="text-xl font-bold text-white text-left">Customers Report</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Customer Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                    Customers Data Placeholder
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
