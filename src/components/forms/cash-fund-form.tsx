'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2, DollarSign, Printer } from 'lucide-react';
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
import { useUserPermissions } from '@/hooks/use-user-permissions';

// Schema Definition
const formSchema = z.object({
    controlNo: z.string().optional(),
    date: z.date(),
    requesterName: z.string().min(1, 'Requestor Name is required'),
    position: z.string().min(1, 'Position is required'),
    tempChargeTo: z.string().optional(),
    tempAccountNo: z.string().optional(),
    finalChargeTo: z.string().optional(),
    finalAccountNo: z.string().optional(),
    purpose: z.string().min(1, 'Purpose is required'),
    amount: z.coerce.number().min(0, 'Amount must be positive'),
    // Signatures
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    processedBy: z.string().optional(),
    releasedReceivedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CashFundFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CashFundForm({ initialData, mode = 'create', onSuccess, onCancel }: CashFundFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
    const isReadOnly = mode === 'view';

    const { user } = useAuth();

    // Filter users by role and specific form access
    const verifiers = userPermissions.filter(u => {
        try {
            const perms = JSON.parse(u.permissions);
            return u.isActive && u.formPermissions === 'Verifier' && perms.includes("CASH / FUND REQUEST FORM");
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
            requesterName: initialData?.requesterName || '',
            position: initialData?.position || '',
            tempChargeTo: initialData?.chargeTo || '',
            tempAccountNo: initialData?.accountNo || '',
            finalChargeTo: '', // Not in DB yet?
            finalAccountNo: '',
            purpose: initialData?.purpose || '',
            amount: initialData?.amount || 0,
            verifiedBy: initialData?.verifiedBy || currentVerifierName,
            approvedBy: initialData?.approvedBy || '',
            processedBy: initialData?.processedBy || '',
            releasedReceivedBy: '',
        },
    });

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
                    chargeTo: data.tempChargeTo,
                    accountNo: data.tempAccountNo,
                    formName: 'CASH / FUND REQUEST FORM'
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
                            <h2 className="text-xl font-bold tracking-tight text-primary uppercase">Cash / Fund Request Form</h2>
                            <p className="text-sm text-muted-foreground">Request for petty cash, travel funds, or other immediate disbursements.</p>
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
                                <FormControl><Input {...field} placeholder="Enter name" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="position" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Position</FormLabel>
                                <FormControl><Input {...field} placeholder="Enter position" disabled={isReadOnly} className="bg-muted/30 focus-visible:bg-transparent" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-1">
                            <FormField control={form.control} name="tempChargeTo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Charge To</FormLabel>
                                    <FormControl><Input {...field} placeholder="..." disabled={isReadOnly} className="bg-muted/30" /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="tempAccountNo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Account No.</FormLabel>
                                    <FormControl><Input {...field} placeholder="..." disabled={isReadOnly} className="bg-muted/30" /></FormControl>
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <FormField control={form.control} name="purpose" render={({ field }) => (
                            <FormItem className="lg:col-span-3">
                                <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Purpose of Fund Request</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Provide detailed explanation for this request..." className="min-h-[120px] bg-muted/30 focus-visible:bg-transparent" disabled={isReadOnly} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="flex flex-col gap-4">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Amount Requested</FormLabel>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                            <span className="text-lg font-bold">₱</span>
                                        </div>
                                        <FormControl>
                                            <Input {...field} type="number" className="h-24 text-3xl font-bold pl-10 bg-primary/5 border-primary/20 text-primary text-center" disabled={isReadOnly} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-md">
                                <p className="text-[9px] text-red-600 dark:text-red-400 font-bold italic leading-tight uppercase">
                                    Required: Official Receipts or invoices for liquidation.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-10 border-t border-dashed">
                        {[
                            { name: 'requesterName', label: 'Requested By:', readOnly: true },
                            { name: 'verifiedBy', label: 'Verified By:', options: verifiers },
                            { name: 'approvedBy', label: 'Approved By:', options: approvers },
                            { name: 'processedBy', label: 'Processed By:', options: processors },
                            { name: 'releasedReceivedBy', label: 'Released By:', options: processors },
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
