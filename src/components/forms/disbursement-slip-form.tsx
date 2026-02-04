'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Plus, Trash2, Loader2, Printer, CreditCard, Building2 } from 'lucide-react';
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
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function DisbursementSlipForm({ initialData, mode = 'create', onSuccess, onCancel }: DisbursementSlipFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
    const isReadOnly = mode === 'view';

    const { user } = useAuth();

    // Filter users by role and specific form access
    const verifiers = userPermissions.filter(u => {
        try {
            const perms = JSON.parse(u.permissions);
            return u.isActive && u.formPermissions === 'Verifier' && perms.includes("DISBURSEMENT SLIP");
        } catch { return false; }
    });
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const processors = userPermissions.filter(u => u.isActive && (u.accountType === 'AdminStaff' || u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const currentVerifierName = verifiers.find(v => v.username === user?.username) ? `${user?.firstName} ${user?.lastName}` : '';

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            controlNo: initialData?.requestNumber || '',
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            tlmc: initialData?.tlmc || false,
            sfl: initialData?.sfl || false,
            trucking: initialData?.trucking || false,
            maeccDav: initialData?.maeccDav || false,
            lfc: initialData?.lfc || false,
            rentalSpace: initialData?.rentalSpace || false,
            maeccDeOro: initialData?.maeccDeOro || false,
            maeccMars: initialData?.maeccMars || false,
            ktr: initialData?.ktr || false,
            repacking: initialData?.repacking || false,
            chow2: initialData?.chow2 || false,
            atr: initialData?.atr || false,
            prorate: initialData?.prorate || false,
            riceFarm: initialData?.riceFarm || false,
            jyr: initialData?.jyr || false,
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    qty: it.quantity,
                    unit: it.unit,
                    particulars: it.description,
                    amount: it.unitPrice
                }))
                : [{ qty: 0, unit: '', particulars: '', amount: 0 }],
            preparedBy: initialData?.processedBy || '',
            verifiedBy: initialData?.verifiedBy || currentVerifierName,
            approvedBy: initialData?.approvedBy || '',
            receivedBy: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    // Calculate total
    const watchedItems = form.watch('items');
    const total = (watchedItems || []).reduce((sum, item) => sum + ((item.qty || 0) * (item.amount || 0)), 0);

    async function onSubmit(data: FormValues) {
        if (isReadOnly) return;
        setIsSubmitting(true);
        try {
            const url = mode === 'edit' ? `/api/requests/${initialData.id}` : '/api/requests';
            const method = mode === 'edit' ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    formName: 'DISBURSEMENT SLIP',
                    amount: total,
                    // Map items for the API
                    items: data.items.map(it => ({
                        description: it.particulars,
                        quantity: it.qty,
                        unit: it.unit,
                        unitPrice: it.amount
                    })),
                    processedBy: data.preparedBy // Mapping preparedBy to processedBy in DB
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${mode} request`);
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight text-primary uppercase">Disbursement Slip</h2>
                            <p className="text-sm text-muted-foreground">General fund disbursement and expense categorization.</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Control No.</span>
                                <Input className="w-32 h-9 bg-muted/20 border-dashed" placeholder="Auto" readOnly />
                            </div>
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col min-w-[200px]">
                                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        disabled={isReadOnly}
                                                        className={cn(
                                                            "w-full h-9 justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
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
                                                    disabled={isReadOnly}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side: Category Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Building2 className="h-4 w-4" />
                                <h3 className="text-sm font-bold uppercase tracking-tight">Company / Branch Selection</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 p-4 bg-muted/20 rounded-lg border border-muted-foreground/10">
                                {[
                                    { name: 'tlmc', label: 'TLMC' },
                                    { name: 'sfl', label: 'SFL' },
                                    { name: 'trucking', label: 'Trucking' },
                                    { name: 'maeccDav', label: 'MAECC DAV' },
                                    { name: 'lfc', label: 'LFC' },
                                    { name: 'rentalSpace', label: 'Rental Space' },
                                    { name: 'maeccDeOro', label: 'MAECC De Oro' },
                                    { name: 'maeccMars', label: 'MAECC Mars' },
                                    { name: 'ktr', label: 'KTR' },
                                    { name: 'repacking', label: 'Repacking' },
                                    { name: 'chow2', label: 'Chow 2' },
                                    { name: 'atr', label: 'ATR' },
                                    { name: 'prorate', label: 'Prorate' },
                                    { name: 'riceFarm', label: 'Rice Farm' },
                                    { name: 'jyr', label: 'JYR' },
                                ].map((item) => (
                                    <FormField
                                        key={item.name}
                                        control={form.control}
                                        name={item.name as any}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isReadOnly} />
                                                </FormControl>
                                                <FormLabel className="text-[10px] font-semibold uppercase leading-none cursor-pointer">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="agrivetBranch" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Agrivet Branch</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-muted/30" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="capexBussUnit" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Capex (B.U.)</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-muted/30" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="temporaryChargeTo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Temp Charge To</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-muted/30" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="finalChargeTo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Final Charge To</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-muted/30" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Right Side: Payment Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <CreditCard className="h-4 w-4" />
                                <h3 className="text-sm font-bold uppercase tracking-tight">Payment Details</h3>
                            </div>
                            <div className="space-y-3 p-4 bg-muted/5 rounded-lg border border-dashed">
                                <FormField control={form.control} name="payTo" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Pay To</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm italic font-medium" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="accountNumber" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Account No.</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm font-mono" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="expenseAcct" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Expense Acct</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="receivables" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Receivables</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="othersField" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Others</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm" disabled={isReadOnly} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Particulars</h3>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ qty: 0, unit: '', particulars: '', amount: 0 })} className="h-8 shadow-sm">
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Row
                                </Button>
                            )}
                        </div>
                        <div className="border rounded-md overflow-hidden bg-muted/5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 font-medium"><TableHead className="w-[80px] text-center">Qty</TableHead><TableHead className="w-[100px] text-center">Unit</TableHead><TableHead>Particulars</TableHead><TableHead className="w-[140px] text-right">Amount</TableHead><TableHead className="w-[140px] text-right">Total</TableHead>{!isReadOnly && <TableHead className="w-[40px]"></TableHead>}</TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-muted/10 transition-colors"><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.qty`} render={({ field }) => (<Input {...field} type="number" className="h-8 border-none bg-transparent text-center focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.unit`} render={({ field }) => (<Input {...field} className="h-8 border-none bg-transparent text-center focus-visible:ring-1 focus-visible:bg-background text-xs" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.particulars`} render={({ field }) => (<Input {...field} className="h-8 border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (<Input {...field} type="number" step="0.01" className="h-8 border-none bg-transparent text-right focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="text-right font-medium text-sm pr-4">{((watchedItems[index]?.qty || 0) * (watchedItems[index]?.amount || 0)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>{!isReadOnly && (<TableCell className="p-0 text-center">{fields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>)}</TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 bg-muted/20 border-t gap-3">
                                <FormField
                                    control={form.control}
                                    name="amountInWords"
                                    render={({ field }) => (
                                        <div className="flex flex-1 items-center gap-2 border-b border-muted-foreground/20 w-full sm:w-auto">
                                            <label className="text-[10px] font-bold italic uppercase text-muted-foreground shrink-0">In Words:</label>
                                            <Input {...field} className="flex-1 h-7 border-none shadow-none focus-visible:ring-0 text-xs italic bg-transparent" placeholder="Total amount in words..." disabled={isReadOnly} />
                                        </div>
                                    )}
                                />
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Grand Total</span>
                                    <span className="text-xl font-bold text-primary">
                                        ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-dashed">
                        {[
                            { name: 'preparedBy', label: 'Prepared By:', options: processors },
                            { name: 'verifiedBy', label: 'Verified By:', options: verifiers },
                            { name: 'approvedBy', label: 'Approved By:', options: approvers },
                            { name: 'receivedBy', label: 'Received By:', options: processors },
                        ].map((sig) => (
                            <FormField
                                key={sig.name}
                                control={form.control}
                                name={sig.name as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">{sig.label}</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                            <FormControl>
                                                <SelectTrigger className="h-9 bg-muted/20 border-dashed hover:border-primary transition-colors">
                                                    <SelectValue placeholder="Staff..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sig.options.map((u) => (
                                                    <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>
                                                        {u.firstName} {u.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[9px] text-center text-muted-foreground mt-1 font-mono uppercase italic border-t pt-1">Signature / Date</p>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-3 rounded-md">
                        <p className="text-[10px] text-red-600 dark:text-red-400 font-bold italic text-center uppercase tracking-tight">
                            REMINDER: No alterations and incomplete signatories. ₱200.00 penalty for non-compliance.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t no-print">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : mode === 'edit' ? 'Update Slip' : 'Submit Slip'}
                            </Button>
                        )}
                        <Button type="button" variant="secondary" onClick={() => window.print()} className="gap-2">
                            <Printer className="h-4 w-4" /> Print
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
