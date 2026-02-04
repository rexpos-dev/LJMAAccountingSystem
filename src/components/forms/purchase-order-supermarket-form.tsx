'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
    ShoppingCart,
    Loader2,
    Printer,
    User,
    Briefcase,
    FileText,
    AlertCircle,
    CheckCircle2
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
    businessUnit: z.string().min(1, 'Business Unit is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    amountRequested: z.coerce.number().min(0, 'Amount Requested is required'),
    amountApproved: z.coerce.number().min(0).optional(),
    remarks: z.string().optional(),
    requestedBy: z.string().optional(),
    verifiedBy: z.string().optional(),
    approvedBy: z.string().optional(),
    processedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PurchaseOrderSupermarketFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function PurchaseOrderSupermarketForm({ initialData, mode = 'create', onSuccess, onCancel }: PurchaseOrderSupermarketFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [] } = useUserPermissions();
    const isReadOnly = mode === 'view';
    const { user } = useAuth();
    const formName = "PURCHASE ORDER REQUEST (SUPERMARKET)";

    // Permissions for signatures
    const verifiers = userPermissions.filter(u => u.isActive && (u.accountType === 'Verifier' || u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Approver' || u.accountType === 'Admin' || u.accountType === 'Administrator'));
    const processors = userPermissions.filter(u => u.isActive && (u.accountType === 'Processor' || u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requesterName: initialData?.requesterName || (user ? `${user.firstName} ${user.lastName}` : ''),
            position: initialData?.position || '',
            businessUnit: initialData?.businessUnit || '',
            purpose: initialData?.purpose || '',
            amountRequested: initialData?.amountRequested || (initialData?.amount || 0),
            amountApproved: initialData?.amountApproved || 0,
            remarks: initialData?.remarks || '',
            requestedBy: initialData?.requestedBy || (user ? `${user.firstName} ${user.lastName}` : ''),
            verifiedBy: initialData?.verifiedBy || '',
            approvedBy: initialData?.approvedBy || '',
            processedBy: initialData?.processedBy || '',
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
                    formName: formName,
                    amount: data.amountRequested, // Map for general tracking
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
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Purchase Order Request (Supermarket)</h1>
                            </div>
                            <p className="text-sm text-muted-foreground italic text-[10px] uppercase">Special purchase authorization for supermarket supplies.</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-muted/50 border-primary/20">
                                Date: {format(new Date(), 'PP')}
                            </Badge>
                        </div>
                    </div>

                    {/* Header Grid: Requestor & Business Unit */}
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
                                <FormField control={form.control} name="businessUnit" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Business Unit</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        {/* Section 2: Position */}
                        <Card className="shadow-sm border-primary/10 flex flex-col">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Briefcase className="h-3.5 w-3.5" /> Organization Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow space-y-1.5">
                                <FormField control={form.control} name="position" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Position</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <div className="mt-auto pt-6 flex items-center justify-center opacity-10">
                                    <ShoppingCart className="h-12 w-12" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Amount Tracking Table */}
                    <div className="border rounded-md overflow-hidden bg-background shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-b"><TableHead className="py-2 text-[10px] font-black uppercase text-center border-r">Purpose</TableHead><TableHead className="w-[180px] py-2 text-[10px] font-black uppercase text-center border-r">Amount Requested <br /><span className="text-[8px] font-normal italic">(Requestor)</span></TableHead><TableHead className="w-[180px] py-2 text-[10px] font-black uppercase text-center">Amount Approved <br /><span className="text-[8px] font-normal italic">(Approver)</span></TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="hover:bg-transparent"><TableCell className="p-0 border-r align-top"><FormField control={form.control} name="purpose" render={({ field }) => (<FormItem><FormControl><Textarea {...field} className="min-h-[80px] border-none resize-none focus-visible:ring-0 rounded-none text-sm p-4" placeholder="Enter detailed purpose of purchase..." disabled={isReadOnly} /></FormControl><FormMessage className="px-4 pb-2" /></FormItem>)} /></TableCell><TableCell className="p-0 border-r align-middle bg-primary/5"><FormField control={form.control} name="amountRequested" render={({ field }) => (<FormItem><FormControl><Input {...field} type="number" step="0.01" className="h-full border-none text-center text-lg font-bold focus-visible:ring-0 rounded-none bg-transparent" disabled={isReadOnly} /></FormControl><FormMessage className="px-4 pb-2 text-[9px]" /></FormItem>)} /></TableCell><TableCell className="p-0 align-middle bg-muted/10"><FormField control={form.control} name="amountApproved" render={({ field }) => (<FormItem><FormControl><Input {...field} type="number" step="0.01" className="h-full border-none text-center text-lg font-bold focus-visible:ring-0 rounded-none bg-transparent text-primary" disabled={isReadOnly} /></FormControl><FormMessage className="px-4 pb-2 text-[9px]" /></FormItem>)} /></TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Remarks Section */}
                    <Card className="shadow-none border-dashed bg-muted/5">
                        <CardHeader className="py-2 px-4 border-b bg-muted/10">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <FileText className="h-3 w-3" /> Additional Remarks
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                            <FormField control={form.control} name="remarks" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea {...field} className="min-h-[60px] resize-none border-none bg-transparent focus-visible:ring-0 text-sm leading-relaxed" placeholder="Enter any additional instructions or notes..." disabled={isReadOnly} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Warning Note */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-md p-4 flex gap-4">
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-destructive uppercase leading-tight">Strictly no Alteration on this form (Penalty: 500)</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <span className="text-[9px] text-destructive/80 flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Attached Receipt of Purchase</span>
                                <span className="text-[9px] text-destructive/80 flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Attached Authority to Deduct Form</span>
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
                                ) : mode === 'edit' ? 'Update PO' : 'Submit PO'}
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
