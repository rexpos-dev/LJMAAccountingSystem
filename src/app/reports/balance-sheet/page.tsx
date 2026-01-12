
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
import { Label } from '@/components/ui/label';
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import format from '@/lib/date-format';

export default function BalanceSheetPage({ onViewReport }: { onViewReport: (date: Date) => void }) {
  const { openDialogs, closeDialog } = useDialog();
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (openDialogs['balance-sheet'] && !date) {
      setDate(new Date());
    }
  }, [openDialogs['balance-sheet']]);

  const handleViewReport = () => {
    if (date) {
      onViewReport(date);
      closeDialog('balance-sheet');
    }
  };

  return (
    <Dialog open={openDialogs['balance-sheet']} onOpenChange={() => closeDialog('balance-sheet')}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Select date:
            </Label>
            <Select defaultValue="today">
              <SelectTrigger id="period" className="col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="end-of-last-month">End of Last Month</SelectItem>
                <SelectItem value="end-of-last-quarter">End of Last Quarter</SelectItem>
                <SelectItem value="end-of-last-year">End of Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date:
            </Label>
            <div className='col-span-2'>
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
        </div>
        <DialogFooter>
          <Button onClick={handleViewReport}>View</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="secondary">Help</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
