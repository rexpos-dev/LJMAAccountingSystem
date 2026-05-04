"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { parseCSV, validatePurchaseOrderCSV, CSVValidationError } from '@/lib/bulk-upload-utils';

interface UploadResult {
    success: boolean;
    message: string;
    createdOrders?: Array<{
        id: string;
        supplier: string;
        itemCount: number;
        total: number;
    }>;
    errors?: Array<{
        supplier: string;
        error: string;
    }>;
}

export default function BulkUploadDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<any[]>([]);
    const [validationErrors, setValidationErrors] = useState<CSVValidationError[]>([]);
    const [isValid, setIsValid] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setUploadResult(null);

        try {
            // Parse CSV
            const data = await parseCSV(selectedFile);
            setCsvData(data);

            // Validate
            const validation = validatePurchaseOrderCSV(data);
            setIsValid(validation.isValid);
            setValidationErrors(validation.errors);

            if (validation.isValid) {
                toast({
                    title: 'CSV Validated',
                    description: `${data.length} rows ready to upload`,
                });
            } else {
                toast({
                    title: 'Validation Errors',
                    description: `Found ${validation.errors.length} error(s)`,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to parse CSV file',
                variant: 'destructive',
            });
            setIsValid(false);
        }
    };

    const handleUpload = async () => {
        if (!file || !isValid) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/purchase-orders/bulk-upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setUploadResult(result);
                toast({
                    title: 'Upload Successful',
                    description: result.message,
                });
            } else {
                toast({
                    title: 'Upload Failed',
                    description: result.error || 'Unknown error',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to upload CSV',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setCsvData([]);
        setValidationErrors([]);
        setIsValid(false);
        setUploadResult(null);
        closeDialog('bulk-upload-purchase-order');
    };

    return (
        <Dialog open={openDialogs['bulk-upload-purchase-order']} onOpenChange={handleClose}>
            <DialogContent className="max-w-[900px] h-[80vh] flex flex-col p-0 gap-0 sm:rounded-[2rem] overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl">
                <DialogHeader className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">Bulk Data Ingestion</DialogTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">System Payload</span>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">External Dataset Synchronizer</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-8 space-y-8 custom-scrollbar">
                    {/* File Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-400 rounded-full" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Dataset Ingestion Gateway</h3>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6 relative group transition-all hover:bg-white/[0.07] hover:border-white/20">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileText className="h-24 w-24" />
                            </div>
                            
                            <div className="relative z-10 space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Operational CSV File</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <Input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl pl-4 pr-12 font-bold cursor-pointer file:hidden"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/20">
                                            <Upload className="h-4 w-4" />
                                        </div>
                                    </div>
                                    {file && (
                                        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-xs font-black uppercase tracking-tighter truncate max-w-[200px]">{file.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-start gap-2 mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <AlertCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                                    <p className="text-[9px] font-bold text-blue-400/60 leading-relaxed uppercase tracking-wider">
                                        Protocol Requirement: CSV must strictly contain Supplier, Categories, SKU, Barcode, Product Description, Buying UOM, QTY/Case, Offtake, Order QTY, Pieces, Cost Price per Case, Cost Price per Piece, Discount 1, Discount 2, Discount 3, Net Cost Amount.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
 
                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-red-400 rounded-full" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-red-400/60 ml-1">Integrity Violation Detected</h3>
                            </div>
                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                                <div className="max-h-48 overflow-auto custom-scrollbar space-y-2">
                                    {validationErrors.map((error, index) => (
                                        <div key={index} className="flex items-center gap-3 text-[11px] font-bold text-red-400 group">
                                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-[9px] font-black tracking-widest uppercase">Sector {error.row}</span>
                                            <span className="opacity-40 uppercase tracking-wider">{error.field}:</span>
                                            <span className="italic">{error.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
 
                    {/* CSV Preview */}
                    {csvData.length > 0 && isValid && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 ml-1">Payload Telemetry Preview ({csvData.length} Nodes)</h3>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10 pl-6">Entity</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10">SKU Code</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10">Description</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10">Quantum</TableHead>
                                            <TableHead className="text-[9px] font-black uppercase tracking-widest text-white/40 h-10 text-right pr-6">Valuation</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {csvData.slice(0, 10).map((row, index) => (
                                            <TableRow key={index} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <TableCell className="py-3 pl-6 text-[10px] font-bold text-white/60 uppercase">{row.Supplier}</TableCell>
                                                <TableCell className="py-3 text-[10px] font-mono text-blue-400/60">{row.SKU}</TableCell>
                                                <TableCell className="py-3 text-[10px] font-bold text-white/80 max-w-[200px] truncate uppercase italic">{row['Product Description']}</TableCell>
                                                <TableCell className="py-3 text-[10px] font-black text-white/60">{row['Order QTY']}</TableCell>
                                                <TableCell className="py-3 text-right pr-6 text-[11px] font-black italic tracking-tighter text-blue-400">₱{parseFloat(row['Net Cost Amount']).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {csvData.length > 10 && (
                                    <div className="py-3 px-6 text-center bg-white/[0.02] border-t border-white/5">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Additional {csvData.length - 10} Data Nodes Suppressed in Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
 
                    {/* Upload Result */}
                    {uploadResult && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-1 h-4 rounded-full", uploadResult.success ? "bg-emerald-400" : "bg-red-400")} />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Synchronization Report</h3>
                            </div>
                            <div className={cn(
                                "border rounded-2xl p-6 relative overflow-hidden",
                                uploadResult.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                            )}>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    {uploadResult.success ? <CheckCircle className="h-16 w-16 text-emerald-400" /> : <AlertCircle className="h-16 w-16 text-red-400" />}
                                </div>
                                <div className="relative z-10">
                                    <h3 className={cn("text-sm font-black uppercase tracking-widest mb-4", uploadResult.success ? "text-emerald-400" : "text-red-400")}>{uploadResult.message}</h3>
                                    <div className="space-y-3">
                                        {uploadResult.createdOrders && uploadResult.createdOrders.length > 0 && (
                                            <div className="grid grid-cols-1 gap-2">
                                                {uploadResult.createdOrders.map((order, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-emerald-500/30 transition-all">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                                                                <CheckCircle className="h-3.5 w-3.5" />
                                                            </div>
                                                            <span className="text-[10px] font-black text-white/80 uppercase tracking-tight">{order.supplier}</span>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{order.itemCount} Units</span>
                                                            <span className="text-xs font-black italic tracking-tighter text-emerald-400">₱{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                                            <div className="grid grid-cols-1 gap-2">
                                                {uploadResult.errors.map((error, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                                        <XCircle className="h-3.5 w-3.5 text-red-400" />
                                                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{error.supplier}</span>
                                                        <span className="text-[10px] font-bold text-red-400/60 italic ml-auto">{error.error}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
 
                <DialogFooter className="px-8 py-6 border-t border-white/5 bg-white/5 flex items-center justify-end shrink-0">
                    <Button variant="outline" onClick={handleClose} className="px-6 h-12 rounded-xl border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all font-black uppercase tracking-widest text-xs">
                        {uploadResult ? 'Terminate Protocol' : 'Abort Ingestion'}
                    </Button>
                    {!uploadResult && (
                        <Button
                            onClick={handleUpload}
                            disabled={!isValid || uploading}
                            className="ml-4 px-10 h-12 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all gap-2 disabled:opacity-20"
                        >
                            {uploading ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <ShieldCheck className="h-4 w-4" />
                            )}
                            {uploading ? 'Synchronizing Dataset...' : 'Initialize Ingestion'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
