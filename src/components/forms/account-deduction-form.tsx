'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Plus, Trash2, Loader2, Printer, MinusCircle } from 'lucide-react';
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
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function AccountDeductionForm({ initialData, mode = 'create', onSuccess, onCancel }: AccountDeductionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
    const isReadOnly = mode === 'view';

    const { user } = useAuth();

    // Filter users by role and specific form access
    const verifiers = userPermissions.filter(u => {
        try {
            const perms = JSON.parse(u.permissions);
            return u.isActive && u.formPermissions === 'Verifier' && perms.includes("ACCOUNT DEDUCTION REQUEST FORM");
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
            position: initialData?.position || '',
            businessUnit: initialData?.businessUnit || '',
            purpose: initialData?.purpose || '',
            chargeTo: initialData?.chargeTo || '',
            accountNo: initialData?.accountNo || '',
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    description: it.description,
                    quantity: it.quantity,
                    unitPrice: it.unitPrice
                }))
                : [{ description: '', quantity: 1, unitPrice: 0 }],
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

    const grandTotal = useMemo(() => {
        return watchedItems.reduce((acc, item) => {
            const total = (item.quantity || 0) * (item.unitPrice || 0);
            return acc + total;
        }, 0);
    }, [watchedItems]);

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
                    amount: grandTotal,
                    formName: 'ACCOUNT DEDUCTION REQUEST FORM',
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
                            <div className="flex items-center gap-2">
                                <MinusCircle className="h-5 w-5 text-destructive" />
                                <h2 className="text-xl font-bold tracking-tight text-primary uppercase">Account Deduction Request</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">Request for payroll or account-based deductions.</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField control={form.control} name="requesterName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Requestor</FormLabel>
                                <FormControl><Input {...field} placeholder="Name" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="position" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Position</FormLabel>
                                <FormControl><Input {...field} placeholder="Position" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" /></FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="businessUnit" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Business Unit</FormLabel>
                                <FormControl><Input {...field} placeholder="Branch / Dept" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" /></FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="purpose" render={({ field }) => (
                            <FormItem className="md:col-span-2 lg:col-span-1">
                                <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Reason / Purpose</FormLabel>
                                <FormControl><Input {...field} placeholder="Deduction reason" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" /></FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="chargeTo" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Charge To</FormLabel>
                                <FormControl><Input {...field} placeholder="Entity to charge" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" /></FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="accountNo" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Account No.</FormLabel>
                                <FormControl><Input {...field} placeholder="ID / Account #" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent text-sm font-mono" /></FormControl>
                            </FormItem>
                        )} />
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Deduction Items</h3>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })} className="h-8 shadow-sm">
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Item
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
                                        <TableRow key={field.id} className="hover:bg-muted/10 transition-colors"><TableCell className="text-center font-mono text-xs">{index + 1}</TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<Input {...field} placeholder="Item description" className="h-8 border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<Input {...field} type="number" className="h-8 border-none bg-transparent text-center focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (<Input {...field} type="number" step="0.01" className="h-8 border-none bg-transparent text-right focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell><TableCell className="text-right font-medium text-sm pr-4">{((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>{!isReadOnly && (<TableCell className="p-0 text-center">{fields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>)}</TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center px-4 py-3 bg-muted/20 border-t">
                                <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Total Deduction Amount</span>
                                <span className="text-xl font-bold text-destructive">
                                    ₱{grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-10 border-t border-dashed">
                        {[
                            { name: 'requesterName', label: 'Requested By:', readOnly: true },
                            { name: 'chargeTo', label: 'Charged To:', readOnly: true },
                            { name: 'verifiedBy', label: 'Verified By:', options: verifiers },
                            { name: 'approvedBy', label: 'Approved By:', options: approvers },
                            { name: 'processedBy', label: 'Processed By:', options: processors },
                        ].map((sig) => (
                            <FormField
                                key={sig.name}
                                control={form.control}
                                name={sig.name as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">{sig.label}</FormLabel>
                                        {sig.options ? (
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
                                        ) : (
                                            <div className="h-9 flex items-center px-3 border-b border-muted-foreground/30 font-medium text-xs">
                                                {field.value}
                                            </div>
                                        )}
                                        <p className="text-[9px] text-center text-muted-foreground mt-1 font-mono uppercase italic border-t pt-1">Signature / Date</p>
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
                            <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : mode === 'edit' ? 'Update Request' : 'Submit Request'}
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
