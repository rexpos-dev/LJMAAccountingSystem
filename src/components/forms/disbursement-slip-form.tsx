'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import html2canvas from 'html2canvas';
import { 
  CalendarIcon, 
  Plus, 
  Trash2, 
  Loader2, 
  Printer, 
  CreditCard, 
  Building2,
  ChevronDown,
  Info,
  ShieldCheck,
  Activity,
  Calculator,
  Wallet,
  CheckCircle2,
  Zap,
  ArrowRight,
  FileText,
  User,
  Hash,
  Coins
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { useRequests } from '@/hooks/use-requests';
import { useBranches } from '@/hooks/use-branches';
import { useEmployees } from '@/hooks/use-employees';
import { ScrollArea } from '@/components/ui/scroll-area';

// Schema Definition
const itemSchema = z.object({
    qty: z.coerce.number().min(0).optional(),
    unit: z.string().optional(),
    particulars: z.string().optional(),
    amount: z.coerce.number().min(0).optional(),
});

const formSchema = z.object({
    controlNo: z.string().optional(),
    date: z.date(),
    // Company/Branch checkboxes
    tlmc: z.boolean().default(false),
    sfl: z.boolean().default(false),
    trucking: z.boolean().default(false),
    agrivetBranch: z.string().optional(),
    capexBussUnit: z.string().optional(),
    temporaryChargeTo: z.string().optional(),
    maeccDav: z.boolean().default(false),
    lfc: z.boolean().default(false),
    rentalSpace: z.boolean().default(false),
    maeccDeOro: z.boolean().default(false),
    others: z.string().optional(),
    maeccMars: z.boolean().default(false),
    ktr: z.boolean().default(false),
    repacking: z.boolean().default(false),
    chow2: z.boolean().default(false),
    atr: z.boolean().default(false),
    prorate: z.boolean().default(false),
    riceFarm: z.boolean().default(false),
    jyr: z.boolean().default(false),
    finalChargeTo: z.string().optional(),
    // Right side fields
    payTo: z.string().optional(),
    requestFormFrom: z.string().optional(),
    accountNumber: z.string().optional(),
    expenseAcct: z.string().optional(),
    receivables: z.string().optional(),
    othersField: z.string().optional(),
    depositAccount: z.string().optional(),
    // Items
    items: z.array(itemSchema).min(1),
    amountInWords: z.string().optional(),
    paymentType: z.enum(['Cash', 'Check', 'Bank Transfer']).default('Cash'),
    checkReceiver: z.string().optional(),
    checkBankName: z.string().optional(),
    checkRefNo: z.string().optional(),
    checkDate: z.date().optional(),
    bankTransferAccountNo: z.string().optional(),
    bankTransferAccountName: z.string().optional(),
    bankTransferBankName: z.string().optional(),
    bankTransferSourceAccount: z.string().optional(),
    // Signatures
    preparedBy: z.string().optional(),
    verifiedBy: z.string().min(1, 'Verifier is required'),
    approvedBy: z.string().min(1, 'Approver is required'),
    receivedBy: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DisbursementSlipFormProps {
    initialData?: any;
    mode?: 'create' | 'view' | 'edit';
    onSuccess?: () => void;
    onCancel?: () => void;
}

function numberToWords(amount: number): string {
    if (amount === 0) return 'Zero Pesos Only';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    const convertChunk = (num: number): string => {
        if (num === 0) return '';
        let chunkStr = '';
        if (num >= 100) { chunkStr += ones[Math.floor(num / 100)] + ' Hundred '; num %= 100; }
        if (num >= 10 && num <= 19) { chunkStr += teens[num - 10] + ' '; }
        else if (num >= 20 || num > 0) {
            if (num >= 20) { chunkStr += tens[Math.floor(num / 10)] + ' '; num %= 10; }
            if (num > 0) { chunkStr += ones[num] + ' '; }
        }
        return chunkStr.trim();
    };

    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);
    let words = '';

    if (integerPart >= 1_000_000) { words += convertChunk(Math.floor(integerPart / 1_000_000)) + ' Million '; }
    const thousands = Math.floor((integerPart % 1_000_000) / 1000);
    if (thousands > 0) { words += convertChunk(thousands) + ' Thousand '; }
    const remainder = integerPart % 1000;
    if (remainder > 0) { words += convertChunk(remainder) + ' '; }

    words = words.trim();
    if (words === '') words = 'Zero';

    let result = `${words} Pesos`;
    if (decimalPart > 0) { result += ` and ${decimalPart}/100`; }
    return result + ' Only';
}

export function DisbursementSlipForm({ initialData, mode = 'create', onSuccess, onCancel }: DisbursementSlipFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCheckDialog, setShowCheckDialog] = useState(false);
    const [showBankTransferDialog, setShowBankTransferDialog] = useState(false);
    const chequeRef = useRef<HTMLDivElement>(null);
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
    const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
    const { data: requests = [] } = useRequests();
    const { data: branches = [] } = useBranches();
    const { data: employees = [] } = useEmployees();
    const isReadOnly = mode === 'view';

    const { user } = useAuth();

    const approvedRequests = requests.filter((r: any) => r.status === 'Approved');

    const isAdmin = (u: any) => ['Admin', 'Administrator', 'Super Admin'].includes(u.accountType);
    const isAdminStaff = (u: any) => isAdmin(u) || u.accountType === 'AdminStaff';

    const verifiers = userPermissions.filter(u => {
        if (!u.isActive) return false;
        if (isAdmin(u)) return true;
        try {
            const perms = JSON.parse(u.permissions);
            return u.formPermissions === 'Verifier' && perms.includes("DISBURSEMENT SLIP");
        } catch { return false; }
    });
    const approvers = userPermissions.filter(u => u.isActive && isAdmin(u));
    const processors = userPermissions.filter(u => u.isActive && isAdminStaff(u));

    const currentVerifierName = verifiers.find(v => v.username === user?.username) ? `${user?.firstName} ${user?.lastName}` : '';

    const isBranch = (fieldValue: boolean | undefined, label: string) => {
        if (fieldValue === true) return true;
        if (initialData?.businessUnit && typeof initialData.businessUnit === 'string') {
            return initialData.businessUnit.toLowerCase().includes(label.toLowerCase());
        }
        return false;
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            controlNo: initialData?.requestNumber || '[Auto-generated]',
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            paymentType: initialData?.paymentType || 'Cash',
            checkReceiver: initialData?.checkReceiver || '',
            checkBankName: initialData?.checkBankName || '',
            checkRefNo: initialData?.checkRefNo || '',
            checkDate: initialData?.checkDate ? new Date(initialData.checkDate) : undefined,
            bankTransferAccountNo: initialData?.bankTransferAccountNo || '',
            bankTransferAccountName: initialData?.bankTransferAccountName || '',
            bankTransferBankName: initialData?.bankTransferBankName || '',
            bankTransferSourceAccount: initialData?.bankTransferSourceAccount || '',
            payTo: initialData?.requesterName || '',
            requestFormFrom: initialData?.formName || initialData?.requestFormFrom || '',
            accountNumber: initialData?.accountNo || initialData?.employeeId || '',
            tlmc: isBranch(initialData?.tlmc, 'tlmc'),
            sfl: isBranch(initialData?.sfl, 'sfl'),
            trucking: isBranch(initialData?.trucking, 'trucking'),
            maeccDav: isBranch(initialData?.maeccDav, 'maecc dav'),
            lfc: isBranch(initialData?.lfc, 'lfc'),
            rentalSpace: isBranch(initialData?.rentalSpace, 'rental space'),
            maeccDeOro: isBranch(initialData?.maeccDeOro, 'maecc de oro'),
            maeccMars: isBranch(initialData?.maeccMars, 'maecc mars'),
            ktr: isBranch(initialData?.ktr, 'ktr'),
            repacking: isBranch(initialData?.repacking, 'repacking'),
            chow2: isBranch(initialData?.chow2, 'chow 2'),
            atr: isBranch(initialData?.atr, 'atr'),
            prorate: isBranch(initialData?.prorate, 'prorate'),
            riceFarm: isBranch(initialData?.riceFarm, 'rice farm'),
            jyr: isBranch(initialData?.jyr, 'jyr'),
            depositAccount: initialData?.depositAccount || '',
            items: initialData?.items?.length > 0
                ? initialData.items.map((it: any) => ({
                    qty: it.quantity ?? 0,
                    unit: it.unit || '',
                    particulars: it.description || '',
                    amount: it.unitPrice ?? 0
                }))
                : [{ qty: 0, unit: '', particulars: '', amount: 0 }],
            amountInWords: initialData?.amountInWords || '',
            preparedBy: initialData?.processedBy || '',
            verifiedBy: initialData?.verifiedBy || currentVerifierName,
            approvedBy: initialData?.approvedBy || '',
            receivedBy: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    const watchedItems = form.watch('items');
    const total = useMemo(() => (watchedItems || []).reduce((sum, item) => sum + ((item.qty || 0) * (item.amount || 0)), 0), [watchedItems]);
    const watchedPaymentType = form.watch('paymentType');

    useEffect(() => {
        if (total > 0) {
            form.setValue('amountInWords', numberToWords(total), { shouldValidate: true });
        } else {
            form.setValue('amountInWords', '', { shouldValidate: true });
        }
    }, [total, form]);

    const branchItemsOptions = [
        { name: 'tlmc', label: 'TLMC' },
        { name: 'sfl', label: 'SFL' },
        { name: 'trucking', label: 'Trucking' },
        { name: 'maeccDav', label: 'MAECC DAV' },
        { name: 'lfc', label: 'LFC' },
        { name: 'rentalSpace', label: 'Rental Space' },
        { name: 'maeccDeOro', label: 'MAECC De Oro' },
        { name: 'maeccMars', label: 'MAECC Mars' },
        { name: 'ktr', label: 'KTR' },
        { name: 'repacking', label: 'Repacking' },
        { name: 'chow2', label: 'Chow 2' },
        { name: 'atr', label: 'ATR' },
        { name: 'prorate', label: 'Prorate' },
        { name: 'riceFarm', label: 'Rice Farm' },
        { name: 'jyr', label: 'JYR' },
    ];

    async function onSubmit(data: FormValues) {
        if (isReadOnly) return;
        setIsSubmitting(true);
        try {
            const url = mode === 'edit' ? `/api/requests/${initialData.id}` : '/api/requests';
            const method = mode === 'edit' ? 'PATCH' : 'POST';

            const selectedReq = approvedRequests.find((r: any) => r.id === data.payTo);
            const actualRequesterName = selectedReq ? selectedReq.requesterName : data.payTo;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    formName: 'DISBURSEMENT SLIP',
                    amount: total,
                    requesterName: actualRequesterName,
                    items: data.items.map(it => ({
                        description: it.particulars,
                        quantity: it.qty,
                        unit: it.unit,
                        unitPrice: it.amount
                    })),
                    processedBy: data.preparedBy
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
        <div className="w-full flex flex-col bg-background/50 rounded-3xl border border-foreground/10 overflow-hidden backdrop-blur-xl">
            {/* Header Area */}
            <div className="px-8 py-6 border-b border-foreground/10 bg-foreground/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-foreground leading-none">Disbursement Slip</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">Financial Protocol</span>
                            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Module DS-v4.2</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Control Reference</span>
                        <span className="text-sm font-bold text-foreground font-mono uppercase tracking-tighter">
                            {initialData?.requestNumber || "NEW-DS-ENTRY"}
                        </span>
                    </div>
                    <div className="h-10 w-px bg-foreground/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Protocol Value</span>
                        <span className="text-xl font-black italic tracking-tighter text-primary leading-none">
                            ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
                        {/* Upper Section: Business Context and Payee Identification */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-5 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Business Unit Identification</h3>
                                </div>
                                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-3xl space-y-6">
                                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                                        {branchItemsOptions.map((item) => (
                                            <FormField
                                                key={item.name}
                                                control={form.control}
                                                name={item.name as any}
                                                render={({ field }) => (
                                                    <FormItem className="relative group">
                                                        <FormControl>
                                                            <div 
                                                                className={cn(
                                                                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer select-none",
                                                                    field.value 
                                                                        ? "bg-primary text-black border-primary font-black scale-[1.02] shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                                                                        : "bg-foreground/5 text-foreground/40 border-foreground/10 hover:bg-foreground/10"
                                                                )}
                                                                onClick={() => !isReadOnly && field.onChange(!field.value)}
                                                            >
                                                                <span className="text-[9px] uppercase tracking-tighter text-center leading-none truncate w-full">
                                                                    {item.label}
                                                                </span>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="h-px bg-foreground/5 my-2" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="agrivetBranch" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Agrivet Branch</FormLabel>
                                                <FormControl><Input {...field} className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs uppercase" disabled={isReadOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="capexBussUnit" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Capex Unit</FormLabel>
                                                <FormControl><Input {...field} className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs uppercase" disabled={isReadOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Disbursement Target</h3>
                                </div>
                                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-3xl space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField control={form.control} name="date" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Protocol Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-bold uppercase tracking-tighter text-xs justify-start px-3">
                                                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                                            {field.value ? format(field.value, "PPP") : "Select Date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-card border-foreground/10">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus disabled={isReadOnly} />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="payTo" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Payee Node</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                                    <FormControl>
                                                        <SelectTrigger className=" bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-bold uppercase text-xs">
                                                            <SelectValue placeholder="Identify Payee" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                        {approvedRequests.map((r: any) => (
                                                            <SelectItem key={r.id} value={r.id} className="uppercase text-[10px] font-black">
                                                                {r.requestNumber} - {r.requesterName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormField control={form.control} name="accountNumber" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Account Reference</FormLabel>
                                                <FormControl><Input {...field} className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-mono text-xs" disabled={isReadOnly} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="depositAccount" render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Funding Channel</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                                    <FormControl>
                                                        <SelectTrigger className=" bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-bold uppercase text-xs">
                                                            <SelectValue placeholder="Select Source" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                        {accounts.filter((acc: any) => acc.bank === 'Yes' || acc.account_type === 'Asset').map((account: any) => (
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

                        {/* Middle Section: Particulars Matrix */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Itemized Disbursement Matrix</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <FormField control={form.control} name="paymentType" render={({ field }) => (
                                        <div className="flex bg-foreground/5 p-1 rounded-xl border border-foreground/10">
                                            {['Cash', 'Check', 'Bank Transfer'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => !isReadOnly && field.onChange(type)}
                                                    className={cn(
                                                        "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                                        field.value === type 
                                                            ? "bg-primary text-black" 
                                                            : "text-foreground/40 hover:text-foreground"
                                                    )}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    )} />
                                    {!isReadOnly && (
                                        <Button type="button" onClick={() => append({ qty: 1, unit: 'PC', particulars: '', amount: 0 })}
                                            className="h-9 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black rounded-xl font-black uppercase tracking-widest text-[10px] px-4 gap-2 transition-all"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Initialize Node
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-foreground/5 border border-foreground/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl">
                                <Table>
                                    <TableHeader className="bg-foreground/5">
                                        <TableRow className="border-foreground/5 hover:bg-transparent">
                                            <TableHead className="w-16 text-center text-[10px] font-black uppercase tracking-widest text-foreground/40">Qty</TableHead>
                                            <TableHead className="w-24 text-center text-[10px] font-black uppercase tracking-widest text-foreground/40">Unit</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-6">Disbursement Particulars</TableHead>
                                            <TableHead className="w-36 text-right text-[10px] font-black uppercase tracking-widest text-foreground/40">Rate</TableHead>
                                            <TableHead className="w-40 text-right text-[10px] font-black uppercase tracking-widest text-foreground/40 px-6">Total</TableHead>
                                            {!isReadOnly && <TableHead className="w-16"></TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.map((field, index) => (
                                            <TableRow key={field.id} className="border-foreground/5 hover:bg-foreground/[0.02] transition-colors group">
                                                <TableCell className="">
                                                    <FormField control={form.control} name={`items.${index}.qty`} render={({ field }) => (
                                                        <Input {...field} type="number" className="bg-transparent border-0 text-center font-black italic text-sm text-primary focus-visible:ring-0 shadow-none" disabled={isReadOnly} />
                                                    )} />
                                                </TableCell>
                                                <TableCell className="">
                                                    <FormField control={form.control} name={`items.${index}.unit`} render={({ field }) => (
                                                        <Input {...field} className="bg-transparent border-0 text-center font-bold text-[10px] uppercase text-foreground focus-visible:ring-0 shadow-none" disabled={isReadOnly} placeholder="UNT" />
                                                    )} />
                                                </TableCell>
                                                <TableCell className="px-6">
                                                    <FormField control={form.control} name={`items.${index}.particulars`} render={({ field }) => (
                                                        <Input {...field} className="bg-transparent border-0 font-bold text-xs text-foreground/80 focus-visible:ring-0 shadow-none" disabled={isReadOnly} placeholder="Add particular data node..." />
                                                    )} />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (
                                                        <Input {...field} type="number" step="0.01" className="bg-transparent border-0 text-right font-black italic text-sm text-foreground focus-visible:ring-0 shadow-none" disabled={isReadOnly} />
                                                    )} />
                                                </TableCell>
                                                <TableCell className="text-right font-black italic text-sm text-primary px-6">
                                                    ₱{((watchedItems[index]?.qty || 0) * (watchedItems[index]?.amount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                {!isReadOnly && (
                                                    <TableCell className="text-center pr-4">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => remove(index)}
                                                            className="p-2 text-foreground/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="bg-foreground/5 px-8 py-5 flex items-center justify-between border-t border-foreground/5">
                                    <FormField
                                        control={form.control}
                                        name="amountInWords"
                                        render={({ field }) => (
                                            <div className="flex items-center gap-3 max-w-2xl flex-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 shrink-0">Lexical Mapping</span>
                                                <span className="text-[11px] font-black italic text-foreground/60 truncate">{field.value || "---"}</span>
                                            </div>
                                        )}
                                    />
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Aggregate Total</span>
                                        <span className="text-3xl font-black italic tracking-tighter text-primary">
                                            ₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Authorization Protocols */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-foreground/10 border-dashed">
                            {[
                                { name: 'preparedBy', label: 'Preparation Node', icon: User, options: processors },
                                { name: 'verifiedBy', label: 'Verification Node', icon: ShieldCheck, options: verifiers },
                                { name: 'approvedBy', label: 'Approval Node', icon: Zap, options: approvers },
                                { name: 'receivedBy', label: 'Recipients Node', icon: CheckCircle2, options: processors },
                            ].map((sig) => (
                                <FormField
                                    key={sig.name}
                                    control={form.control}
                                    name={sig.name as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <sig.icon className="h-3 w-3 text-primary/60" />
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{sig.label}</FormLabel>
                                            </div>
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                                <FormControl>
                                                    <SelectTrigger className=" bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-bold uppercase text-[10px] hover:bg-foreground/10 transition-all">
                                                        <SelectValue placeholder="Identify Staff" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-card border-foreground/10 text-foreground">
                                                    {sig.options.map((u) => (
                                                        <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`} className="uppercase text-[10px] font-black">
                                                            {u.firstName} {u.lastName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="h-px bg-foreground/5 my-2" />
                                            <p className="text-[9px] text-center text-foreground/20 font-black uppercase tracking-widest italic">Digital Signatory Timestamp</p>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </form>
                </Form>
            </ScrollArea>

            {/* Footer Control Bar */}
            <div className="px-8 py-6 border-t border-foreground/10 bg-foreground/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Protocol Ready for Transmission
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={onCancel} className="px-6 rounded-2xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px]" >
                        Abort Entry
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || isReadOnly} className="px-10 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all gap-2" >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                        {mode === 'edit' ? 'Update Protocol' : 'Commit Disbursement'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
