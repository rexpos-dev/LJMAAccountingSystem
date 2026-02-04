'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Plus, Trash2, Loader2, Printer, ClipboardList, TrendingDown, DollarSign, Calendar as CalendarDays } from 'lucide-react';
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserPermissions } from '@/hooks/use-user-permissions';

const monitoringItemSchema = z.object({
    date: z.date(),
    name: z.string().min(1, 'Name is required'),
    controlNumber: z.string().min(1, 'Control number is required'),
    amount: z.coerce.number().min(0, 'Amount must be at least 0'),
});

const formSchema = z.object({
    businessUnit: z.string().min(1, 'Project Name is required'),
    amount: z.coerce.number().min(1, 'Project Cost is required'),
    items: z.array(monitoringItemSchema),
    endProjectDate: z.date().optional(),
    finalReleaseDate: z.date().optional(),
    validatedBy: z.string().optional(),
    reviewedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContractorMonitoringFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ContractorMonitoringForm({ initialData, mode = 'create', onSuccess, onCancel }: ContractorMonitoringFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [] } = useUserPermissions();
    const isReadOnly = mode === 'view';
    const { user } = useAuth();
    const formName = "CONTRACTOR CASH ADVANCE MONITORING FILE";

    const verifiers = userPermissions.filter(u => u.isActive && u.formPermissions === 'Verifier');
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            businessUnit: initialData?.businessUnit || '',
            amount: initialData?.amount || 0,
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    date: it.date ? new Date(it.date) : new Date(),
                    name: it.description || '',
                    controlNumber: it.controlNumber || '',
                    amount: it.total || it.unitPrice || 0
                }))
                : [{ date: new Date(), name: '', controlNumber: '', amount: 0 }],
            endProjectDate: initialData?.endProjectDate ? new Date(initialData.endProjectDate) : undefined,
            finalReleaseDate: initialData?.finalReleaseDate ? new Date(initialData.finalReleaseDate) : undefined,
            validatedBy: initialData?.validatedBy || '',
            reviewedBy: initialData?.reviewedBy || '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    const watchedItems = form.watch('items');
    const projectCost = form.watch('amount');

    const totalCashAdvance = useMemo(() => {
        return watchedItems.reduce((acc, item) => acc + (item.amount || 0), 0);
    }, [watchedItems]);

    const remainingForRelease = useMemo(() => {
        return (projectCost || 0) - totalCashAdvance;
    }, [projectCost, totalCashAdvance]);

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
                    formName: formName,
                    purpose: `Monitoring for Project: ${data.businessUnit}`,
                    items: data.items.map(item => ({
                        date: item.date,
                        description: item.name,
                        controlNumber: item.controlNumber,
                        quantity: 1,
                        unitPrice: item.amount,
                        total: item.amount
                    }))
                }),
            });

            if (!response.ok) throw new Error(`Failed to ${mode} request`);
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
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-primary" />
                                <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Contractor Monitoring File</h1>
                            </div>
                            <p className="text-sm text-muted-foreground">Tracking cash advances and project cost balances.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-muted/50 border-primary/20">
                                Internal Monitoring
                            </Badge>
                        </div>
                    </div>

                    {/* Main Project Info */}
                    <Card className="bg-muted/5 border-primary/10">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField control={form.control} name="businessUnit" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-muted-foreground flex justify-between">
                                            <span>Project Name</span>
                                            <span className="text-primary/50 text-[10px] italic">Required</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter Project Name..." className="h-11 text-lg font-medium focus-visible:ring-1" disabled={isReadOnly} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="amount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-muted-foreground flex justify-between">
                                            <span>Project Cost</span>
                                            <span className="text-primary/50 text-[10px] italic">Total Budget</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input {...field} type="number" step="0.01" className="h-11 pl-9 text-lg font-bold text-primary focus-visible:ring-1" disabled={isReadOnly} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monitoring Table */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Disbursement History</h3>
                                <Badge variant="secondary" className="h-5 font-mono text-[10px]">{fields.length} Entries</Badge>
                            </div>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ date: new Date(), name: '', controlNumber: '', amount: 0 })} className="h-8 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5">
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Disbursement
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent"><TableHead className="w-[180px] text-xs font-bold uppercase text-center">Date</TableHead><TableHead className="text-xs font-bold uppercase">Name / Particulars</TableHead><TableHead className="w-[200px] text-xs font-bold uppercase text-center">Control Number</TableHead><TableHead className="w-[180px] text-xs font-bold uppercase text-right px-6">Amount</TableHead>{!isReadOnly && <TableHead className="w-[50px]"></TableHead>}</TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-muted/5 group"><TableCell className="p-2"><FormField control={form.control} name={`items.${index}.date`} render={({ field }) => (<Popover><PopoverTrigger asChild><FormControl><Button variant="ghost" className={cn("w-full h-9 justify-center text-center font-normal", !field.value && "text-muted-foreground")} disabled={isReadOnly}><CalendarIcon className="mr-2 h-3 w-3 opacity-50" />{field.value ? format(field.value, "MM/dd/yy") : "Select"}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="center"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={isReadOnly} /></PopoverContent></Popover>)} /></TableCell><TableCell className="p-2"><FormField control={form.control} name={`items.${index}.name`} render={({ field }) => (<FormControl><Input {...field} className="h-9 border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" placeholder="Description..." disabled={isReadOnly} /></FormControl>)} /></TableCell><TableCell className="p-2"><FormField control={form.control} name={`items.${index}.controlNumber`} render={({ field }) => (<FormControl><Input {...field} className="h-9 border-none bg-transparent text-center font-mono text-sm focus-visible:ring-1 focus-visible:bg-background" placeholder="CN-0000" disabled={isReadOnly} /></FormControl>)} /></TableCell><TableCell className="p-2 px-6"><FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (<FormControl><Input {...field} type="number" step="0.01" className="h-9 border-none bg-transparent text-right font-bold focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} /></FormControl>)} /></TableCell>{!isReadOnly && (<TableCell className="p-2 text-center"><Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-destructive transition-colors" onClick={() => remove(index)} disabled={fields.length === 1}><Trash2 className="h-4 w-4" /></Button></TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card className="bg-primary/5 border-primary/10 shadow-none">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-1">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Total Project Cost</span>
                                <span className="text-xl font-black text-primary">Php {projectCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-orange-500/5 border-orange-500/10 shadow-none">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-1">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest text-orange-600/70">Total Cash Advance</span>
                                <span className="text-xl font-black text-orange-600">Php {totalCashAdvance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-500/5 border-green-500/10 shadow-none border-2 border-green-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 opacity-10"><TrendingDown className="h-12 w-12" /></div>
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-1">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest text-green-600/70">Remaining for Release</span>
                                <span className="text-xl font-black text-green-600">Php {remainingForRelease.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Footer Dates & Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarDays className="h-4 w-4 text-primary/60" />
                                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Project Timeline</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="endProjectDate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">End Project Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className={cn("w-full h-10 text-xs", !field.value && "text-muted-foreground")} disabled={isReadOnly}>
                                                        {field.value ? format(field.value, "PP") : "Select date"}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={isReadOnly} />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="finalReleaseDate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Final Release Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className={cn("w-full h-10 text-xs", !field.value && "text-muted-foreground")} disabled={isReadOnly}>
                                                        {field.value ? format(field.value, "PP") : "Select date"}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={isReadOnly} />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="h-4 w-4 text-primary/60" />
                                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Responsibility</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="validatedBy" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Validated by</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                            <FormControl><SelectTrigger className="h-10 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {verifiers.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <div className="text-[8px] text-center pt-1 italic text-muted-foreground uppercase border-t mt-1">Personnel / Date</div>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="reviewedBy" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Reviewed by</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                            <FormControl><SelectTrigger className="h-10 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {approvers.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <div className="text-[8px] text-center pt-1 italic text-muted-foreground uppercase border-t mt-1">Management / Date</div>
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t no-print">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" disabled={isSubmitting} className="min-w-[140px] shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : mode === 'edit' ? 'Update Monitoring' : 'Save Monitoring File'}
                            </Button>
                        )}
                        <Button type="button" variant="secondary" onClick={() => window.print()} className="gap-2">
                            <Printer className="h-4 w-4" /> Print Document
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
