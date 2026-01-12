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
  File,
  Printer,
  Save,
  Mail,
  ListVideo,
  CaseSensitive,
  HelpCircle,
} from 'lucide-react';
import format from '@/lib/date-format';
import { useAccounts } from '@/hooks/use-accounts';
import type { Account } from '@/types/account';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDialog } from '../layout/dialog-provider';
import { ScrollArea } from '../ui/scroll-area';

const formatCurrency = (amount?: number) => {
  if (amount === undefined) return '';
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

export default function BalanceSheetReport({ reportDate }: { reportDate: Date }) {
  const { openDialogs, closeDialog } = useDialog();

  const { data: accountsData, isLoading } = useAccounts();

  const { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity, netAssets } = useMemo(() => {
    const list: Account[] = accountsData ?? [];
    const assets = list.filter((a: Account) => a.type === 'Asset');
    const liabilities = list.filter((a: Account) => a.type === 'Liability');
    const equity = list.filter((a: Account) => a.type === 'Equity');

    const totalAssets = assets.reduce((sum: number, acc: Account) => sum + (acc.balance ?? 0), 0);
    const totalLiabilities = liabilities.reduce((sum: number, acc: Account) => sum + (acc.balance ?? 0), 0);
    const totalEquity = equity.reduce((sum: number, acc: Account) => sum + (acc.balance ?? 0), 0);
    const netAssets = totalAssets - totalLiabilities;

    const historicalBalancing = netAssets - totalEquity;
    if (Math.abs(historicalBalancing) > 0.005) {
      equity.push({
        id: 'hist-balance',
        name: 'Historical Balancing',
        number: 3999,
        balance: historicalBalancing,
        type: 'Equity',
        header: 'No',
        bank: 'No'
      } as Account);
    }
    const finalTotalEquity = totalEquity + historicalBalancing;

    return { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity: finalTotalEquity, netAssets };
  }, [accountsData]);


  const renderAccountRow = (account: Account) => (
    <TableRow key={account.id} className="border-none">
      <TableCell className="pl-8">{account.number}</TableCell>
      <TableCell>{account.name}</TableCell>
      <TableCell className="text-right">{formatCurrency(account.balance)}</TableCell>
    </TableRow>
  );

  const renderSectionTotal = (label: string, total: number, isBold: boolean = false) => (
    <TableRow className={`border-none ${isBold ? 'font-bold' : ''}`}>
      <TableCell colSpan={2} className="text-right pr-4">{label}</TableCell>
      <TableCell className="text-right border-t-2 border-double">{formatCurrency(total)}</TableCell>
    </TableRow>
  );

  const renderLoadingState = () => (
    <div className="p-8">
      <Skeleton className="h-8 w-1/4 mb-4" />
      <Skeleton className="h-4 w-1/5 mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-8 w-1/3 ml-auto mt-2" />
      </div>
      <div className="space-y-4 mt-8">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-1/3 ml-auto mt-2" />
      </div>
    </div>
  );

  const renderReport = () => (
    <>
      <ScrollArea className='flex-1 px-6'>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-1/4">Account</TableHead>
              <TableHead></TableHead>
              <TableHead className="w-1/4 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="font-bold text-white bg-secondary/20"><TableCell colSpan={3}>Assets</TableCell></TableRow>
            {assets.map(renderAccountRow)}
            {renderSectionTotal("Total Assets:", totalAssets, true)}

            <TableRow><TableCell colSpan={3}>&nbsp;</TableCell></TableRow>

            <TableRow className="font-bold text-white bg-secondary/20"><TableCell colSpan={3}>Liabilities</TableCell></TableRow>
            {liabilities.length > 0 ? liabilities.map(renderAccountRow) : <TableRow><TableCell colSpan={3} className="pl-8 text-muted-foreground italic">No liabilities</TableCell></TableRow>}
            {renderSectionTotal("Total Liabilities:", totalLiabilities)}

            <TableRow><TableCell colSpan={3}>&nbsp;</TableCell></TableRow>

            {renderSectionTotal("Net Assets", netAssets, true)}

            <TableRow><TableCell colSpan={3}>&nbsp;</TableCell></TableRow>

            <TableRow className="font-bold text-white bg-secondary/20"><TableCell colSpan={3}>Equity</TableCell></TableRow>
            {equity.map(renderAccountRow)}
            {renderSectionTotal("Total Equity:", totalEquity, true)}

          </TableBody>
        </Table>
      </ScrollArea>
      <footer className="text-center text-xs text-muted-foreground p-4 border-t">
        Express Accounts v 11.10 © NCH Software
      </footer>
    </>
  );

  return (
    <Dialog open={openDialogs['balance-sheet-report']} onOpenChange={() => closeDialog('balance-sheet-report')}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <header>
          <Menubar className="rounded-none border-x-0 border-b border-t-0">
            <MenubarMenu>
              <MenubarTrigger>Report</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Print Preview</MenubarItem>
                <MenubarItem>Print</MenubarItem>
                <MenubarItem>Save</MenubarItem>
                <MenubarItem>Email</MenubarItem>
                <MenubarItem>Fax</MenubarItem>
                <MenubarItem>Suite</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => closeDialog('balance-sheet-report')}>Close</MenubarItem>
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
            <Button variant="ghost" size="sm" className="flex-col h-auto"><Mail className="h-5 w-5" /><span>Email</span></Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto"><CaseSensitive className="h-5 w-5" /><span>Fax</span></Button>
            <Button variant="ghost" size="sm" className="flex-col h-auto"><File className="h-5 w-5" /><span>Suite</span></Button>
          </div>
        </header>

        <DialogHeader className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 border rounded-md bg-card">
              <File className="w-8 h-8 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold font-headline text-white text-left">Balance Sheet</DialogTitle>
              <DialogDescription className="text-left">As at: {format(reportDate, 'MM/dd/yyyy')}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? renderLoadingState() : renderReport()}
      </DialogContent>
    </Dialog>
  );
}
