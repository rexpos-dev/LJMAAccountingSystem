
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CashFundForm({ onSuccess, onCancel }: CashFundFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            controlNo: '',
            date: new Date(),
            requesterName: '',
            position: '',
            tempChargeTo: '',
            tempAccountNo: '',
            finalChargeTo: '',
            finalAccountNo: '',
            purpose: '',
            amount: 0,
            verifiedBy: '',
            approvedBy: '',
            processedBy: '',
            releasedReceivedBy: '',
        },
    });

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    type: 'CASH FUND REQUEST'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-0">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-between items-start mb-6 border-b pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-sm">
                                {/* Placeholder for Logo */}
                                <span className="text-[10px] text-muted-foreground text-center">LOGO</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold uppercase tracking-tight">Cash / Fund Request Form</h1>
                                <p className="text-xs text-muted-foreground">Roslinda Group of Companies</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">Control No.:</span>
                                <Input className="w-32 h-8" placeholder="Auto" readOnly />
                            </div>
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="font-semibold text-sm">Date:</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[180px] h-8 justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 border border-collapse">
                        <div className="border p-2 bg-muted/30">
                            <FormField
                                control={form.control}
                                name="requesterName"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="w-24 font-bold text-xs uppercase">Requestor</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8 border-none bg-transparent focus-visible:ring-0" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="border p-2">
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="w-24 font-bold text-xs uppercase">Position</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8 border-none bg-transparent focus-visible:ring-0" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="border p-2 bg-muted/30">
                            <FormField
                                control={form.control}
                                name="tempChargeTo"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="w-40 font-bold text-xs uppercase">Temporary Charge To:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8 border-none bg-transparent focus-visible:ring-0" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="border p-2">
                            <FormField
                                control={form.control}
                                name="tempAccountNo"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="w-40 font-bold text-xs uppercase">Account No.:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8 border-none bg-transparent focus-visible:ring-0" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="border p-2 bg-muted/30">
                            <FormField
                                control={form.control}
                                name="finalChargeTo"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="w-40 font-bold text-xs uppercase">Final Charge To:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8 border-none bg-transparent focus-visible:ring-0" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="border p-2">
                            <FormField
                                control={form.control}
                                name="finalAccountNo"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormLabel className="w-40 font-bold text-xs uppercase">Account No.:</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="h-8 border-none bg-transparent focus-visible:ring-0" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Purpose and Amount Area */}
                    <div className="grid grid-cols-[1fr_250px] border border-collapse min-h-[200px]">
                        <div className="border flex flex-col">
                            <div className="bg-muted/50 p-2 text-center text-xs font-bold uppercase border-b">Purpose</div>
                            <FormField
                                control={form.control}
                                name="purpose"
                                render={({ field }) => (
                                    <FormItem className="flex-1 p-0 space-y-0">
                                        <FormControl>
                                            <Textarea {...field} className="h-full border-none resize-none bg-transparent focus-visible:ring-0 rounded-none p-4" placeholder="Enter purpose here..." />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="border flex flex-col">
                            <div className="bg-muted/50 p-2 text-center text-xs font-bold uppercase border-b">Amount</div>
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="flex-1 p-0 space-y-0">
                                        <FormControl>
                                            <div className="h-full flex flex-col items-center justify-center p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold">₱</span>
                                                    <Input {...field} type="number" className="text-xl font-bold h-12 border-none bg-transparent focus-visible:ring-0 text-center" />
                                                </div>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Footer Signatures */}
                    <div className="grid grid-cols-5 gap-4 pt-12">
                        <div className="space-y-4 text-center">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-8">Requested by:</span>
                            <div className="border-t border-black pt-1">
                                <span className="text-[10px] block leading-tight">Name / Signature / Date</span>
                            </div>
                        </div>
                        <div className="space-y-4 text-center">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-8">Verified by:</span>
                            <FormField
                                control={form.control}
                                name="verifiedBy"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <Input {...field} className="h-4 border-none bg-transparent focus-visible:ring-0 text-center text-[10px] p-0" placeholder="Signer Name" />
                                        </FormControl>
                                        <div className="border-t border-black pt-1">
                                            <span className="text-[10px] block leading-tight">Name / Signature / Date</span>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4 text-center">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-8">Approved by:</span>
                            <FormField
                                control={form.control}
                                name="approvedBy"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <Input {...field} className="h-4 border-none bg-transparent focus-visible:ring-0 text-center text-[10px] p-0" placeholder="Signer Name" />
                                        </FormControl>
                                        <div className="border-t border-black pt-1">
                                            <span className="text-[10px] block leading-tight">Name / Signature / Date</span>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4 text-center">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-8">Processed by:</span>
                            <FormField
                                control={form.control}
                                name="processedBy"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <Input {...field} className="h-4 border-none bg-transparent focus-visible:ring-0 text-center text-[10px] p-0" placeholder="Signer Name" />
                                        </FormControl>
                                        <div className="border-t border-black pt-1">
                                            <span className="text-[10px] block leading-tight">Name / Signature / Date</span>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4 text-center">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-2">Released and Received by:</span>
                            <FormField
                                control={form.control}
                                name="releasedReceivedBy"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <Input {...field} className="h-4 border-none bg-transparent focus-visible:ring-0 text-center text-[10px] p-0" placeholder="Recipient Name" />
                                        </FormControl>
                                        <div className="border-t border-black pt-1">
                                            <span className="text-[10px] block leading-tight">Name / Signature / Date</span>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-6">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
