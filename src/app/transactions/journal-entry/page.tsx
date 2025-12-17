
'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
  } from '@/components/ui/dialog';
  import { useDialog } from '@/components/layout/dialog-provider';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { Calendar } from '@/components/ui/calendar';
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover';
  import { Textarea } from '@/components/ui/textarea';
  import { CalendarIcon } from 'lucide-react';
  import { cn } from '@/lib/utils';
  import { useState } from 'react';
  import { format } from 'date-fns';
  import { ScrollArea } from '@/components/ui/scroll-area';
  import { CardDescription } from '@/components/ui/card';
  
  export default function JournalEntryPage() {
    const { openDialogs, closeDialog } = useDialog();
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 9, 14));
  
    return (
      <Dialog open={openDialogs['journal-entry']} onOpenChange={() => closeDialog('journal-entry')}>
        <DialogContent className="max-w-xl flex flex-col">
          <DialogHeader>
            <DialogTitle>Journal Entry</DialogTitle>
            <CardDescription>
                For a manual journal entry enter the details of the transaction and then allocate the amount to accounts.
            </CardDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-6 -mr-6">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date:</Label>
                <div className="col-span-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        id="date"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="journal" className="text-right">Journal:</Label>
                <Select>
                  <SelectTrigger id="journal" className="col-span-2">
                    <SelectValue placeholder="General" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="reference" className="text-right">Reference:</Label>
                <Input id="reference" defaultValue="GJ[AUTO]" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-start gap-4">
                <Label htmlFor="journal-memo" className="text-right pt-2">Journal memo:</Label>
                <Textarea
                  id="journal-memo"
                  defaultValue="Journal Entry"
                  className="col-span-2"
                />
              </div>
            </div>
  
            <div className="space-y-2 pt-4">
              <h3 className="text-lg font-medium text-white">Account Allocation</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="w-[150px] text-right">Amount</TableHead>
                      <TableHead className="w-[100px] text-right">CR/DR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Click here to allocate an amount to account(s).
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline">Use Template...</Button>
            <div className="flex-grow" />
            <Button>Record</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="secondary">Help</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  

    