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
import { useExternalProducts } from '@/hooks/use-products';
import { ScrollArea } from '../ui/scroll-area';

export default function InventoryReport() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const dialogData = getDialogData('inventory-report' as any);
    const reportDate = dialogData?.reportDate || new Date();

    const { externalProducts, isLoading } = useExternalProducts(1, 1000); // Fetch up to 1000 items from external source

    const totals = externalProducts.reduce((acc, product) => {
        const stock = Number(product.stock) || 0;
        const cost = Number(product.cost) || 0;
        return {
            totalQty: acc.totalQty + stock,
            totalValue: acc.totalValue + (stock * cost)
        };
    }, { totalQty: 0, totalValue: 0 });

    return (
        <Dialog open={openDialogs['inventory-report'] || false} onOpenChange={() => closeDialog('inventory-report' as any)}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
                <header>
                    <Menubar className="rounded-none border-x-0 border-b border-t-0">
                        <MenubarMenu>
                            <MenubarTrigger>Report</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>Print Preview</MenubarItem>
                                <MenubarItem>Print</MenubarItem>
                                <MenubarItem>Save</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem onClick={() => closeDialog('inventory-report' as any)}>Close</MenubarItem>
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
                            <DialogTitle className="text-xl font-bold text-white text-left">Inventory Report</DialogTitle>
                            <DialogDescription className="text-left">
                                As of: {format(reportDate, 'MM/dd/yyyy')}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className='flex-1 px-6'>
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
                            <TableRow className="bg-muted/30">
                                <TableHead>Item Code</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead className="text-right">Quantity on Hand</TableHead>
                                <TableHead className="text-right">Unit Cost</TableHead>
                                <TableHead className="text-right">Total Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                        Loading inventory data...
                                    </TableCell>
                                </TableRow>
                            ) : externalProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                        No external inventory data found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {externalProducts.map((product) => {
                                        const stock = Number(product.stock) || 0;
                                        const cost = Number(product.cost) || 0;
                                        const totalValue = stock * cost;

                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium text-blue-400">{product.sku}</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>{product.unitOfMeasure || '-'}</TableCell>
                                                <TableCell className="text-right">{stock.toLocaleString()}</TableCell>
                                                <TableCell className="text-right">₱{cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="text-right text-green-400">₱{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow className="bg-muted/50 font-bold border-t-2">
                                        <TableCell colSpan={4}>GRAND TOTAL</TableCell>
                                        <TableCell className="text-right">{totals.totalQty.toLocaleString()}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className="text-right text-green-400">₱{totals.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
