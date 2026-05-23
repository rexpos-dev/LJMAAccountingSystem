"use client";

import { useDialog } from "@/components/layout/dialog-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Database,
    Trash2,
    Upload,
    Download,
    Shield,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    FileText,
    Users,
    CreditCard,
    Landmark,
    UserCog,
    ShoppingCart,
    Building2,
    XCircle,
    HardDrive,
    Lock,
    RotateCcw,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";

interface ResetAction {
    id: string;
    moduleKey: string;
    title: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
    severity: 'high' | 'critical';
    affectedData: string[];
}

const resetActions: ResetAction[] = [
    {
        id: 'reset-transactions',
        moduleKey: 'transactions',
        title: 'Transaction Lists',
        description: 'Delete all journal entries, payments, POS sales, bank transactions, invoices, and audit logs.',
        icon: FileText,
        iconColor: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        severity: 'critical',
        affectedData: ['Journal Entries', 'Bank Transactions', 'POS Sales', 'Invoices', 'Payments', 'Audit Logs'],
    },
    {
        id: 'reset-chart-of-accounts',
        moduleKey: 'chart-of-accounts',
        title: 'Chart of Accounts',
        description: 'Remove all GL accounts, linked bank accounts, and account type mappings.',
        icon: CreditCard,
        iconColor: 'text-red-500',
        bgColor: 'bg-red-500/10',
        severity: 'critical',
        affectedData: ['GL Accounts', 'Bank Account Links', 'Account Types'],
    },
    {
        id: 'reset-banks',
        moduleKey: 'banks',
        title: 'Bank Accounts',
        description: 'Delete all bank accounts, bank transactions, and reconciliation records.',
        icon: Landmark,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        severity: 'high',
        affectedData: ['Bank Accounts', 'Bank Transactions', 'Reconciliations'],
    },
    {
        id: 'reset-user-permissions',
        moduleKey: 'user-permissions',
        title: 'User Permissions',
        description: 'Remove all user accounts except your current admin account. Chat data will also be cleared.',
        icon: UserCog,
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        severity: 'high',
        affectedData: ['User Accounts', 'Permissions', 'Chat Messages'],
    },
    {
        id: 'reset-sales-users',
        moduleKey: 'sales-users',
        title: 'Sales Users',
        description: 'Delete all sales user records from the system.',
        icon: ShoppingCart,
        iconColor: 'text-green-500',
        bgColor: 'bg-green-500/10',
        severity: 'high',
        affectedData: ['Sales Users'],
    },
    {
        id: 'reset-customers',
        moduleKey: 'customers',
        title: 'Customer Records',
        description: 'Remove all customers, loyalty points, invoices, and customer payment records.',
        icon: Users,
        iconColor: 'text-cyan-500',
        bgColor: 'bg-cyan-500/10',
        severity: 'critical',
        affectedData: ['Customers', 'Loyalty Points', 'Invoices', 'Customer Payments'],
    },
    {
        id: 'reset-employees',
        moduleKey: 'employees',
        title: 'Employee Directory',
        description: 'Delete all employee records from the directory.',
        icon: Building2,
        iconColor: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        severity: 'high',
        affectedData: ['Employee Records'],
    },
];

