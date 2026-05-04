'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
    CalendarIcon, 
    Loader2, 
    Printer, 
    Wallet,
    User,
    ShieldCheck,
    Zap,
    CheckCircle2,
    Activity,
    FileText,
    Building2,
    ArrowRight
} from 'lucide-react';
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
import { useAccounts } from '@/hooks/use-accounts';
import { useEmployees } from '@/hooks/use-employees';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    depositAccount: z.string().optional(),
    // Signatures
    verifiedBy: z.string().min(1, 'Verified by is required'),
    approvedBy: z.string().min(1, 'Approved by is required'),
    processedBy: z.string().min(1, 'Processed by is required'),
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
    const { data: accounts, isLoading: accountsLoading } = useAccounts();
    const { data: employees = [], isLoading: employeesLoading } = useEmployees();
    const isReadOnly = mode === 'view';

    const { user } = useAuth();

    const isAdmin = (u: any) => ['Admin', 'Administrator', 'Super Admin'].includes(u.accountType);
    const isAdminStaff = (u: any) => isAdmin(u) || u.accountType === 'AdminStaff';

    // Filter users by role and specific form access
    const verifiers = userPermissions.filter(u => {
        if (!u.isActive) return false;
        if (isAdmin(u)) return true;
        try {
            const perms = JSON.parse(u.permissions);
            return u.formPermissions === 'Verifier' && perms.includes("CASH / FUND REQUEST FORM");
        } catch { return false; }
    });
    const approvers = userPermissions.filter(u => u.isActive && isAdmin(u));
    const processors = userPermissions.filter(u => u.isActive && isAdminStaff(u));

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
            finalChargeTo: '',
            finalAccountNo: '',
            purpose: initialData?.purpose || '',
            amount: initialData?.amount || 0,
            depositAccount: initialData?.depositAccount || '',
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

    const watchedAmount = form.watch('amount');

    return (
        <div className="w-full flex flex-col bg-slate-950/50 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
            {/* Header Area */}
            <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Cash / Fund Request</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">Liquidity Protocol</span>
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Module CFR-v3.5</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Control Reference</span>
                        <span className="text-sm font-bold text-white font-mono uppercase tracking-tighter">
                            {initialData?.requestNumber || "NEW-CFR-ENTRY"}
                        </span>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Request Value</span>
                        <span className="text-xl font-black italic tracking-tighter text-primary leading-none">
                            ₱{Number(watchedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
                        {/* Upper Section: Personnel and Allocation Context */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-5 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Personnel Node Identification</h3>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                                    <FormField control={form.control} name="requesterName" render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Requesting Entity</FormLabel>
                                            <Select value={field.value} onValueChange={(val) => {
                                                field.onChange(val);
                                                const emp = employees.find((e: any) => `${e.firstName} ${e.lastName}` === val);
                                                if (emp) {
                                                    if (emp.designation) form.setValue('position', emp.designation, { shouldValidate: true });
                                                    if (emp.employeeId) form.setValue('tempAccountNo', emp.employeeId, { shouldValidate: true });
                                                }
                                            }} disabled={isReadOnly || employeesLoading}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl font-bold uppercase text-xs">
                                                        <SelectValue placeholder="Identify Personnel" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    {employees.map((emp: any) => (
                                                        <SelectItem key={emp.id} value={`${emp.firstName} ${emp.lastName}`} className="uppercase text-[10px] font-black">
                                                            {emp.firstName} {emp.lastName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="position" render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Personnel Designation</FormLabel>
                                            <FormControl><Input {...field} className="h-11 bg-white/5 border-white/10 text-white rounded-xl text-xs uppercase" disabled={isReadOnly} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="tempChargeTo" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Charge Allocation</FormLabel>
                                                <FormControl><Input {...field} className="h-11 bg-white/5 border-white/10 text-white rounded-xl text-xs uppercase" disabled={isReadOnly} placeholder="..." /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="tempAccountNo" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Account Node</FormLabel>
                                                <FormControl><Input {...field} className="h-11 bg-white/5 border-white/10 text-white rounded-xl font-mono text-xs uppercase" disabled={isReadOnly} placeholder="..." /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Financial Matrix Configuration</h3>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={form.control} name="date" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Protocol Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full h-11 bg-white/5 border-white/10 text-white rounded-xl font-bold uppercase tracking-tighter text-xs justify-start px-3">
                                                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                                            {field.value ? format(field.value, "PPP") : "Select Date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={isReadOnly} />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="depositAccount" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Funding Channel</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl font-bold uppercase text-xs">
                                                            <SelectValue placeholder="Identify Channel" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                        {accountsLoading ? (
                                                            <div className="p-2 text-xs font-black uppercase text-white/20">Scanning...</div>
                                                        ) : (
                                                            accounts?.filter((acc: any) => acc.bank === 'Yes' || acc.account_type === 'Asset').map((account: any) => (
                                                                <SelectItem key={account.id} value={account.id || account.account_name} className="uppercase text-[10px] font-black">
                                                                    {account.account_name}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <FormField control={form.control} name="purpose" render={({ field }) => (
                                            <FormItem className="md:col-span-3 space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Operational Justification</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} placeholder="State the strategic purpose for this liquidity request..." className="min-h-[100px] bg-white/5 border-white/10 text-white rounded-xl text-xs uppercase resize-none focus-visible:ring-primary/20" disabled={isReadOnly} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="amount" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Requested Value</FormLabel>
                                                <div className="relative h-[100px]">
                                                    <div className="absolute left-3 top-3 text-primary/40 font-black text-lg">₱</div>
                                                    <FormControl>
                                                        <Input {...field} type="number" className="h-full bg-primary/5 border-primary/20 text-primary text-2xl font-black text-center rounded-xl focus-visible:ring-primary/30" disabled={isReadOnly} />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-destructive/20 text-destructive">
                                            <Activity className="h-4 w-4" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-destructive italic leading-tight">
                                            Compliance Protocol: Validated official receipts or invoices are mandatory for post-disbursement liquidation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Authorization Protocols */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-8 border-t border-white/10 border-dashed">
                            {[
                                { name: 'requesterName', label: 'Requested By Node', icon: User, readOnly: true },
                                { name: 'verifiedBy', label: 'Verification Node', icon: ShieldCheck, options: verifiers },
                                { name: 'approvedBy', label: 'Approval Node', icon: Zap, options: approvers },
                                { name: 'processedBy', label: 'Processing Node', icon: CheckCircle2, options: processors },
                                { name: 'releasedReceivedBy', label: 'Recipient Node', icon: ArrowRight, options: processors },
                            ].map((sig) => (
                                <FormField
                                    key={sig.name}
                                    control={form.control}
                                    name={sig.name as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <sig.icon className="h-3 w-3 text-primary/60" />
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40">{sig.label}</FormLabel>
                                            </div>
                                            {sig.options ? (
                                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white rounded-xl font-bold uppercase text-[10px] hover:bg-white/10 transition-all">
                                                            <SelectValue placeholder="Identify Staff" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                        {sig.options.map((u: any) => (
                                                            <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`} className="uppercase text-[10px] font-black">
                                                                {u.firstName} {u.lastName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="h-10 flex items-center px-3 bg-white/5 border border-white/10 rounded-xl font-bold text-[10px] text-white/60 uppercase truncate">
                                                    {field.value || "---"}
                                                </div>
                                            )}
                                            <div className="h-px bg-white/5 my-2" />
                                            <p className="text-[9px] text-center text-white/20 font-black uppercase tracking-widest italic">Digital Signatory Timestamp</p>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </form>
                </Form>
            </ScrollArea>

            {/* Footer Control Bar */}
            <div className="px-8 py-6 border-t border-white/10 bg-white/5 flex items-center justify-between shrink-0 no-print">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Protocol Ready for Transmission
                </div>
                <div className="flex items-center gap-4">
                    <Button 
                        variant="outline" 
                        onClick={onCancel}
                        className="px-6 h-12 rounded-2xl border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                        {isReadOnly ? 'Close Protocol' : 'Abort Entry'}
                    </Button>
                    {!isReadOnly && (
                        <Button 
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="px-10 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all gap-2"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                            {mode === 'edit' ? 'Update Protocol' : 'Commit Request'}
                        </Button>
                    )}
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => window.print()} 
                        className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-black uppercase tracking-widest text-[10px] gap-2"
                    >
                        <Printer className="h-4 w-4 text-primary" /> Print Matrix
                    </Button>
                </div>
            </div>
        </div>
    );
}
