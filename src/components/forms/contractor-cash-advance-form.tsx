'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Plus, Trash2, Loader2, Printer, FileText } from 'lucide-react';
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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useUserPermissions } from '@/hooks/use-user-permissions';

const requestItemSchema = z.object({
    description: z.string().min(1, 'Purpose/Description is required'),
    amount: z.coerce.number().min(1, 'Amount must be at least 1'),
});

const formSchema = z.object({
    date: z.date(),
    businessUnit: z.string().min(1, 'Project Title / JO is required'),
    requesterName: z.string().min(1, 'Requestor is required'),
    tempChargeTo: z.string().optional(),
    tempAccountNo: z.string().optional(),
    chargeTo: z.string().min(1, 'Final Charge To is required'),
    accountNo: z.string().min(1, 'Account No. is required'),
    items: z.array(requestItemSchema).min(1, 'At least one item is required'),
    // Signatures
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    processedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContractorCashAdvanceFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ContractorCashAdvanceForm({ initialData, mode = 'create', onSuccess, onCancel }: ContractorCashAdvanceFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
    const isReadOnly = mode === 'view';
    const { user } = useAuth();
    const formName = "CASH ADVANCE REQUEST FOR CONTRACTOR";

    const verifiers = userPermissions.filter(u => {
        try {
            const perms = JSON.parse(u.permissions || '[]');
            return u.isActive && u.formPermissions === 'Verifier' && perms.includes(formName);
        } catch { return false; }
    });
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const processors = userPermissions.filter(u => u.isActive && (u.accountType === 'AdminStaff' || u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const currentUserName = `${user?.firstName} ${user?.lastName}`;
    const currentVerifierName = verifiers.find(v => v.username === user?.username) ? currentUserName : '';

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            businessUnit: initialData?.businessUnit || '',
            requesterName: initialData?.requesterName || '',
            tempChargeTo: initialData?.tempChargeTo || '',
            tempAccountNo: initialData?.tempAccountNo || '',
            chargeTo: initialData?.chargeTo || '',
            accountNo: initialData?.accountNo || '',
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    description: it.description,
                    amount: it.total || it.unitPrice || 0
                }))
                : [{ description: '', amount: 0 }],
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
        return watchedItems.reduce((acc, item) => acc + (item.amount || 0), 0);
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
                    formName: formName,
                    items: data.items.map(item => ({
                        description: item.description,
                        quantity: 1,
                        unitPrice: item.amount,
                        total: item.amount
                    }))
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-bold tracking-tight text-primary uppercase">Contractor Cash Advance</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">Cash advance request specifically for contracted projects and JOs.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Control No.</span>
                                <Input className="w-32 h-9 bg-muted/20 border-dashed" placeholder="Auto" readOnly />
                            </div>
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col min-w-[200px]">
                                        <FormLabel className="text-[10px] font-bold text-muted-foreground uppercase">Request Date</FormLabel>
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Project Details Card */}
                        <Card className="bg-muted/5">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider">Project & Requestor</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <FormField control={form.control} name="businessUnit" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Project Title / JO</FormLabel>
                                        <FormControl><Input {...field} placeholder="Project name or JO#" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="requesterName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">Contractor / Requestor</FormLabel>
                                        <FormControl><Input {...field} placeholder="Name of contractor" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        {/* Charging Details Card */}
                        <Card className="bg-muted/5">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider">Charging Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="tempChargeTo" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase text-muted-foreground line-clamp-1">Temp Charge To</FormLabel>
                                            <FormControl><Input {...field} placeholder="Entity" disabled={isReadOnly} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="tempAccountNo" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase text-muted-foreground line-clamp-1">Account No.</FormLabel>
                                            <FormControl><Input {...field} placeholder="Acc#" disabled={isReadOnly} className="font-mono text-xs" /></FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="chargeTo" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase text-muted-foreground line-clamp-1">Final Charge To</FormLabel>
                                            <FormControl><Input {...field} placeholder="Entity" disabled={isReadOnly} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="accountNo" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-semibold uppercase text-muted-foreground line-clamp-1">Account No.</FormLabel>
                                            <FormControl><Input {...field} placeholder="Acc#" disabled={isReadOnly} className="font-mono text-xs" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Purpose and Amounts */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Purpose & Expenditure</h3>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', amount: 0 })} className="h-8">
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Row
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow><TableHead className="w-[50px] text-center">#</TableHead><TableHead>Detailed Purpose</TableHead><TableHead className="w-[200px] text-right">Amount</TableHead>{!isReadOnly && <TableHead className="w-[50px]"></TableHead>}</TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-muted/5"><TableCell className="text-center font-mono text-xs text-muted-foreground">{index + 1}</TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<Textarea {...field} placeholder="Describe the purpose of this amount..." className="min-h-[60px] border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background resize-none" disabled={isReadOnly} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (<Input {...field} type="number" step="0.01" className="h-10 border-none bg-transparent text-right font-bold text-lg focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} />)} /></TableCell>{!isReadOnly && (<TableCell className="p-0 text-center">{fields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>)}</TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center px-6 py-4 bg-muted/20 border-t">
                                <Badge variant="outline" className="text-[10px] py-0 px-2 uppercase tracking-tighter">Total Release Amount</Badge>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Php</span>
                                    <span className="text-2xl font-black text-primary">
                                        {grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Authorization Box */}
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg italic text-sm text-center leading-relaxed text-muted-foreground">
                        "I, as the Contractor, hereby authorize the cash advance to be taken from the total Job Order Project Cost, and further authorize the Contractee to process, release, and deduct said amount as required under company policy."
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-dashed">
                        {[
                            { name: 'requesterName', label: 'Contractor:', readOnly: true },
                            { name: 'verifiedBy', label: 'Verified by:', options: verifiers },
                            { name: 'approvedBy', label: 'Approved by:', options: approvers },
                            { name: 'processedBy', label: 'Processed by:', options: processors },
                        ].map((sig) => (
                            <FormField
                                key={sig.label}
                                control={form.control}
                                name={sig.name as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">{sig.label}</FormLabel>
                                        {sig.options ? (
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className="h-9 bg-muted/20 border-dashed hover:border-primary transition-colors">
                                                        <SelectValue placeholder="Select..." />
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
                                            <div className="h-9 flex items-center px-3 border-b border-muted-foreground/30 font-medium text-xs truncate">
                                                {field.value}
                                            </div>
                                        )}
                                        <p className="text-[9px] text-center text-muted-foreground mt-1 font-mono uppercase italic border-t pt-1">Name / Signature / Date</p>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t no-print">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" disabled={isSubmitting} className="min-w-[140px] shadow-lg">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : mode === 'edit' ? 'Update Request' : 'Submit Request'}
                            </Button>
                        )}
                        <Button type="button" variant="secondary" onClick={() => window.print()} className="gap-2">
                            <Printer className="h-4 w-4" /> Print Form
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
