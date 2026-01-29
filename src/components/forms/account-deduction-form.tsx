
'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useUserPermissions } from '@/hooks/use-user-permissions';

// Schema Definition
const requestItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.coerce.number().min(0, 'Price must be positive'),
});

const formSchema = z.object({
    date: z.date(),
    requesterName: z.string().min(1, 'Requestor is required'),
    position: z.string().optional(),
    businessUnit: z.string().optional(),
    purpose: z.string().optional(),
    chargeTo: z.string().optional(),
    accountNo: z.string().optional(),
    items: z.array(requestItemSchema).min(1, 'At least one item is required'),
    // Signatures
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    processedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AccountDeductionFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function AccountDeductionForm({ onSuccess, onCancel }: AccountDeductionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();

    // Filter users by role
    const verifiers = userPermissions.filter(u => u.isActive && (u.accountType === 'Manager' || u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const processors = userPermissions.filter(u => u.isActive && (u.accountType === 'AdminStaff' || u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date(),
            requesterName: '',
            position: '',
            businessUnit: '',
            purpose: '',
            chargeTo: '',
            accountNo: '',
            items: [{ description: '', quantity: 1, unitPrice: 0 }],
            verifiedBy: '',
            approvedBy: '',
            processedBy: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    const watchedItems = form.watch('items');

    const grandTotal = useMemo(() => {
        return watchedItems.reduce((acc, item) => {
            const total = (item.quantity || 0) * (item.unitPrice || 0);
            return acc + total;
        }, 0);
    }, [watchedItems]);

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    amount: grandTotal, // Request amount is sum of items
                    // Add form type conceptual field if we had one, for now relying on fields
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            console.log('Request submitted successfully');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            // TODO: Show toast error
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-0">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-between items-end mb-6 border-b pb-2">
                        <h1 className="text-xl font-bold uppercase tracking-wide">Account Deduction Request Form</h1>
                        <div className="text-sm">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="font-semibold">Date:</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[180px] h-8 justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Header Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border p-4 rounded-sm bg-muted/30">

                        <FormField
                            control={form.control}
                            name="requesterName"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormLabel className="w-32 shrink-0">Requestor:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormLabel className="w-32 shrink-0">Position:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="businessUnit"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <div className="flex items-center gap-2">
                                        <FormLabel className="w-32 shrink-0">Business Unit / From:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <div className="flex items-center gap-2">
                                        <FormLabel className="w-32 shrink-0">Purpose:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="chargeTo"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormLabel className="w-32 shrink-0">Charge To:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountNo"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormLabel className="w-32 shrink-0">Account No.:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* Items Table */}
                    <div className="border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[50px] text-center">No.</TableHead>
                                    <TableHead>DESCRIPTION</TableHead>
                                    <TableHead className="w-[100px] text-right">QUANTITY</TableHead>
                                    <TableHead className="w-[150px] text-right">COST PRICE</TableHead>
                                    <TableHead className="w-[150px] text-right">TOTAL</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => {
                                    const qty = form.watch(`items.${index}.quantity`) || 0;
                                    const price = form.watch(`items.${index}.unitPrice`) || 0;
                                    const total = qty * price;

                                    return (
                                        <TableRow key={field.id}>
                                            <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.description`}
                                                    render={({ field }) => (
                                                        <Input {...field} className="h-8 border-transparent focus:border-input px-0 bg-transparent placeholder:text-muted-foreground/50" placeholder="Item description" />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <Input {...field} type="number" className="h-8 text-right border-transparent focus:border-input px-0 bg-transparent text-foreground" />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.unitPrice`}
                                                    render={({ field }) => (
                                                        <Input {...field} type="number" step="0.01" className="h-8 text-right border-transparent focus:border-input px-0 bg-transparent text-foreground" />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell>
                                                {fields.length > 1 && (
                                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow className="bg-muted/10 hover:bg-muted/20">
                                    <TableCell colSpan={6} className="text-center py-2 h-auto">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })} className="h-6 text-xs text-muted-foreground hover:text-foreground">
                                            <Plus className="mr-1 h-3 w-3" /> Add Item
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/30 font-bold">
                                    <TableCell colSpan={4} className="text-right">TOTAL</TableCell>
                                    <TableCell className="text-right">
                                        {grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })}
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
                        <div className="space-y-4">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Requested by:</span>
                            <FormField
                                control={form.control}
                                name="requesterName"
                                render={({ field }) => (
                                    <div className="border-b pt-8">
                                        <div className="text-center text-sm font-medium">{field.value || 'Wait for input'}</div>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Charge To:</span>
                            <FormField
                                control={form.control}
                                name="chargeTo"
                                render={({ field }) => (
                                    <div className="border-b pt-8">
                                        <div className="text-center text-sm font-medium">{field.value || 'Wait for input'}</div>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Verified by:</span>
                            <FormField
                                control={form.control}
                                name="verifiedBy"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="h-8 border-none shadow-none focus:ring-0 rounded-none border-b">
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {verifiers.map((user) => (
                                                <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`}>
                                                    {user.firstName} {user.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Approved by:</span>
                            <FormField
                                control={form.control}
                                name="approvedBy"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="h-8 border-none shadow-none focus:ring-0 rounded-none border-b">
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {approvers.map((user) => (
                                                <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`}>
                                                    {user.firstName} {user.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Processed by:</span>
                            <FormField
                                control={form.control}
                                name="processedBy"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="h-8 border-none shadow-none focus:ring-0 rounded-none border-b">
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {processors.map((user) => (
                                                <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`}>
                                                    {user.firstName} {user.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
}
