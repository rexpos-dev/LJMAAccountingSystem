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
    amount: z.coerce.number().min(0, 'Amount is required'),
});

const formSchema = z.object({
    date: z.date(),
    requestor: z.string().min(1, 'Requestor is required'),
    position: z.string().optional(),
    businessUnit: z.string().min(1, 'Business Unit is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    chargeTo: z.string().optional(),
    accountNo: z.string().optional(),
    items: z.array(itemSchema).min(1, 'At least one item is required'),
    requestedBy: z.string().optional(),
    checkedBy: z.string().optional(),
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    processedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MaterialsRequestFormProps {
    formName?: string;
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function MaterialsRequestForm({ formName = 'MATERIALS REQUEST FORM', initialData, mode = 'create', onSuccess, onCancel }: MaterialsRequestFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [] } = useUserPermissions();
    const isReadOnly = mode === 'view';
    const { user } = useAuth();

    // Filter users by role
    const staff = userPermissions.filter(u => u.isActive);
    const verifiers = userPermissions.filter(u => {
        try {
            const perms = JSON.parse(u.permissions);
            return u.isActive && (u.formPermissions === 'Verifier' || u.accountType === 'Admin') && perms.includes(formName);
        } catch { return false; }
    });
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const currentUserName = `${user?.firstName} ${user?.lastName}`;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            requestor: initialData?.requesterName || initialData?.requestor || '',
            position: initialData?.position || '',
            businessUnit: initialData?.businessUnit || '',
            purpose: initialData?.purpose || '',
            chargeTo: initialData?.chargeTo || '',
            accountNo: initialData?.accountNo || '',
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    description: it.description,
                    quantity: it.quantity,
                    amount: it.unitPrice || it.amount || 0
                }))
                : [{ description: '', quantity: 1, amount: 0 }],
            requestedBy: initialData?.requestedBy || currentUserName,
            checkedBy: initialData?.checkedBy || '',
            verifiedBy: initialData?.verifiedBy || '',
            approvedBy: initialData?.approvedBy || '',
            processedBy: initialData?.processedBy || '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    const watchedItems = form.watch('items');
    const grandTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * (item.amount || 0)), 0);

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
                    requesterName: data.requestor,
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
                            <p className="text-sm text-muted-foreground">{formName === 'MATERIAL/FUEL REQUEST FORM' ? 'Request for fuel, oil, or vehicle maintenance supplies.' : 'Submit a request for specific materials or supplies.'}</p>
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
                                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Date of Request</FormLabel>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="requestor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Requestor</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Name" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Position</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Job position" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="businessUnit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Business Unit</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Unit/Branch" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2 lg:col-span-1">
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Purpose</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Reason for request" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="chargeTo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Charge To</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="accountNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Account No.</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Materials Details</h3>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, amount: 0 })} className="h-8 shadow-sm">
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Material
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-md overflow-hidden bg-muted/5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30"><TableHead className="w-[50px] text-center">#</TableHead><TableHead>Description</TableHead><TableHead className="w-[100px] text-center">Qty</TableHead><TableHead className="w-[140px] text-right">Unit Price</TableHead><TableHead className="w-[140px] text-right">Total</TableHead>{!isReadOnly && <TableHead className="w-[40px]"></TableHead>}</TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-muted/10 transition-colors"><TableCell className="text-center font-mono text-xs">{index + 1}</TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<Input {...field} placeholder="Enter material description" className="h-8 border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<Input {...field} type="number" className="h-8 border-none bg-transparent text-center focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (<Input {...field} type="number" className="h-8 border-none bg-transparent text-right focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="text-right font-medium text-sm pr-4">{((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.amount || 0)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>{!isReadOnly && (<TableCell className="p-0 text-center">{fields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>)}</TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center px-4 py-3 bg-muted/20 border-t">
                                <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Grand Total</span>
                                <span className="text-lg font-bold text-primary">
                                    {grandTotal.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-6 border-t border-dashed">
                        {[
                            { name: 'requestedBy', label: 'Requested By:', options: staff },
                            { name: 'checkedBy', label: 'Checked By:', options: staff },
                            { name: 'verifiedBy', label: 'Verified By:', options: verifiers },
                            { name: 'approvedBy', label: 'Approved By:', options: approvers },
                            { name: 'processedBy', label: 'Processed By:', options: staff },
                        ].map((sig) => (
                            <FormField
                                key={sig.name}
                                control={form.control}
                                name={sig.name as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-muted-foreground">{sig.label}</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                            <FormControl>
                                                <SelectTrigger className="h-9 bg-muted/20 border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors">
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
                                        <div className="mt-2 h-[1px] bg-muted-foreground/10" />
                                        <p className="text-[9px] text-center text-muted-foreground mt-1 font-mono uppercase italic">Signature / Date</p>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t no-print">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : mode === 'edit' ? 'Update Request' : 'Submit Request'}
                            </Button>
                        )}
                        <Button type="button" variant="secondary" onClick={() => window.print()} className="gap-2 shadow-sm">
                            <Printer className="h-4 w-4" /> Print
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
