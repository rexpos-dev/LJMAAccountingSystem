'use client';

import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
    CalendarIcon, 
    Plus, 
    Trash2, 
    Loader2, 
    Printer, 
    MinusCircle,
    User,
    ShieldCheck,
    Zap,
    CheckCircle2,
    Activity,
    Building2,
    FileText,
    Wallet,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { useAccounts } from '@/hooks/use-accounts';
import { useEmployees } from '@/hooks/use-employees';
import { ScrollArea } from '@/components/ui/scroll-area';

// Schema Definition
const requestItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.coerce.number().min(0, 'Price must be positive'),
});

const formSchema = z.object({
    date: z.date(),
    requesterName: z.string().min(1, 'Requestor is required'),
    position: z.string().optional(),
    businessUnit: z.string().optional(),
    purpose: z.string().optional(),
    chargeTo: z.string().optional(),
    accountNo: z.string().optional(),
    depositAccount: z.string().optional(),
    items: z.array(requestItemSchema).min(1, 'At least one item is required'),
    // Signatures
    verifiedBy: z.string().min(1, 'Verified by is required'),
    approvedBy: z.string().min(1, 'Approved by is required'),
    processedBy: z.string().min(1, 'Processed by is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface AccountDeductionFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function AccountDeductionForm({ initialData, mode = 'create', onSuccess, onCancel }: AccountDeductionFormProps) {
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
        if (isAdmin(u)) return true; // Admins can always verify
        try {
            const perms = JSON.parse(u.permissions);
            return u.formPermissions === 'Verifier' && perms.includes("ACCOUNT DEDUCTION REQUEST FORM");
        } catch { return false; }
    });
    const approvers = userPermissions.filter(u => u.isActive && isAdmin(u));
    const processors = userPermissions.filter(u => u.isActive && isAdminStaff(u));

    const currentVerifierName = verifiers.find(v => v.username === user?.username) ? `${user?.firstName} ${user?.lastName}` : '';

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            requesterName: initialData?.requesterName || '',
            position: initialData?.position || '',
            businessUnit: initialData?.businessUnit || '',
            purpose: initialData?.purpose || '',
            chargeTo: initialData?.chargeTo || '',
            accountNo: initialData?.accountNo || '',
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    description: it.description,
                    quantity: it.quantity,
                    unitPrice: it.unitPrice
                }))
                : [{ description: '', quantity: 1, unitPrice: 0 }],
            depositAccount: initialData?.depositAccount || '',
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
        return (watchedItems || []).reduce((acc, item) => {
            const total = (item.quantity || 0) * (item.unitPrice || 0);
            return acc + total;
        }, 0);
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
                    formName: 'ACCOUNT DEDUCTION REQUEST FORM',
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
        <div className="w-full flex flex-col bg-slate-950/50 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
            {/* Header Area */}
            <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-destructive/20 text-destructive border border-destructive/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        <MinusCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Account Deduction</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-destructive/20 text-destructive border border-destructive/20">Adjustment Protocol</span>
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Module ADR-v2.1</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Control Reference</span>
                        <span className="text-sm font-bold text-white font-mono uppercase tracking-tighter">
                            {initialData?.requestNumber || "NEW-ADR-ENTRY"}
                        </span>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol Value</span>
                        <span className="text-xl font-black italic tracking-tighter text-destructive leading-none">
                            -₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
                        {/* Upper Section: Personnel and Entity Context */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-4 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Requestor Identification</h3>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                                    <FormField control={form.control} name="requesterName" render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Personnel Node</FormLabel>
                                            <Select value={field.value} onValueChange={(val) => {
                                                field.onChange(val);
                                                const emp = employees.find((e: any) => `${e.firstName} ${e.lastName}` === val);
                                                if (emp) {
                                                    if (emp.designation) form.setValue('position', emp.designation, { shouldValidate: true });
                                                    if (emp.branchesAssigned) form.setValue('businessUnit', emp.branchesAssigned, { shouldValidate: true });
                                                    if (emp.employeeId) form.setValue('accountNo', emp.employeeId, { shouldValidate: true });
                                                }
                                            }} disabled={isReadOnly || employeesLoading}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl font-bold uppercase text-xs">
                                                        <SelectValue placeholder="Identify Staff" />
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="position" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Designation</FormLabel>
                                                <FormControl><Input {...field} className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs uppercase" disabled={isReadOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="businessUnit" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Branch/Dept</FormLabel>
                                                <FormControl><Input {...field} className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-xs uppercase" disabled={isReadOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-8 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Protocol Configuration</h3>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        <FormField control={form.control} name="chargeTo" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Charge Allocation</FormLabel>
                                                <FormControl><Input {...field} className="h-11 bg-white/5 border-white/10 text-white rounded-xl text-xs uppercase" disabled={isReadOnly} placeholder="Entity Node..." /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="accountNo" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Account Reference</FormLabel>
                                                <FormControl><Input {...field} className="h-11 bg-white/5 border-white/10 text-white rounded-xl font-mono text-xs" disabled={isReadOnly} placeholder="REF-ID-000" /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="purpose" render={({ field }) => (
                                            <FormItem className="md:col-span-2 space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Justification Protocol</FormLabel>
                                                <FormControl><Input {...field} className="h-11 bg-white/5 border-white/10 text-white rounded-xl text-xs uppercase" disabled={isReadOnly} placeholder="Deduction Rationale..." /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="depositAccount" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Target Account</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-white/5 border-white/10 text-white rounded-xl font-bold uppercase text-xs">
                                                            <SelectValue placeholder="Identify Channel" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                        {accounts?.filter((acc: any) => acc.bank === 'Yes' || acc.account_type === 'Asset').map((account: any) => (
                                                            <SelectItem key={account.id} value={account.id} className="uppercase text-[10px] font-black">
                                                                {account.account_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Items Matrix */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-destructive rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Adjustment Particulars Matrix</h3>
                                </div>
                                {!isReadOnly && (
                                    <Button 
                                        type="button" 
                                        onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
                                        className="h-9 bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-black rounded-xl font-black uppercase tracking-widest text-[10px] px-4 gap-2 transition-all"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Initialize Node
                                    </Button>
                                )}
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl">
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="w-16 text-center text-[10px] font-black uppercase tracking-widest text-white/40">ID</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 px-6">Deduction Description</TableHead>
                                            <TableHead className="w-32 text-center text-[10px] font-black uppercase tracking-widest text-white/40">Quantity</TableHead>
                                            <TableHead className="w-40 text-right text-[10px] font-black uppercase tracking-widest text-white/40">Unit Rate</TableHead>
                                            <TableHead className="w-48 text-right text-[10px] font-black uppercase tracking-widest text-white/40 px-6">Line Protocol</TableHead>
                                            {!isReadOnly && <TableHead className="w-16"></TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                <TableCell className="py-3 text-center text-[10px] font-black font-mono text-white/20">
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </TableCell>
                                                <TableCell className="py-3 px-6">
                                                    <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (
                                                        <Input {...field} className="bg-transparent border-0 font-bold text-xs text-white/80 focus-visible:ring-0 shadow-none h-8" disabled={isReadOnly} placeholder="Adjustment Data Node..." />
                                                    )} />
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                                                        <Input {...field} type="number" className="bg-transparent border-0 text-center font-black italic text-sm text-destructive focus-visible:ring-0 shadow-none h-8" disabled={isReadOnly} />
                                                    )} />
                                                </TableCell>
                                                <TableCell className="py-3 text-right">
                                                    <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (
                                                        <Input {...field} type="number" step="0.01" className="bg-transparent border-0 text-right font-black italic text-sm text-white focus-visible:ring-0 shadow-none h-8" disabled={isReadOnly} />
                                                    )} />
                                                </TableCell>
                                                <TableCell className="py-3 text-right font-black italic text-sm text-destructive px-6">
                                                    -₱{((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                {!isReadOnly && (
                                                    <TableCell className="py-3 text-center pr-4">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => remove(index)}
                                                            className="p-2 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="bg-white/5 px-8 py-5 flex items-center justify-end border-t border-white/5">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Aggregate Adjustment</span>
                                        <span className="text-3xl font-black italic tracking-tighter text-destructive">
                                            -₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Authorization Protocols */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-8 border-t border-white/10 border-dashed">
                            {[
                                { name: 'requesterName', label: 'Requester Node', icon: User, readOnly: true },
                                { name: 'chargeTo', label: 'Allocation Node', icon: Activity, readOnly: true },
                                { name: 'verifiedBy', label: 'Verification Node', icon: ShieldCheck, options: verifiers },
                                { name: 'approvedBy', label: 'Approval Node', icon: Zap, options: approvers },
                                { name: 'processedBy', label: 'Processing Node', icon: CheckCircle2, options: processors },
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
            <div className="px-8 py-6 border-t border-white/10 bg-white/5 flex items-center justify-between shrink-0">
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
                        Abort Entry
                    </Button>
                    <Button 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting || isReadOnly}
                        className="px-10 h-12 rounded-2xl bg-destructive hover:bg-destructive/90 text-white font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all gap-2"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                        {mode === 'edit' ? 'Update Protocol' : 'Commit Adjustment'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
