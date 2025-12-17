
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CalendarIcon, UserPlus, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CreateInvoicePage() {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 9, 7));
  const { openDialogs, closeDialog } = useDialog();

  return (
     <Dialog open={openDialogs['create-invoice']} onOpenChange={() => closeDialog('create-invoice')}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Tabs defaultValue="billing">
                      <TabsList>
                        <TabsTrigger value="billing">Billing</TabsTrigger>
                        <TabsTrigger value="shipping">Shipping</TabsTrigger>
                      </TabsList>
                      <TabsContent value="billing" className="pt-4">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <label>Customer</label>
                            <div className="flex gap-2">
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a customer" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="customer1">
                                    Customer 1
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="outline" size="icon">
                                <UserPlus className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <label>Bill To</label>
                            <Textarea placeholder="Enter billing address" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label>Customer PO No.</label>
                              <Input />
                            </div>
                            <div className="grid gap-2">
                              <label>Customer Tax</label>
                              <Select defaultValue="default">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Default</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="shipping" className="pt-4">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="shipping-address">Ship To</Label>
                            <Textarea id="shipping-address" placeholder="Enter shipping address" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="same-as-billing" />
                            <Label htmlFor="same-as-billing" className="font-normal">Same as billing</Label>
                          </div>
                           <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="ship-by">Ship By</Label>
                                <Input id="ship-by" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tracking-ref">Tracking Ref No.</Label>
                                <Input id="tracking-ref" />
                            </div>
                          </div>
                           <div className="grid gap-2">
                            <Label>Shipping Costs/Tax</Label>
                            <div className="flex gap-2">
                              <Input type="number" placeholder="0.00" />
                              <Select defaultValue="none">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">
                                    None
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg font-headline">Invoice</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Create From</Label>
                        <Select defaultValue="new-invoice">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new-invoice">
                              [New Invoice]
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
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
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Terms</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="pay-in-days">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pay-in-days">
                                Pay in Days
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input type="number" defaultValue="30" className="w-20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Salesperson</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select salesperson" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sp1">Salesperson 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Invoice Number</Label>
                        <Input defaultValue="10000" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Deposit Account</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Create a new account --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new-account">
                              -- Create a new account --
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Items</CardTitle>
                </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Qty</TableHead>
                        <TableHead className="w-[200px]">Item</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[120px] text-right">
                          Unit Price
                        </TableHead>
                        <TableHead className="w-[100px] text-right">Tax</TableHead>
                        <TableHead className="w-[120px] text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Click here to add items to this invoice.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <Button variant="outline">Add Item</Button>
                  <Button variant="outline" disabled>Remove Item</Button>
                  <Button variant="outline">Add Discount...</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="comments">
                  <TabsList>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="private-comments">
                      Private Comments
                    </TabsTrigger>
                    <TabsTrigger value="note-comment">Note Comment</TabsTrigger>
                    <TabsTrigger value="foot-comment">Foot Comment</TabsTrigger>
                  </TabsList>
                  <TabsContent value="comments" className="pt-4">
                    <Textarea placeholder="Enter invoice notes" />
                  </TabsContent>
                </Tabs>
              </div>
              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">₱0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₱0.00</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="border-t pt-4">
            <Button variant="outline">Invoice Options...</Button>
            <div className="flex gap-2 ml-auto">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Record</Button>
              <Button variant="secondary">Help</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
