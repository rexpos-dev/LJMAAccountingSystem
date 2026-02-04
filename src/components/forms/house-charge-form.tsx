'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Loader2, Printer, Home, User, CreditCard, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
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
import { Separator } from '@/components/ui/separator';
import { useUserPermissions } from '@/hooks/use-user-permissions';

const requestItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.coerce.number().min(1, 'Min 1'),
    unitPrice: z.coerce.number().min(0, 'Min 0'),
    total: z.coerce.number(),
});

const formSchema = z.object({
    requesterName: z.string().min(1, 'Requestor is required'),
    position: z.string().min(1, 'Position is required'),
    businessUnit: z.string().min(1, 'Business Unit is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    chargeTo: z.string().min(1, 'Charge To is required'),
    accountNo: z.string().min(1, 'Account No. is required'),
    items: z.array(requestItemSchema).min(1, 'At least one item is required'),
    requestedBy: z.string().optional(),
    chargeToName: z.string().optional(),
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    processedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HouseChargeFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function HouseChargeForm({ initialData, mode = 'create', onSuccess, onCancel }: HouseChargeFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [] } = useUserPermissions();
    const isReadOnly = mode === 'view';
    const { user } = useAuth();
    const formName = "HOUSE CHARGE REQUEST FORM";

    const verifiers = userPermissions.filter(u => u.isActive && u.formPermissions === 'Verifier');
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const processors = userPermissions.filter(u => u.isActive && u.formPermissions === 'Processor');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requesterName: initialData?.requesterName || (user ? `${user.firstName} ${user.lastName}` : ''),
            position: initialData?.position || '',
            businessUnit: initialData?.businessUnit || '',
            purpose: initialData?.purpose || '',
            chargeTo: initialData?.chargeTo || '',
            accountNo: initialData?.accountNo || '',
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    description: it.description || '',
                    quantity: it.quantity || 1,
                    unitPrice: it.unitPrice || 0,
                    total: it.total || 0
                }))
                : [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
            requestedBy: initialData?.requestedBy || (user ? `${user.firstName} ${user.lastName}` : ''),
            chargeToName: initialData?.chargeToName || '',
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
    const grandTotal = useMemo(() => {
        return watchedItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice || 0), 0);
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
                    formName: formName,
                    amount: grandTotal,
                    items: data.items.map(item => ({
                        ...item,
                        total: item.quantity * item.unitPrice
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
                                <Home className="h-5 w-5 text-primary" />
                                <h1 className="text-xl font-bold tracking-tight text-primary uppercase">House Charge Request</h1>
                            </div>
                            <p className="text-sm text-muted-foreground italic">Standard request form for internal house charges.</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-muted/50">
                                Date: {format(new Date(), 'PP')}
                            </Badge>
                        </div>
                    </div>

                    {/* Header Sections Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Section 1: Requestor Details */}
                        <Card className="shadow-sm border-primary/10 flex flex-col">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" /> Requestor Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow space-y-1.5">
                                <FormField control={form.control} name="requesterName" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Requestor</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
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
                                <FormField control={form.control} name="businessUnit" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Business Unit / From</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="purpose" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Purpose</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        {/* Section 2: Charging Details */}
                        <Card className="shadow-sm border-primary/10 flex flex-col">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <CreditCard className="h-3.5 w-3.5" /> Charging Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow space-y-1.5">
                                <FormField control={form.control} name="chargeTo" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Charge To</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="accountNo" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Account No.</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Section 3: Items Table */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-4 w-4 text-primary/60" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Description</h3>
                            </div>
                            {!isReadOnly && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, total: 0 })} className="h-7 text-[10px] uppercase font-bold text-primary hover:text-primary/80 hover:bg-primary/5">
                                    <Plus className="mr-1.5 h-3 w-3" /> Add Row
                                </Button>
                            )}
                        </div>

                        <div className="border rounded-lg overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow className="h-9"><TableHead className="w-[50px] text-[10px] font-bold uppercase text-center">No.</TableHead><TableHead className="text-[10px] font-bold uppercase">Description</TableHead><TableHead className="w-[80px] text-[10px] font-bold uppercase text-center">Qty</TableHead><TableHead className="w-[120px] text-[10px] font-bold uppercase text-right">Price</TableHead><TableHead className="w-[120px] text-[10px] font-bold uppercase text-right px-4">Total</TableHead>{!isReadOnly && <TableHead className="w-[40px]"></TableHead>}</TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="h-10 hover:bg-muted/5 group"><TableCell className="text-center font-mono text-[10px] text-muted-foreground">{index + 1}</TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (<FormControl><Input {...field} className="h-8 text-xs border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" placeholder="Item name..." disabled={isReadOnly} /></FormControl>)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormControl><Input {...field} type="number" className="h-8 text-xs text-center border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} /></FormControl>)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (<FormControl><Input {...field} type="number" step="0.01" className="h-8 text-xs text-right border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly} /></FormControl>)} /></TableCell><TableCell className="p-1 px-4 text-right text-xs font-bold">{(watchedItems[index]?.quantity * watchedItems[index]?.unitPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>{!isReadOnly && (<TableCell className="p-1 text-center"><Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => remove(index)} disabled={fields.length === 1}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>)}</TableRow>
                                    ))}
                                    <TableRow className="bg-muted/30 font-bold border-t-2"><TableCell colSpan={4} className="text-right text-[10px] uppercase tracking-wider py-3">Grand Total</TableCell><TableCell className="text-right py-3 px-4 text-primary">Php {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>{!isReadOnly && <TableCell></TableCell>}</TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Section 4: Signatures */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
                        <FormField control={form.control} name="requestedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Requested by</FormLabel>
                                <FormControl><Input {...field} className="h-8 text-xs" disabled={isReadOnly} /></FormControl>
                                <div className="text-[8px] text-center pt-1 italic text-muted-foreground uppercase border-t mt-1">Name / Sig / Date</div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="chargeToName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Charge To</FormLabel>
                                <FormControl><Input {...field} className="h-8 text-xs" disabled={isReadOnly} /></FormControl>
                                <div className="text-[8px] text-center pt-1 italic text-muted-foreground uppercase border-t mt-1">Name / Sig / Date</div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="verifiedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Verified by</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                    <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {verifiers.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="text-[8px] text-center pt-1 italic text-muted-foreground uppercase border-t mt-1">Name / Sig / Date</div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="approvedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Approved by</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                    <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {approvers.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="text-[8px] text-center pt-1 italic text-muted-foreground uppercase border-t mt-1">Name / Sig / Date</div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="processedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Processed by</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                    <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {processors.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="text-[8px] text-center pt-1 italic text-muted-foreground uppercase border-t mt-1">Name / Sig / Date</div>
                            </FormItem>
                        )} />
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
                                        Submitting...
                                    </>
                                ) : mode === 'edit' ? 'Update Request' : 'Submit House Charge'}
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
