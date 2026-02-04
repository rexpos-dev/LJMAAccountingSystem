'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
    CalendarIcon,
    Loader2,
    Printer,
    Wrench,
    User,
    CreditCard,
    Target,
    FileText,
    BadgeDollarSign
} from 'lucide-react';
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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserPermissions } from '@/hooks/use-user-permissions';

const formSchema = z.object({
    requesterName: z.string().min(1, 'Requestor is required'),
    position: z.string().min(1, 'Position is required'),
    chargeTo: z.string().min(1, 'Charge To is required'),
    accountNo: z.string().min(1, 'Account No. is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    targetDate: z.date({ required_error: 'Target Date is required' }),
    description: z.string().min(1, 'Description is required'),
    amount: z.coerce.number().min(0, 'Project Cost is required'),
    requestedBy: z.string().optional(),
    approvedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JobOrderInternalFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function JobOrderInternalForm({ initialData, mode = 'create', onSuccess, onCancel }: JobOrderInternalFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [] } = useUserPermissions();
    const isReadOnly = mode === 'view';
    const { user } = useAuth();
    const formName = "JOB ORDER REQUEST FORM INTERNAL";

    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requesterName: initialData?.requesterName || (user ? `${user.firstName} ${user.lastName}` : ''),
            position: initialData?.position || '',
            chargeTo: initialData?.chargeTo || '',
            accountNo: initialData?.accountNo || '',
            purpose: initialData?.purpose || '',
            targetDate: initialData?.targetDate ? new Date(initialData.targetDate) : undefined,
            description: initialData?.description || (initialData?.items?.[0]?.description || ''),
            amount: initialData?.amount || (initialData?.items?.[0]?.total || 0),
            requestedBy: initialData?.requestedBy || (user ? `${user.firstName} ${user.lastName}` : ''),
            approvedBy: initialData?.approvedBy || '',
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
                    items: [{
                        description: data.description,
                        quantity: 1,
                        unitPrice: data.amount,
                        total: data.amount
                    }]
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
                                <Wrench className="h-5 w-5 text-primary" />
                                <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Job Order Request (Internal)</h1>
                            </div>
                            <p className="text-sm text-muted-foreground italic">Standard internal request for project implementation and job orders.</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline" className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-muted/50 border-primary/20">
                                Date: {format(new Date(), 'PP')}
                            </Badge>
                        </div>
                    </div>

                    {/* Header Grid: Requestor & Charging */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1: Request Details */}
                        <Card className="shadow-sm border-primary/10 flex flex-col">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" /> Requestor Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow space-y-2">
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
                                <FormField control={form.control} name="purpose" render={({ field }) => (
                                    <FormItem className="space-y-0.5">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Purpose</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-sm px-2" disabled={isReadOnly} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="targetDate" render={({ field }) => (
                                    <FormItem className="space-y-0.5 flex flex-col">
                                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-bold">Target Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" className={cn("w-full h-8 text-sm px-2 justify-start font-normal", !field.value && "text-muted-foreground")} disabled={isReadOnly}>
                                                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={isReadOnly} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        {/* Column 2: Charging Details */}
                        <Card className="shadow-sm border-primary/10 flex flex-col">
                            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <CreditCard className="h-3.5 w-3.5" /> Charging Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow space-y-2">
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
                                <div className="mt-auto pt-4 flex items-center justify-center">
                                    <Target className="h-24 w-24 text-muted/20" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Description Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <Card className="shadow-none border-dashed bg-muted/5">
                                <CardHeader className="py-2 px-4 border-b bg-muted/10">
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <FileText className="h-3 w-3" /> Detailed Project Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <FormField control={form.control} name="description" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea {...field} className="min-h-[160px] resize-none border-none bg-transparent focus-visible:ring-0 text-sm leading-relaxed" placeholder="Enter comprehensive project details here..." disabled={isReadOnly} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="shadow-none border-dashed bg-primary/5 h-full flex flex-col">
                                <CardHeader className="py-2 px-4 border-b bg-primary/10">
                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                        <BadgeDollarSign className="h-3 w-3" /> Estimated Cost
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 flex-grow flex flex-col justify-center items-center text-center">
                                    <FormField control={form.control} name="amount" render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Budget</span>
                                                    <Input {...field} type="number" step="0.01" className="h-12 text-center text-xl font-black text-primary bg-background border-primary/20" disabled={isReadOnly} />
                                                    <div className="text-[9px] text-muted-foreground italic">Approximate cost for job order implementation.</div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Footer: Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                        <FormField control={form.control} name="requestedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Requested by</FormLabel>
                                <FormControl><Input {...field} className="h-9 text-sm text-center font-bold px-0 border-x-0 border-t-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:border-primary" placeholder="NAME / SIGNATURE" disabled={isReadOnly} /></FormControl>
                                <div className="text-[8px] text-center pt-1.5 italic text-muted-foreground uppercase">Signature Over Printed Name / Date</div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="approvedBy" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Approved by</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                    <FormControl>
                                        <SelectTrigger className="h-9 text-sm text-center font-bold px-0 border-x-0 border-t-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:border-primary">
                                            <SelectValue placeholder="SELECT APPROVER" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {approvers.map(u => <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.firstName} {u.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="text-[8px] text-center pt-1.5 italic text-muted-foreground uppercase">Signature Over Printed Name / Date</div>
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
                                ) : mode === 'edit' ? 'Update Job Order' : 'Submit Job Order'}
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