export default function DatabaseManagementDialog() {
    const { openDialogs, closeDialog, openDialog } = useDialog();
    const { toast } = useToast();
    const { logout } = useAuth();

    // State
    const [selectedAction, setSelectedAction] = useState<ResetAction | null>(null);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [actionResults, setActionResults] = useState<Record<string, { success: boolean; message: string }>>({});

    // Upload backup state
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleResetAction = useCallback(async (action: ResetAction) => {
        if (confirmationCode !== 'CONFIRM-RESET') {
            toast({
                title: "Invalid Confirmation",
                description: "Please type CONFIRM-RESET exactly to proceed.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);
        try {
            const res = await fetch('/api/database-management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: action.id,
                    confirmationCode,
                }),
            });

            if (res.status === 401) {
                toast({
                    title: "Session Expired",
                    description: "Your session has expired. Please login again.",
                    variant: "destructive"
                });
                closeDialog("database-management" as any);
                setTimeout(() => logout(), 2000);
                return;
            }

            const data = await res.json();

            if (res.ok) {
                setActionResults(prev => ({
                    ...prev,
                    [action.id]: { success: true, message: data.message }
                }));
                toast({
                    title: "Reset Successful",
                    description: data.message,
                });
                setSelectedAction(null);
                setConfirmationCode('');
                
                // Automatically refresh tables/page data after a successful reset
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setActionResults(prev => ({
                    ...prev,
                    [action.id]: { success: false, message: data.error || 'Operation failed' }
                }));
                toast({
                    title: "Reset Failed",
                    description: data.error || data.details || 'Operation failed',
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Connection Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    }, [confirmationCode, toast, closeDialog, logout]);

    const handleDownloadBackup = useCallback(async (action: ResetAction) => {
        setIsDownloading(action.id);
        try {
            const res = await fetch(`/api/database-management?module=${action.moduleKey}`, {
                method: 'GET',
            });

            if (res.status === 401) {
                toast({
                    title: "Session Expired",
                    description: "Your session has expired. Please login again.",
                    variant: "destructive"
                });
                closeDialog("database-management" as any);
                setTimeout(() => logout(), 2000);
                return;
            }

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Download failed');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            a.href = url;
            a.download = `backup-${action.moduleKey}-${timestamp}.sql`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Download Started",
                description: `Backup for ${action.title} is being downloaded.`,
            });
        } catch (error: any) {
            toast({
                title: "Download Failed",
                description: error.message || "Could not connect to the server.",
                variant: "destructive",
            });
        } finally {
            setIsDownloading(null);
        }
    }, [toast, closeDialog, logout]);

    const handleUploadBackup = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext !== 'sql' && ext !== 'zip') {
            toast({
                title: "Invalid File",
                description: "Only .sql and .zip files are accepted.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(`Uploading ${file.name}...`);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/database-management/upload-backup', {
                method: 'POST',
                body: formData,
            });

            if (res.status === 401) {
                toast({
                    title: "Session Expired",
                    description: "Your session has expired. Please login again.",
                    variant: "destructive"
                });
                closeDialog("database-management" as any);
                setTimeout(() => logout(), 2000);
                return;
            }

            const data = await res.json();

            if (res.ok) {
                setUploadProgress('');
                toast({
                    title: "Restore Successful",
                    description: data.message,
                });
                
                // Automatically refresh tables/page data after a successful restore
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setUploadProgress('');
                toast({
                    title: "Restore Failed",
                    description: data.error || data.details || 'Upload failed',
                    variant: "destructive",
                });
            }
        } catch (error) {
            setUploadProgress('');
            toast({
                title: "Connection Error",
                description: "Could not connect to the server.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [toast, closeDialog, logout]);

    const handleOpenBackupManager = () => {
        openDialog("backup-scheduler" as any);
    };

    const isOpen = openDialogs["database-management"] || false;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeDialog("database-management" as any);
                    setSelectedAction(null);
                    setConfirmationCode('');
                }
            }}
        >
            <DialogContent className="sm:max-w-[1100px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-foreground/10 shadow-2xl bg-background/95 backdrop-blur-3xl rounded-[2.5rem]">
                <DialogHeader className="px-10 py-4 border-b border-foreground/10 bg-foreground/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30 shadow-lg shadow-red-500/10">
                                <Database className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tighter text-foreground uppercase font-headline">
                                    System Control Center
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 text-xs font-medium tracking-widest uppercase mt-1">
                                    Database Integrity & Lifecycle Management Protocol
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">NODE_ID: DB_MGMT_V4</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* LEFT: Reset & Backup Matrix */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <RotateCcw className="w-4 h-4 text-red-500" />
                                        Data Module Matrix
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-medium">Select a module for individual reset or backup extraction.</p>
                                </div>
                                <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] font-black uppercase tracking-widest px-3">
                                    Destructive Access
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {resetActions.map((action) => {
                                    const Icon = action.icon;
                                    const result = actionResults[action.id];
                                    const isSelected = selectedAction?.id === action.id;

                                    return (
                                        <div key={action.id} className="group relative">
                                            <div
                                                className={cn(
                                                    "w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer",
                                                    "bg-foreground/5 border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.07]",
                                                    isSelected && "border-red-500/40 bg-red-500/10 ring-1 ring-red-500/20 shadow-2xl shadow-red-500/10",
                                                    result?.success && "border-emerald-500/30 bg-emerald-500/5"
                                                )}
                                                onClick={() => {
                                                    setSelectedAction(isSelected ? null : action);
                                                    setConfirmationCode('');
                                                }}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={cn("p-3 rounded-xl shrink-0 transition-transform group-hover:scale-110", action.bgColor)}>
                                                        <Icon className={cn("w-6 h-6", action.iconColor)} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="text-sm font-black text-foreground uppercase tracking-wider">{action.title}</h4>
                                                            <div className={cn(
                                                                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                                                action.severity === 'critical'
                                                                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                                                                    : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                                                            )}>
                                                                {action.severity}
                                                            </div>
                                                            
                                                            {result && (
                                                                <div className={cn(
                                                                    "ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                                                                    result.success ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                                                                )}>
                                                                    {result.success ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                                    {result.success ? "Sync OK" : "Error"}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-slate-400 mt-1.5 font-medium leading-relaxed max-w-[80%]">
                                                            {action.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon" className={cn( " w-10 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground hover:bg-blue-500 hover:border-blue-400 transition-all duration-300", isDownloading === action.id && "animate-pulse bg-blue-500" )} onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDownloadBackup(action);
                                                            }}
                                                            title={`Extract Backup for ${action.title}`}
                                                            disabled={isDownloading !== null}
                                                        >
                                                            {isDownloading === action.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Download className="w-4 h-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Confirmation Protocol Inline */}
                                            {isSelected && (
                                                <div className="mt-3 ml-5 mr-2 p-6 rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-md animate-in zoom-in-95 fade-in duration-300">
                                                    <div className="flex items-start gap-4 mb-5">
                                                        <div className="p-2 bg-red-500/20 rounded-lg">
                                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Destructive Protocol Required</h5>
                                                            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                                                                Authorized deletion of: <span className="text-foreground font-bold">{action.affectedData.join(', ')}</span>. This operation bypasses normal data retention rules.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <Label htmlFor="confirm-code" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                                                Security Override Token
                                                            </Label>
                                                            <div className="flex gap-3">
                                                                <div className="relative flex-1">
                                                                    <Input id="confirm-code" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)}
                                                                        placeholder="CONFIRM-RESET"
                                                                        className="font-mono text-sm h-12 bg-black/40 border-foreground/10 text-foreground placeholder:text-slate-600 rounded-xl focus:ring-red-500/50"
                                                                        autoComplete="off"
                                                                    />
                                                                    <div className="absolute right-3 top-3.5 px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[9px] font-black font-mono">
                                                                        REQUIRED
                                                                    </div>
                                                                </div>
                                                                <Button variant="destructive" className="px-6 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95 transition-all" disabled={confirmationCode !== 'CONFIRM-RESET' || isProcessing} onClick={() => handleResetAction(action)}
                                                                >
                                                                    {isProcessing ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                                    ) : (
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                    )}
                                                                    {isProcessing ? 'Executing...' : 'Execute Reset'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT: Backup & Restore & Security Vault */}
                        <div className="lg:col-span-5 space-y-8">
                            
                            {/* Global Backup Vault */}
                            <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 p-6 group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-500" />
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                        <HardDrive className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Global Backup Vault</h3>
                                        <p className="text-[10px] text-slate-500 font-medium tracking-wide">FULL DATABASE SYNC & ARCHIVE</p>
                                    </div>
                                </div>

                                <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-foreground font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 group transition-all" onClick={handleOpenBackupManager} >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <Download className="w-5 h-5 mr-3 group-hover:translate-y-0.5 transition-transform" />
                                            <span>Enter Backup Manager</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Button>
                                
                                <p className="text-[11px] text-slate-400 text-center mt-4 font-medium leading-relaxed px-4">
                                    Create encrypted snapshots, manage automated rotation policies, and archive system states.
                                </p>
                            </div>

                            {/* Restore Protocol Interface */}
                            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                                        <Upload className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Restore Protocol</h3>
                                        <p className="text-[10px] text-slate-500 font-medium tracking-wide">LEGACY DATA RE-INTEGRATION</p>
                                    </div>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".sql,.zip"
                                    className="hidden"
                                    onChange={handleUploadBackup}
                                />
                                
                                <div
                                    className={cn(
                                        "border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group",
                                        "border-foreground/10 bg-black/20 hover:border-emerald-500/40 hover:bg-emerald-500/5",
                                        isUploading && "border-emerald-500/40 bg-emerald-500/10 pointer-events-none"
                                    )}
                                    onClick={() => !isUploading && fileInputRef.current?.click()}
                                >
                                    {isUploading ? (
                                        <div className="space-y-4">
                                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">{uploadProgress}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Writing binary blocks to storage...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-foreground uppercase tracking-widest">Inject Backup File</p>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                                                    Supports .sql & .zip (500MB MAX)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Security & Compliance Vault */}
                            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/30" />
                                <div className="flex items-center gap-3 mb-5">
                                    <Shield className="w-5 h-5 text-amber-500" />
                                    <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.2em]">Security Protocol</h4>
                                </div>
                                
                                <ul className="space-y-3">
                                    {[
                                        { icon: Lock, text: "Administrative session validation required" },
                                        { icon: ShieldCheck, text: "Audit trail logging for all transactions" },
                                        { icon: AlertCircle, text: "Verification token 'CONFIRM-RESET' mandatory" },
                                        { icon: HardDrive, text: "Automatic rollback on process failure" }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <item.icon className="w-3.5 h-3.5 text-amber-500/60" />
                                            <span className="text-[11px] text-slate-400 font-medium tracking-tight leading-none">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar Footer */}
                <div className="px-10 py-5 border-t border-foreground/10 bg-foreground/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auth Level: Level-3 ADMIN</span>
                        </div>
                        <div className="h-4 w-px bg-foreground/10" />
                        <div className="flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-slate-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Region: PH-STND</span>
                        </div>
                    </div>
                    
                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-foreground hover:bg-foreground/5 px-6 rounded-xl transition-all" onClick={() => {
                            closeDialog("database-management" as any);
                            setSelectedAction(null);
                            setConfirmationCode('');
                        }}
                    >
                        Terminate Session
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
