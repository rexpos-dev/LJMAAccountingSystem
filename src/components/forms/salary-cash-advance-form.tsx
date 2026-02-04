'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2, Printer, FileCheck } from 'lucide-react';
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
import { useUserPermissions } from '@/hooks/use-user-permissions';

const formSchema = z.object({
    date: z.date(),
    employeeId: z.string().min(1, 'Employee ID is required'),
    requestor: z.string().min(1, 'Employee name is required'),
    company: z.string().min(1, 'Company name is required'),
    amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
    deductionStartDate: z.date(),
    requestedBy: z.string().min(1, 'Requested by is required'),
    approvedBy: z.string().min(1, 'Approved by is required'),
    approverPosition: z.string().min(1, 'Position is required'),
    approvalDate: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

interface SalaryCashAdvanceFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function SalaryCashAdvanceForm({ initialData, mode = 'create', onSuccess, onCancel }: SalaryCashAdvanceFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: userPermissions = [] } = useUserPermissions();
    const isReadOnly = mode === 'view';
    const { user } = useAuth();
    const formName = "REQUEST AND AUTHORIZATION OF CASH ADVANCES";

    const staff = userPermissions.filter(u => u.isActive);
    const approvers = userPermissions.filter(u => u.isActive && (u.accountType === 'Admin' || u.accountType === 'Administrator'));

    const currentUserName = `${user?.firstName} ${user?.lastName}`;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            employeeId: initialData?.employeeId || '',
            requestor: initialData?.requesterName || initialData?.requestor || '',
            company: initialData?.company || 'Roslinda Group of Companies',
            amount: initialData?.amount || 0,
            deductionStartDate: initialData?.deductionStartDate ? new Date(initialData.deductionStartDate) : new Date(),
            requestedBy: initialData?.requestedBy || currentUserName,
            approvedBy: initialData?.approvedBy || '',
            approverPosition: initialData?.approverPosition || '',
            approvalDate: initialData?.approvalDate ? new Date(initialData.approvalDate) : new Date(),
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
                    requesterName: data.requestor,
                    formName: formName,
                    purpose: 'Employee Salary Cash Advance'
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
        <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-sm print:shadow-none p-8 print:p-0">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    {/* Header with Control No and Date */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 no-print">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <FileCheck className="h-6 w-6 text-primary" />
                                <h1 className="text-xl font-bold tracking-tight text-primary uppercase">Request and Authorization</h1>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider text-primary/80">Employee Salary Cash Advance</p>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Form Title for Print */}
                    <div className="hidden print:block text-center space-y-2 mb-10">
                        <h1 className="text-2xl font-bold uppercase tracking-tight">Request and Authorization</h1>
                        <h2 className="text-lg font-semibold uppercase">Employee Salary Cash Advance</h2>
                    </div>

                    {/* Document Content */}
                    <div className="space-y-8 text-sm md:text-base leading-relaxed text-justify px-2 md:px-6">
                        <div className="flex flex-wrap items-center gap-y-3">
                            <span>Date:</span>
                            <span className="font-semibold border-b border-black min-w-[150px] ml-2 px-2 pb-0.5">
                                {form.getValues('date') ? format(form.getValues('date'), 'MMMM dd, yyyy') : '____________________'}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-y-3 leading-loose">
                                <span>I,</span>
                                <FormField
                                    control={form.control}
                                    name="requestor"
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="[Full Name]"
                                                className="h-7 min-w-[250px] max-w-[400px] border-x-0 border-t-0 border-b border-black rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary px-2 mx-2 text-center font-bold"
                                                disabled={isReadOnly}
                                            />
                                        </FormControl>
                                    )}
                                />
                                <span>, an employee of</span>
                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="[Company/Unit Name]"
                                                className="h-7 min-w-[300px] border-x-0 border-t-0 border-b border-black rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary px-2 mx-2 text-center"
                                                disabled={isReadOnly}
                                            />
                                        </FormControl>
                                    )}
                                />
                                <span className="inline">a company under the Roslinda Group of Companies, hereby formally request the granting of a cash advance in the amount of Php</span>
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="0.00"
                                                className="h-7 w-32 border-x-0 border-t-0 border-b border-black rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary px-2 mx-2 text-center font-bold"
                                                disabled={isReadOnly}
                                            />
                                        </FormControl>
                                    )}
                                />
                                <span>, to be processed through MARAGUSAN A & E CREDIT CORPORATION (MAECC), the designated subsidiary responsible for administering all employee cash advances within the Roslinda Group of Companies.</span>
                            </div>

                            <p>In relation to this request, I hereby irrevocably authorize and empower my Employer and / or MAECC to:</p>

                            <ul className="list-disc pl-8 space-y-4">
                                <li>Receive, claim, and/or accept the proceeds of the cash advance on my behalf;</li>
                                <li>Effect salary deductions, whether partial or full, from any compensation, benefits, or amounts due to me, until the cash advance is fully paid;</li>
                                <li>Execute, sign, and acknowledge any and all documents necessary for the processing, release, administration, and completion of this transaction.</li>
                            </ul>

                            <div className="flex flex-wrap items-center gap-y-3">
                                <span>The deduction shall commence on:</span>
                                <FormField
                                    control={form.control}
                                    name="deductionStartDate"
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"ghost"}
                                                        disabled={isReadOnly}
                                                        className={cn(
                                                            "h-7 min-w-[200px] border-b border-black rounded-none font-bold mx-2 hover:bg-transparent",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, "MMMM dd, yyyy") : <span>Pick a date</span>}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                    disabled={isReadOnly}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                <span>.</span>
                            </div>

                            <p>This authorization is given freely, knowingly, and voluntarily, and shall remain valid until the obligation has been fully settled.</p>
                        </div>
                    </div>

                    {/* Signatures Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-dashed">
                        {/* Employee Signature */}
                        <div className="space-y-6 flex flex-col items-center">
                            <FormField
                                control={form.control}
                                name="requestedBy"
                                render={({ field }) => (
                                    <FormItem className="w-full text-center">
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                            <FormControl>
                                                <SelectTrigger className="h-10 border-x-0 border-t-0 border-b-2 border-black rounded-none bg-transparent hover:bg-muted/10 transition-colors text-center font-bold text-lg px-0">
                                                    <SelectValue placeholder="Select Employee..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {staff.map((u) => (
                                                    <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>
                                                        {u.firstName} {u.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs font-bold uppercase mt-2">Employee Name & Signature</p>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employeeId"
                                render={({ field }) => (
                                    <FormItem className="w-full flex items-center gap-2">
                                        <FormLabel className="text-xs font-bold uppercase shrink-0">Employee ID:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-7 border-x-0 border-t-0 border-b border-black rounded-none bg-transparent focus-visible:ring-0" disabled={isReadOnly} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Approval Signature */}
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="w-full text-left self-start mb-2">
                                <p className="text-xs font-bold uppercase">APPROVED BY:</p>
                            </div>
                            <FormField
                                control={form.control}
                                name="approvedBy"
                                render={({ field }) => (
                                    <FormItem className="w-full text-center">
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                            <FormControl>
                                                <SelectTrigger className="h-10 border-x-0 border-t-0 border-b-2 border-black rounded-none bg-transparent hover:bg-muted/10 transition-colors text-center font-bold text-lg px-0">
                                                    <SelectValue placeholder="Select Approver..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {approvers.map((u) => (
                                                    <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>
                                                        {u.firstName} {u.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs font-bold uppercase mt-2">Name & Signature of Approving Personnel</p>
                                    </FormItem>
                                )}
                            />
                            <div className="w-full space-y-3">
                                <FormField
                                    control={form.control}
                                    name="approverPosition"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormLabel className="text-xs font-bold uppercase shrink-0">Position:</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-7 border-x-0 border-t-0 border-b border-black rounded-none bg-transparent focus-visible:ring-0" disabled={isReadOnly} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="approvalDate"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormLabel className="text-xs font-bold uppercase shrink-0">Date:</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"ghost"}
                                                            disabled={isReadOnly}
                                                            className={cn(
                                                                "h-7 w-full border-b border-black rounded-none px-0 font-normal hover:bg-transparent justify-start",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "MMMM dd, yyyy") : <span>Select Date</span>}
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
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-8 border-t no-print">
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
