
'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useUserPermissions } from '@/hooks/use-user-permissions';

// Schema Definition
const itemSchema = z.object({
    qty: z.coerce.number().min(0).optional(),
    unit: z.string().optional(),
    particulars: z.string().optional(),
    amount: z.coerce.number().min(0).optional(),
});

const formSchema = z.object({
    controlNo: z.string().optional(),
    date: z.date(),
    // Company/Branch checkboxes
    tlmc: z.boolean().default(false),
    sfl: z.boolean().default(false),
    trucking: z.boolean().default(false),
    agrivetBranch: z.string().optional(),
    capexBussUnit: z.string().optional(),
    temporaryChargeTo: z.string().optional(),
    maeccDav: z.boolean().default(false),
    lfc: z.boolean().default(false),
    rentalSpace: z.boolean().default(false),
    maeccDeOro: z.boolean().default(false),
    others: z.string().optional(),
    maeccMars: z.boolean().default(false),
    ktr: z.boolean().default(false),
    repacking: z.boolean().default(false),
    chow2: z.boolean().default(false),
    atr: z.boolean().default(false),
    prorate: z.boolean().default(false),
    riceFarm: z.boolean().default(false),
    jyr: z.boolean().default(false),
    finalChargeTo: z.string().optional(),
    // Right side fields
    payTo: z.string().optional(),
    accountNumber: z.string().optional(),
    expenseAcct: z.string().optional(),
    receivables: z.string().optional(),
    othersField: z.string().optional(),
    // Items
    items: z.array(itemSchema).min(1),
    amountInWords: z.string().optional(),
    // Signatures
    preparedBy: z.string().optional(),
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    receivedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DisbursementSlipFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function DisbursementSlipForm({ onSuccess, onCancel }: DisbursementSlipFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();

    // Filter users by role
    const verifiers = userPermissions.filter(u => u.isActive && (u.accountType === 'Manager' || u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const processors = userPermissions.filter(u => u.isActive && (u.accountType === 'AdminStaff' || u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            controlNo: '',
            date: new Date(),
            tlmc: false,
            sfl: false,
            trucking: false,
            maeccDav: false,
            lfc: false,
            rentalSpace: false,
            maeccDeOro: false,
            maeccMars: false,
            ktr: false,
            repacking: false,
            chow2: false,
            atr: false,
            prorate: false,
            riceFarm: false,
            jyr: false,
            items: [{ qty: 0, unit: '', particulars: '', amount: 0 }],
            preparedBy: '',
            verifiedBy: '',
            approvedBy: '',
            receivedBy: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    // Calculate total
    const total = form.watch('items').reduce((sum, item) => sum + (item.amount || 0), 0);

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    type: 'DISBURSEMENT SLIP',
                    amount: total,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-0">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b pb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">Control No.:</span>
                                <Input className="w-32 h-8" placeholder="Auto" readOnly />
                            </div>
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="font-semibold text-sm">Date:</FormLabel>
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
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column - Company/Branch Selection */}
                        <div className="space-y-4 border rounded-lg p-4">
                            <div className="grid grid-cols-4 gap-3 text-sm">
                                {/* Column 1 */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="tlmc"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">TLMC</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sfl"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">SFL</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="trucking"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">TRUCKING</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maeccDav"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">MAECC DAV</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lfc"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">LFC</label>
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="rentalSpace"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">RENTAL SPACE</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maeccDeOro"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">MAECC DE ORO</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maeccMars"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">MAECC MARS</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ktr"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">KTR</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="repacking"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">REPACKING</label>
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Column 3 */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="chow2"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">CHOW 2</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="atr"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">ATR</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="prorate"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">PRORATE</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="riceFarm"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">RICE FARM</label>
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="jyr"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                <label className="text-sm font-medium">JYR</label>
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Column 4 - Input Fields Only */}
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="agrivetBranch"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox />
                                                <Input {...field} placeholder="AGRIVET Branch" className="h-7 text-xs" />
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="capexBussUnit"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox />
                                                <Input {...field} placeholder="CAPEX (Buss. Unit)" className="h-7 text-xs" />
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="temporaryChargeTo"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox />
                                                <Input {...field} placeholder="Temporary Charge to" className="h-7 text-xs" />
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="finalChargeTo"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox />
                                                <Input {...field} placeholder="Final Charge to" className="h-7 text-xs" />
                                            </div>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="others"
                                        render={({ field }) => (
                                            <div className="flex items-center space-x-2">
                                                <Checkbox />
                                                <Input {...field} placeholder="Others" className="h-7 text-xs" />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Payment Details */}
                        <div className="space-y-3 border rounded-lg p-4">
                            <FormField
                                control={form.control}
                                name="payTo"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium w-40">PAY TO:</label>
                                        <Input {...field} className="h-8" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium w-40">ACCOUNT NUMBER:</label>
                                        <Input {...field} className="h-8" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expenseAcct"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium w-40">EXPENSE ACCT:</label>
                                        <Input {...field} className="h-8" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="receivables"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium w-40">RECEIVABLES:</label>
                                        <Input {...field} className="h-8" />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="othersField"
                                render={({ field }) => (
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium w-40">OTHERS:</label>
                                        <Input {...field} className="h-8" />
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="border p-2 text-sm font-semibold w-20">QTY</th>
                                    <th className="border p-2 text-sm font-semibold w-24">UNIT</th>
                                    <th className="border p-2 text-sm font-semibold">PARTICULARS</th>
                                    <th className="border p-2 text-sm font-semibold w-32">AMOUNT</th>
                                    <th className="border p-2 text-sm font-semibold w-32">TOTAL</th>
                                    <th className="border p-2 w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field, index) => (
                                    <tr key={field.id}>
                                        <td className="border p-1">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.qty`}
                                                render={({ field }) => (
                                                    <Input {...field} type="number" className="h-8 text-center border-none" />
                                                )}
                                            />
                                        </td>
                                        <td className="border p-1">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.unit`}
                                                render={({ field }) => (
                                                    <Input {...field} className="h-8 text-center border-none" />
                                                )}
                                            />
                                        </td>
                                        <td className="border p-1">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.particulars`}
                                                render={({ field }) => (
                                                    <Input {...field} className="h-8 border-none" />
                                                )}
                                            />
                                        </td>
                                        <td className="border p-1">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.amount`}
                                                render={({ field }) => (
                                                    <Input {...field} type="number" className="h-8 text-right border-none" />
                                                )}
                                            />
                                        </td>
                                        <td className="border p-2 text-right font-medium">
                                            {((form.watch(`items.${index}.qty`) || 0) * (form.watch(`items.${index}.amount`) || 0)).toFixed(2)}
                                        </td>
                                        <td className="border p-1 text-center">
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={6} className="border p-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ qty: 0, unit: '', particulars: '', amount: 0 })}
                                            className="w-full"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Item
                                        </Button>
                                    </td>
                                </tr>
                                <tr className="bg-muted">
                                    <td colSpan={4} className="border p-2 text-right font-bold">TOTAL</td>
                                    <td className="border p-2 text-right font-bold">₱{total.toFixed(2)}</td>
                                    <td className="border"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Amount in Words */}
                    <FormField
                        control={form.control}
                        name="amountInWords"
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium italic">AMOUNT IN WORD:</label>
                                <Input {...field} className="flex-1 h-8 border-b border-t-0 border-x-0 rounded-none" />
                            </div>
                        )}
                    />

                    {/* Signatures */}
                    <div className="grid grid-cols-4 gap-4 pt-8">
                        <div className="space-y-2 text-center">
                            <FormField
                                control={form.control}
                                name="preparedBy"
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
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Prepared by:</p>
                        </div>
                        <div className="space-y-2 text-center">
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
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Verified by:</p>
                        </div>
                        <div className="space-y-2 text-center">
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
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Approved by:</p>
                        </div>
                        <div className="space-y-2 text-center">
                            <FormField
                                control={form.control}
                                name="receivedBy"
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
                            <p className="text-xs font-semibold uppercase text-muted-foreground">Received by:</p>
                        </div>
                    </div>

                    {/* Reminder */}
                    <div className="text-xs text-red-600 italic text-center pt-4 border-t">
                        REMINDER: No alterations and incomplete signatories. ₱200.00 penalty for non-compliance.
                    </div>

                    <div className="flex justify-end gap-2 pt-6">
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
