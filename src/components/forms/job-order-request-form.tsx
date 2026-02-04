'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Plus, Trash2, Loader2, Printer } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useUserPermissions } from '@/hooks/use-user-permissions';

const itemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.coerce.number().min(1, 'Qty must be at least 1'),
    unit: z.string().optional(),
    unitPrice: z.coerce.number().min(0).optional(),
});

const formSchema = z.object({
    date: z.date(),
    requesterName: z.string().min(1, 'Requestor name is required'),
    department: z.string().min(1, 'Department is required'),
    natureOfWork: z.string().min(1, 'Nature of work is required'),
    location: z.string().optional(),
    items: z.array(itemSchema).min(1, 'At least one item is required'),
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    processedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JobOrderRequestFormProps {
    formName?: string;
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function JobOrderRequestForm({ formName = 'JOB ORDER REQUEST FORM', initialData, mode = 'create', onSuccess, onCancel }: JobOrderRequestFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
    const isReadOnly = mode === 'view';

    const { user } = useAuth();

    // Filter users by role and specific form access
    const verifiers = userPermissions.filter(u => {
        try {
            const perms = JSON.parse(u.permissions);
            return u.isActive && u.formPermissions === 'Verifier' && perms.includes(formName);
        } catch { return false; }
    });
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const processors = userPermissions.filter(u => u.isActive && (u.accountType === 'AdminStaff' || u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const currentVerifierName = verifiers.find(v => v.username === user?.username) ? `${user?.firstName} ${user?.lastName}` : '';

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            requesterName: initialData?.requesterName || '',
            department: initialData?.department || '',
            natureOfWork: initialData?.purpose || '',
            location: initialData?.businessUnit || '',
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    description: it.description,
                    quantity: it.quantity,
                    unit: it.unit || '',
                    unitPrice: it.unitPrice || 0
                }))
                : [{ description: '', quantity: 1, unit: '', unitPrice: 0 }],
            verifiedBy: initialData?.verifiedBy || currentVerifierName,
            approvedBy: initialData?.approvedBy || '',
            processedBy: initialData?.processedBy || '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    const watchedItems = form.watch('items');
    const grandTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0);

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
                    purpose: data.natureOfWork,
                    businessUnit: data.location,
                    amount: grandTotal,
                    formName: formName
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${mode} request`);
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
                            <h2 className="text-xl font-bold tracking-tight text-primary uppercase">{formName}</h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold italic">Maintenance and Engineering Department</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Control No.</span>
                                <Input className="w-32 h-9 bg-muted/20 border-dashed" placeholder="Auto-generated" readOnly />
                            </div>
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col min-w-[200px]">
                                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Date Needed</FormLabel>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="requesterName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Requested By</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Name" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Dept / Branch</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Department name" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Location</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Work location" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="natureOfWork"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2 lg:col-span-3">
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Nature of Work</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Describe the work involved..." disabled={isReadOnly} className="min-h-[80px] bg-muted/30 focus-visible:bg-transparent resize-none h-20" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Materials / Spare Parts Needed</h3>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, unit: '', unitPrice: 0 })} className="h-8 shadow-sm">
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Material
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-md overflow-hidden bg-muted/5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30"><TableHead className="w-[50px] text-center">#</TableHead><TableHead>Description</TableHead><TableHead className="w-[80px] text-center">Qty</TableHead><TableHead className="w-[100px] text-center">Unit</TableHead><TableHead className="w-[140px] text-right">Unit Price</TableHead><TableHead className="w-[140px] text-right">Total</TableHead>{!isReadOnly && <TableHead className="w-[40px]"></TableHead>}</TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-muted/10 transition-colors"><TableCell className="text-center font-mono text-xs">{index + 1}</TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<Input {...field} placeholder="Material description" className="h-8 border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<Input {...field} type="number" className="h-8 border-none bg-transparent text-center focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.unit`} render={({ field }) => (<Input {...field} placeholder="pcs/sets..." className="h-8 border-none bg-transparent text-center focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (<Input {...field} type="number" step="0.01" className="h-8 border-none bg-transparent text-right focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="text-right font-medium text-sm pr-4">{((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>{!isReadOnly && (<TableCell className="p-0 text-center">{fields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>)}</TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center px-4 py-3 bg-muted/20 border-t">
                                <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Estimated Material Cost</span>
                                <span className="text-lg font-bold text-primary">
                                    {grandTotal.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-dashed">
                        {[
                            { name: 'verifiedBy', label: 'Verified By (Supervisor):', options: verifiers },
                            { name: 'approvedBy', label: 'Approved By (Manager):', options: approvers },
                            { name: 'processedBy', label: 'Processed By (Admin Staff):', options: processors },
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
                                                <SelectTrigger className="h-9 bg-transparent border-t-0 border-x-0 border-b border-muted-foreground/30 rounded-none shadow-none px-0 hover:border-primary transition-colors focus:ring-0">
                                                    <SelectValue placeholder="Select signatory..." />
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
                                        <p className="text-[9px] text-center text-muted-foreground mt-1 font-mono uppercase italic">Signature Over Printed Name / Date</p>
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
                                        Processing...
                                    </>
                                ) : mode === 'edit' ? 'Update Job Order' : 'Submit Job Order'}
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
