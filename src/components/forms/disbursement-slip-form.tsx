'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/components/providers/auth-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Plus, Trash2, Loader2, Printer, CreditCard, Building2 } from 'lucide-react';
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
    verifiedBy: z.string().min(1, 'Verified by is required'),
    approvedBy: z.string().min(1, 'Approved by is required'),
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
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
    const { data: accounts, isLoading: accountsLoading } = useAccounts();
    const { data: requests = [] } = useRequests();
    const { data: branches = [] } = useBranches();
    const { data: employees = [] } = useEmployees();
    const isReadOnly = mode === 'view';

    const { user } = useAuth();

    const approvedRequests = requests.filter((r: any) => r.status === 'Approved');

    const isAdmin = (u: any) => ['Admin', 'Administrator', 'Super Admin'].includes(u.accountType);
    const isAdminStaff = (u: any) => isAdmin(u) || u.accountType === 'AdminStaff';

    // Filter users by role and specific form access
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
    const total = (watchedItems || []).reduce((sum, item) => sum + ((item.qty || 0) * (item.amount || 0)), 0);
    const watchedDepositAccount = form.watch('depositAccount');
    const watchedReceivedBy = form.watch('receivedBy');

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

    useEffect(() => {
        if (employees.length > 0 && initialData?.requesterName) {
            const emp = employees.find((e: any) => `${e.firstName} ${e.lastName}` === initialData.requesterName);
            if (emp && emp.branchesAssigned) {
                const assigned = emp.branchesAssigned.toLowerCase();
                branchItemsOptions.forEach(opt => {
                    if (assigned.includes(opt.label.toLowerCase())) {
                        form.setValue(opt.name as any, true, { shouldValidate: true });
                    }
                });
            }
        }
    }, [employees, initialData?.requesterName, form]);

    const watchedBranches = form.watch(branchItemsOptions.map(b => b.name as any));
    const selectedBranchLabels = branchItemsOptions.filter((b, i) => watchedBranches[i]).map(b => b.label.toLowerCase());

    const filteredEmployees = employees.filter((emp: any) => {
        if (!emp.branchesAssigned) return false;
        const empBranches = emp.branchesAssigned.toLowerCase();
        return selectedBranchLabels.some(label => empBranches.includes(label));
    });

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
                    requestFormFrom: data.requestFormFrom,
                    accountNo: data.accountNumber,
                    // Map items for the API
                    items: data.items.map(it => ({
                        description: it.particulars,
                        quantity: it.qty,
                        unit: it.unit,
                        unitPrice: it.amount
                    })),
                    paymentType: data.paymentType,
                    checkReceiver: data.checkReceiver,
                    checkBankName: data.checkBankName,
                    checkRefNo: data.checkRefNo,
                    checkDate: data.checkDate,
                    bankTransferAccountNo: data.bankTransferAccountNo,
                    bankTransferAccountName: data.bankTransferAccountName,
                    bankTransferBankName: data.bankTransferBankName,
                    bankTransferSourceAccount: data.bankTransferSourceAccount,
                    processedBy: data.preparedBy // Mapping preparedBy to processedBy in DB
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

    async function handleRelease() {
        if (!initialData?.id) return;
        console.log('[Frontend] handleRelease clicked for request:', initialData.id);
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/requests/${initialData.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Released',
                    releasedBy: user ? `${user.firstName} ${user.lastName}` : 'Treasurer',
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to release payment');
            }

            console.log('[Frontend] handleRelease success');
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('[Release Payment] error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 mb-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight text-primary uppercase">Disbursement Slip</h2>
                            <p className="text-sm text-muted-foreground">General fund disbursement and expense categorization.</p>
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
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side: Category Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Building2 className="h-4 w-4" />
                                <h3 className="text-sm font-bold uppercase tracking-tight">Company / Branch Selection</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 p-4 bg-muted/20 rounded-lg border border-muted-foreground/10">
                                {branchItemsOptions.map((item) => (
                                    <FormField
                                        key={item.name}
                                        control={form.control}
                                        name={item.name as any}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked);
                                                            if (checked && !isReadOnly) {
                                                                // Find matching branch
                                                                const matchedBranch = branches.find(b =>
                                                                    b.name.toLowerCase() === item.label.toLowerCase() ||
                                                                    (b.code && b.code.toLowerCase() === item.label.toLowerCase())
                                                                );

                                                                if (matchedBranch) {
                                                                    if (matchedBranch.payTo) form.setValue('payTo', matchedBranch.payTo, { shouldValidate: true });
                                                                    if (matchedBranch.accountNumber) form.setValue('accountNumber', matchedBranch.accountNumber, { shouldValidate: true });
                                                                    if (matchedBranch.expenseAcct) form.setValue('expenseAcct', matchedBranch.expenseAcct, { shouldValidate: true });
                                                                    if (matchedBranch.receivables) form.setValue('receivables', matchedBranch.receivables, { shouldValidate: true });
                                                                    if (matchedBranch.depositAccount) form.setValue('depositAccount', matchedBranch.depositAccount, { shouldValidate: true });
                                                                    if (matchedBranch.othersField) form.setValue('othersField', matchedBranch.othersField, { shouldValidate: true });
                                                                }
                                                            }
                                                        }}
                                                        disabled={isReadOnly || !!initialData?.id}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-[10px] font-semibold uppercase leading-none cursor-pointer">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="agrivetBranch" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Agrivet Branch</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-muted/30" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="capexBussUnit" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Capex (B.U.)</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-muted/30" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="temporaryChargeTo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Temp Charge To</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-muted/30" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="finalChargeTo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Final Charge To</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-muted/30" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Right Side: Payment Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <CreditCard className="h-4 w-4" />
                                <h3 className="text-sm font-bold uppercase tracking-tight">Payment Details</h3>
                            </div>
                            <div className="space-y-3 p-4 bg-muted/5 rounded-lg border border-dashed">
                                <FormField control={form.control} name="payTo" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Pay To</FormLabel>
                                        <Select value={field.value} onValueChange={async (val) => {
                                            field.onChange(val);
                                            try {
                                                const res = await fetch(`/api/requests/${val}`);
                                                if (!res.ok) return;
                                                const reqData = await res.json();

                                                if (reqData.accountNo) form.setValue('accountNumber', reqData.accountNo, { shouldValidate: true });
                                                if (reqData.depositAccount) form.setValue('depositAccount', reqData.depositAccount, { shouldValidate: true });
                                                if (reqData.items && reqData.items.length > 0) {
                                                    const formattedItems = reqData.items.map((it: any) => ({
                                                        qty: it.quantity || 0,
                                                        unit: it.unit || '',
                                                        particulars: it.description || '',
                                                        amount: it.unitPrice || 0
                                                    }));
                                                    form.setValue('items', formattedItems, { shouldValidate: true });
                                                }
                                            } catch (error) {
                                                console.error('Error fetching request details', error);
                                            }
                                        }} disabled={isReadOnly}>
                                            <FormControl className="col-span-2">
                                                <SelectTrigger className="h-8 text-sm italic font-medium bg-transparent" disabled={isReadOnly || !!initialData?.id}>
                                                    <SelectValue placeholder="-- Select Approved Request --" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel className="text-muted-foreground text-xs uppercase cursor-default">Approved Requests</SelectLabel>
                                                    {approvedRequests.map((r: any) => (
                                                        <SelectItem key={r.id} value={r.id}>
                                                            {r.requestNumber} - {r.requesterName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                                {selectedBranchLabels.length > 0 && (
                                                    <SelectGroup>
                                                        <SelectLabel className="text-muted-foreground text-xs uppercase cursor-default">Employees (Selected Branches)</SelectLabel>
                                                        {filteredEmployees.map((emp: any) => (
                                                            <SelectItem key={emp.id} value={`${emp.firstName} ${emp.lastName}`}>
                                                                {emp.firstName} {emp.lastName}
                                                            </SelectItem>
                                                        ))}
                                                        {filteredEmployees.length === 0 && (
                                                            <div className="p-2 text-xs text-muted-foreground text-center italic">No employees found for this branch</div>
                                                        )}
                                                    </SelectGroup>
                                                )}
                                                {field.value && !approvedRequests.find((r: any) => r.id === field.value) && !filteredEmployees.find((e: any) => `${e.firstName} ${e.lastName}` === field.value) && (
                                                    <SelectItem value={field.value}>{field.value}</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="requestFormFrom" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Request Form From</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="accountNumber" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Account No.</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm font-mono" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="expenseAcct" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Expense Acct</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="receivables" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Receivables</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="othersField" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Others</FormLabel>
                                        <FormControl className="col-span-2"><Input {...field} className="h-8 text-sm" disabled={isReadOnly || !!initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="depositAccount" render={({ field }) => (
                                    <FormItem className="grid grid-cols-3 items-center gap-4 space-y-0">
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">Deposit Account</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                                            <FormControl className="col-span-2">
                                                <SelectTrigger className="h-8 text-sm bg-transparent">
                                                    <SelectValue placeholder="-- Select --" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {accountsLoading ? (
                                                    <div className="p-2 text-sm text-muted-foreground">Loading...</div>
                                                ) : (!accounts || accounts.length === 0) ? (
                                                    <div className="p-2 text-sm text-muted-foreground">No accounts found</div>
                                                ) : (
                                                    <>
                                                        {accounts.filter((acc: any) => acc.bank === 'Yes' || acc.account_type === 'Asset').map((account: any) => (
                                                            <SelectItem key={account.id || account.account_name} value={account.id || account.account_name}>
                                                                {account.account_name}
                                                            </SelectItem>
                                                        ))}
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Particulars</h3>
                                <FormField control={form.control} name="paymentType" render={({ field }) => (
                                    <FormItem className="space-y-0 flex items-center gap-4 bg-muted/10 px-4 py-1.5 border rounded-md">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    if (val === 'Check' && !isReadOnly) setShowCheckDialog(true);
                                                    if (val === 'Bank Transfer' && !isReadOnly) setShowBankTransferDialog(true);
                                                }}
                                                defaultValue={field.value}
                                                className="flex gap-4"
                                                disabled={isReadOnly}
                                            >
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="Cash" /></FormControl>
                                                    <FormLabel className="font-medium text-xs cursor-pointer m-0 pb-0">Cash</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="Check" /></FormControl>
                                                    <FormLabel className="font-medium text-xs cursor-pointer m-0 pb-0">Check</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-2 space-y-0">
                                                    <FormControl><RadioGroupItem value="Bank Transfer" /></FormControl>
                                                    <FormLabel className="font-medium text-xs cursor-pointer m-0 pb-0">Bank Transfer</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <div className="flex items-center -ml-2">
                                            {field.value === 'Check' && (
                                                <Button type="button" variant="link" size="sm" onClick={() => setShowCheckDialog(true)} className="h-6 text-[10px] px-0 text-primary uppercase" disabled={isReadOnly && !initialData?.checkReceiver}>[ Details ]</Button>
                                            )}
                                            {field.value === 'Bank Transfer' && (
                                                <Button type="button" variant="link" size="sm" onClick={() => setShowBankTransferDialog(true)} className="h-6 text-[10px] px-0 text-primary uppercase" disabled={isReadOnly && !initialData?.bankTransferAccountNo}>[ Details ]</Button>
                                            )}
                                        </div>
                                    </FormItem>
                                )} />
                            </div>
                            {!isReadOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ qty: 0, unit: '', particulars: '', amount: 0 })} className="h-8 shadow-sm shrink-0" disabled={!!initialData?.id}>
                                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Row
                                </Button>
                            )}
                        </div>
                        <div className="border rounded-md overflow-hidden bg-muted/5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30 font-medium"><TableHead className="w-[80px] text-center">Qty</TableHead><TableHead className="w-[100px] text-center">Unit</TableHead><TableHead>Particulars</TableHead><TableHead className="w-[140px] text-right">Amount</TableHead><TableHead className="w-[140px] text-right">Total</TableHead>{!isReadOnly && <TableHead className="w-[40px]"></TableHead>}</TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-muted/10 transition-colors"><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.qty`} render={({ field }) => (<Input {...field} type="number" className="h-8 border-none bg-transparent text-center focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly || !!initialData?.id} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.unit`} render={({ field }) => (<Input {...field} className="h-8 border-none bg-transparent text-center focus-visible:ring-1 focus-visible:bg-background text-xs" disabled={isReadOnly || !!initialData?.id} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.particulars`} render={({ field }) => (<Input {...field} className="h-8 border-none bg-transparent focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly || !!initialData?.id} />)} /></TableCell><TableCell className="p-1"><FormField control={form.control} name={`items.${index}.amount`} render={({ field }) => (<Input {...field} type="number" step="0.01" className="h-8 border-none bg-transparent text-right focus-visible:ring-1 focus-visible:bg-background" disabled={isReadOnly || !!initialData?.id} />)} /></TableCell><TableCell className="text-right font-medium text-sm pr-4">{((watchedItems[index]?.qty || 0) * (watchedItems[index]?.amount || 0)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</TableCell>{!isReadOnly && (<TableCell className="p-0 text-center">{fields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(index)} disabled={!!initialData?.id}><Trash2 className="h-3.5 w-3.5" /></Button>)}</TableCell>)}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 bg-muted/20 border-t gap-3">
                                <FormField
                                    control={form.control}
                                    name="amountInWords"
                                    render={({ field }) => (
                                        <div className="flex flex-1 items-center gap-2 border-b border-muted-foreground/20 w-full sm:w-auto">
                                            <label className="text-[10px] font-bold italic uppercase text-muted-foreground shrink-0">In Words:</label>
                                            <Input {...field} className="flex-1 h-7 border-none shadow-none focus-visible:ring-0 text-xs italic bg-transparent" placeholder="Total amount in words..." disabled={isReadOnly || !!initialData?.id} />
                                        </div>
                                    )}
                                />
                                <div className="flex items-center gap-4 shrink-0">
                                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Grand Total</span>
                                    <span className="text-xl font-bold text-primary">
                                        ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-dashed">
                        {[
                            { name: 'preparedBy', label: 'Prepared By:', options: processors },
                            { name: 'verifiedBy', label: 'Verified By:', options: verifiers },
                            { name: 'approvedBy', label: 'Approved By:', options: approvers },
                            { name: 'receivedBy', label: 'Received By:', options: processors },
                        ].map((sig) => (
                            <FormField
                                key={sig.name}
                                control={form.control}
                                name={sig.name as any}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase text-muted-foreground">{sig.label}</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly || (sig.name !== 'receivedBy' && !!initialData?.id)}>
                                            <FormControl>
                                                <SelectTrigger className="h-9 bg-muted/20 border-dashed hover:border-primary transition-colors">
                                                    <SelectValue placeholder="Staff..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sig.options.map((u) => (
                                                    <SelectItem key={u.id} value={`${u.firstName} ${u.lastName}`}>
                                                        {u.firstName} {u.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[9px] text-center text-muted-foreground mt-1 font-mono uppercase italic border-t pt-1">Signature / Date</p>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-3 rounded-md">
                        <p className="text-[10px] text-red-600 dark:text-red-400 font-bold italic text-center uppercase tracking-tight">
                            REMINDER: No alterations and incomplete signatories. ₱200.00 penalty for non-compliance.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t no-print">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" variant="secondary" disabled={isSubmitting} className="min-w-[120px]">
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                                ) : mode === 'edit' ? 'Update Slip' : 'Save Draft'}
                            </Button>
                        )}
                        {!isReadOnly && mode === 'edit' && (
                            <div className="flex flex-col items-end gap-2">
                                <Button
                                    type="button"
                                    disabled={isSubmitting || !watchedDepositAccount || !watchedReceivedBy || (initialData?.status === 'Released' || initialData?.status === 'Received')}
                                    className="min-w-[160px] bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleRelease}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                                    ) : (initialData?.status === 'Released' || initialData?.status === 'Received') ? '✓ Payment Released' : 'Release Payment'}
                                </Button>
                                {(!watchedDepositAccount || !watchedReceivedBy) && initialData?.status !== 'Released' && initialData?.status !== 'Received' && (
                                    <p className="text-[10px] text-destructive font-medium animate-pulse">
                                        * Required: Deposit Account & "Received By" Signature
                                    </p>
                                )}
                            </div>
                        )}
                        <Button type="button" variant="secondary" onClick={() => window.print()} className="gap-2">
                            <Printer className="h-4 w-4" /> Print
                        </Button>
                    </div>

                    {/* Check Details Dialog */}
                    <Dialog open={showCheckDialog} onOpenChange={setShowCheckDialog}>
                        <DialogContent className="sm:max-w-[700px] w-[95vw]">
                            <DialogHeader>
                                <DialogTitle>Check Payment Details</DialogTitle>
                                <DialogDescription>Enter the details for the check payment.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 md:grid-cols-2 py-4">
                                <div className="md:col-span-2">
                                    <FormField control={form.control} name="checkReceiver" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Receiver Name</FormLabel>
                                            <FormControl><Input {...field} placeholder="Pay to the order of..." disabled={isReadOnly && !initialData?.id} /></FormControl>
                                        </FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="checkBankName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Name</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly && !initialData?.id}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select bank..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {['Security Bank', 'BPI Bank', 'Landbank', 'BDO', 'Metrobank', 'China Bank'].map((bank) => (
                                                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="checkRefNo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Check Reference No.</FormLabel>
                                        <FormControl><Input {...field} placeholder="000123456" disabled={isReadOnly && !initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                {/* Check Preview */}
                                <div className="md:col-span-2 flex justify-center w-full mt-4" style={{ minHeight: '260px' }}>
                                    <div
                                        className="px-2 py-1 bg-blue-50/50 rounded-sm border shadow-sm relative overflow-visible transition-all duration-500"
                                        style={{
                                            width: '380px', height: '170px', transform: 'scale(1.5)', transformOrigin: 'top center',
                                            backgroundImage: form.watch('checkBankName') === 'Security Bank' ? "url('/SBC-Check.png')" : form.watch('checkBankName') === 'BDO' ? "url('/BDO Bank.png')" : "none",
                                            backgroundSize: '100% 100%'
                                        }}
                                    >
                                        <div className="absolute -top-6 -left-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded shadow-sm border z-10">Preview (150%)</div>

                                        {/* Date */}
                                        <div className="absolute right-[11%] top-[30%] font-mono text-[11px] font-bold text-slate-900 tracking-[0.45em]">
                                            {form.watch('date') ? format(form.watch('date'), "MMddyyyy") : 'MMDDYYYY'}
                                        </div>

                                        {/* Pay To */}
                                        <div className="absolute left-[19%] top-[37%] font-sans text-[12px] font-bold text-slate-900 w-[55%] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {form.watch('checkReceiver') || 'Receiver Name'}
                                        </div>

                                        {/* Amount Number */}
                                        <div className="absolute right-[10%] top-[39%] font-sans text-[12px] font-bold tracking-wider text-slate-900">
                                            {total > 0 ? `**${total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}**` : ''}
                                        </div>

                                        {/* Amount Words */}
                                        <div className="absolute left-[16.5%] top-[50%] font-sans text-[11px] font-semibold text-slate-900 w-[70%] leading-[1.2] max-h-[26px] overflow-hidden whitespace-normal">
                                            {form.watch('amountInWords') || 'Amount in words'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={() => setShowCheckDialog(false)}>Done</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Bank Transfer Details Dialog */}
                    <Dialog open={showBankTransferDialog} onOpenChange={setShowBankTransferDialog}>
                        <DialogContent className="sm:max-w-[600px] w-[95vw]">
                            <DialogHeader>
                                <DialogTitle>Bank Transfer Details</DialogTitle>
                                <DialogDescription>Enter the details for the bank transfer.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 md:grid-cols-2 py-4">
                                <div className="md:col-span-2">
                                    <FormField control={form.control} name="bankTransferSourceAccount" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Source Account / Payment Method</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly && !initialData?.id}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Savings Account">Savings Account</SelectItem>
                                                    <SelectItem value="Checking Account">Checking / Current Account</SelectItem>
                                                    <SelectItem value="Corporate Account">Corporate / Business Account</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="bankTransferBankName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination Bank</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly && !initialData?.id}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select bank..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {['Security Bank', 'BPI Bank', 'Landbank', 'BDO', 'Metrobank', 'China Bank'].map((bank) => (
                                                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="bankTransferAccountNo" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl><Input {...field} placeholder="000-000-000" disabled={isReadOnly && !initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="bankTransferAccountName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Name</FormLabel>
                                        <FormControl><Input {...field} placeholder="Registered Name" disabled={isReadOnly && !initialData?.id} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                            <DialogFooter>
                                <Button type="button" onClick={() => setShowBankTransferDialog(false)}>Done</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
        </div>
    );
}
