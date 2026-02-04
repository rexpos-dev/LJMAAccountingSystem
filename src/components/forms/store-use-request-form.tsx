'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
    Store,
    Loader2,
    Printer,
    Plus,
    Trash2,
    User,
    Briefcase,
    FileText,
    Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { useUserPermissions } from '@/hooks/use-user-permissions';

const formSchema = z.object({
    requesterName: z.string().min(1, 'Requestor is required'),
    position: z.string().min(1, 'Position is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    items: z.array(z.object({
        description: z.string().min(1, 'Description is required'),
        quantity: z.coerce.number().min(0.01, 'Qty > 0'),
        price: z.coerce.number().min(0, 'Price >= 0'),
        total: z.coerce.number().min(0),
    })).min(1, 'At least one item is required'),
    total: z.coerce.number().min(0),
    requestedBy: z.string().optional(),
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    processedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface StoreUseRequestFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function StoreUseRequestForm({ initialData, mode = 'create', onSuccess, onCancel }: StoreUseRequestFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [] } = useUserPermissions();
    const isReadOnly = mode === 'view';
    const { user } = useAuth();
    const formName = "STORE USE REQUEST FORM";

    // Permissions for signatures
    const verifiers = userPermissions.filter(u => u.isActive && (u.accountType === 'Verifier' || u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Approver' || u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const processors = userPermissions.filter(u => u.isActive && (u.accountType === 'Processor' || u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requesterName: initialData?.requesterName || (user ? `${user.firstName} ${user.lastName}` : ''),
            position: initialData?.position || '',
            purpose: initialData?.purpose || '',
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    description: it.description || '',
                    quantity: it.quantity || 1,
                    price: it.unitPrice || 0,
                    total: it.total || 0
                }))
                : [{ description: '', quantity: 1, price: 0, total: 0 }],
            total: initialData?.total || 0,
            requestedBy: initialData?.requestedBy || (user ? `${user.firstName} ${user.lastName}` : ''),
            verifiedBy: initialData?.verifiedBy || '',
            approvedBy: initialData?.approvedBy || '',
            processedBy: initialData?.processedBy || '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const watchItems = form.watch("items");

    // Update row totals and grand total
    useEffect(() => {
        const calculateTotals = () => {
            let grandTotal = 0;
            const currentItems = form.getValues("items");

            currentItems.forEach((item, index) => {
                const total = Number(item.quantity) * Number(item.price);
                if (item.total !== total) {
                    form.setValue(`items.${index}.total` as any, total);
                }
                grandTotal += total;
            });

            if (form.getValues("total") !== grandTotal) {
                form.setValue("total", grandTotal);
            }
        };

        calculateTotals();
    }, [watchItems, form]);

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
                    amount: data.total,
                    items: data.items.map(it => ({
                        description: it.description,
                        quantity: it.quantity,
                        unitPrice: it.price,
                        total: it.total
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Store className="h-5 w-5 text-primary" />
                                <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Store Use Request Form</h1>
                            </div>
                            <p className="text-sm text-muted-foreground italic text-[10px] uppercase">Internal authorization for warehouse or store inventory usage.</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-muted/50 border-primary/20">
                                Date: {format(new Date(), 'PP')}
                            </Badge>
                        </div>
                    </div>

                    {/* Header Grid: Requestor & Purpose */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Section 1: Requestor Details */}
                        <Card className="shadow-sm border-primary/10 flex flex-col">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" /> Requestor Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow space-y-1.5">
                                <FormField control={form.control} name="requesterName" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Requestor</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2 font-semibold" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="position" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Position</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        {/* Section 2: Purpose */}
                        <Card className="shadow-sm border-primary/10 flex flex-col">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5" /> Purpose of Request
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                                <FormField control={form.control} name="purpose" render={({ field }) => (
                                    <FormItem className="h-full space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Specific Purpose</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} className="min-h-[60px] resize-none h-full text-sm leading-relaxed" placeholder="State reason for store use..." disabled={isReadOnly} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Items Table Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Plus className="h-3 w-3" /> Item Description
                            </h3>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" className="h-7 text-[9px] uppercase font-bold gap-1 border-primary/20 hover:bg-primary/5" onClick={() => append({ description: '', quantity: 1, price: 0, total: 0 })}>
                                    <Plus className="h-2.5 w-2.5" /> Add New Item
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-md overflow-hidden bg-background shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-b"><TableHead className="w-[40px] text-center border-r font-black text-[9px] uppercase">No.</TableHead><TableHead className="font-black text-[9px] uppercase border-r">Detailed Description</TableHead><TableHead className="w-[100px] text-center font-black text-[9px] uppercase border-r">Quantity</TableHead><TableHead className="w-[120px] text-right font-black text-[9px] uppercase border-r">Unit Price</TableHead><TableHead className="w-[140px] text-right font-black text-[9px] uppercase">Amount</TableHead>{!isReadOnly && <TableHead className="w-[40px]"></TableHead>}</TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-muted/5 border-b last:border-0 h-10"><TableCell className="text-center border-r text-[10px] font-bold text-muted-foreground p-0 px-2 h-10">{index + 1}</TableCell><TableCell className="p-0 h-10 border-r"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormItem className="p-0"><FormControl><Input {...field} className="h-10 border-none px-3 text-xs focus-visible:ring-0 rounded-none bg-transparent" disabled={isReadOnly} /></FormControl></FormItem>)} /></TableCell><TableCell className="p-0 h-10 border-r text-center"><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem className="p-0"><FormControl><Input {...field} type="number" step="0.01" className="h-10 border-none px-2 text-center text-xs focus-visible:ring-0 rounded-none bg-transparent" disabled={isReadOnly} /></FormControl></FormItem>)} /></TableCell><TableCell className="p-0 h-10 border-r text-right"><FormField control={form.control} name={`items.${index}.price`} render={({ field }) => (<FormItem className="p-0"><FormControl><Input {...field} type="number" step="0.01" className="h-10 border-none px-2 text-right text-xs focus-visible:ring-0 rounded-none bg-transparent" disabled={isReadOnly} /></FormControl></FormItem>)} /></TableCell><TableCell className="p-0 h-10 text-right pr-4 font-bold text-xs bg-muted/5 select-none">₱{watchItems[index]?.total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>{!isReadOnly && (<TableCell className="p-0 text-center h-10"><Button type="button" variant="ghost" size="sm" className="h-10 w-full rounded-none hover:bg-destructive/10 hover:text-destructive text-muted-foreground" onClick={() => remove(index)} disabled={fields.length === 1}><Trash2 className="h-3 w-3" /></Button></TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="bg-primary/5 border-t p-3 flex justify-between items-center px-6">
                                <div className="flex items-center gap-2">
                                    <Calculator className="h-4 w-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">GRAND TOTAL</span>
                                </div>
                                <span className="text-xl font-black text-primary tracking-tighter">
                                    ₱{form.watch("total").toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer: Multi-Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t">
                        <FormField control={form.control} name="requestedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Requested by</FormLabel>
                                <FormControl><Input {...field} className="h-8 text-[11px] text-center font-bold px-0 border-x-0 border-t-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:border-primary" disabled={isReadOnly} /></FormControl>
                                <div className="text-[7px] text-center pt-1 italic text-muted-foreground uppercase">Name / Signature / Date</div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="verifiedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Verified by</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                    <FormControl>
                                        <SelectTrigger className="h-8 text-[11px] text-center font-bold px-0 border-x-0 border-t-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:border-primary">
                                            <SelectValue placeholder="VERIFIER" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {verifiers.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="text-[7px] text-center pt-1 italic text-muted-foreground uppercase">Name / Signature / Date</div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="approvedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Approved by</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                    <FormControl>
                                        <SelectTrigger className="h-8 text-[11px] text-center font-bold px-0 border-x-0 border-t-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:border-primary">
                                            <SelectValue placeholder="APPROVER" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {approvers.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="text-[7px] text-center pt-1 italic text-muted-foreground uppercase">Name / Signature / Date</div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="processedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Processed by</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                    <FormControl>
                                        <SelectTrigger className="h-8 text-[11px] text-center font-bold px-0 border-x-0 border-t-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:border-primary">
                                            <SelectValue placeholder="PROCESSOR" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {processors.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="text-[7px] text-center pt-1 italic text-muted-foreground uppercase">Name / Signature / Date</div>
                            </FormItem>
                        )} />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t no-print">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" disabled={isSubmitting} className="min-w-[150px] shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : mode === 'edit' ? 'Update Request' : 'Submit Request'}
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
