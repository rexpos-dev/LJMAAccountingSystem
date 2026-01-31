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
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { parseCSV, validateAccountsCSV, CSVValidationError } from '@/lib/bulk-upload-accounts-utils';

interface UploadResult {
    success: boolean;
    message: string;
    createdAccounts?: Array<{
        account_no: number;
        account_name: string;
        account_category: string;
    }>;
    errors?: Array<{
        account_no: number;
        error: string;
    }>;
}

export default function BulkUploadAccountsDialog() {
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
            const validation = validateAccountsCSV(data);
            setCsvData(validation.data);
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

            const response = await fetch('/api/accounts/bulk-upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setUploadResult(result);
                // Trigger refresh of accounts table
                window.dispatchEvent(new CustomEvent('accounts-refresh'));
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
        closeDialog('bulk-upload-accounts');
    };

    const downloadTemplate = () => {
        const csvContent = `Account No.,Account Name,Account Description,Account Status,Account Type,Account Category,FS Category,Header,Bank,Balance
1000,Cash on Hand,Cash in vault,Active,Cash,Asset,Current Assets,No,No,0
1100,Petty Cash Fund,Small petty cash,Active,Cash,Asset,Current Assets,No,No,0
2000,Accounts Payable,Unpaid supplier bills,Active,Payment,Liability,Current Liabilities,No,No,0
3000,Owner's Equity,Capital account,Active,Equity,Equity,Equity,No,No,0
4000,Sales Revenue,Main revenue stream,Active,Sale,Income,Revenue,No,No,0
5000,Cost of Goods Sold,Purchase costs,Active,Purchase,Cost of Sales,COGS,No,No,0
6000,Operating Expenses,Monthly utility bills,Active,Expense,Expense,Expenses,No,No,0`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chart_of_accounts_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={openDialogs['bulk-upload-accounts']} onOpenChange={handleClose}>
            <DialogContent className="max-w-[900px] h-[80vh] flex flex-col p-0 gap-0 sm:rounded-lg overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-background">
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Bulk Upload Chart of Accounts
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-6 space-y-4">
                    {/* File Upload Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Select CSV File</label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={downloadTemplate}
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download Template
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="flex-1"
                            />
                            {file && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    {file.name}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            CSV must include columns: <strong>Account No.</strong>, <strong>Account Name</strong>, <strong>Account Category</strong>.
                            Optional columns: Account Description, Account Status, Account Type, FS Category, Header, Bank, Balance
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Valid categories: Asset, Liability, Equity, Income, Cost of Sales, Expense
                        </p>
                    </div>

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="h-5 w-5 text-destructive" />
                                <h3 className="font-semibold text-destructive">Validation Errors</h3>
                            </div>
                            <div className="max-h-40 overflow-auto space-y-1">
                                {validationErrors.map((error, index) => (
                                    <div key={index} className="text-sm text-destructive">
                                        Row {error.row}, {error.field}: {error.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CSV Preview */}
                    {csvData.length > 0 && isValid && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold">CSV Preview ({csvData.length} rows)</h3>
                            </div>
                            <div className="border rounded-lg overflow-auto max-h-60">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Account No.</TableHead>
                                            <TableHead>Account Name</TableHead>
                                            <TableHead>Account Category</TableHead>
                                            <TableHead>Account Type</TableHead>
                                            <TableHead>Account Status</TableHead>
                                            <TableHead>Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {csvData.slice(0, 10).map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-mono">{row['Account No.']}</TableCell>
                                                <TableCell>{row['Account Name']}</TableCell>
                                                <TableCell>{row['Account Category']}</TableCell>
                                                <TableCell>{row['Account Type'] || '-'}</TableCell>
                                                <TableCell>{row['Account Status'] || 'Active'}</TableCell>
                                                <TableCell className="font-mono">₱{row.Balance || '0.00'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {csvData.length > 10 && (
                                    <div className="p-2 text-center text-sm text-muted-foreground border-t">
                                        ... and {csvData.length - 10} more rows
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Upload Result */}
                    {uploadResult && (
                        <div className={`border rounded-lg p-4 ${uploadResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {uploadResult.success ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                )}
                                <h3 className="font-semibold">{uploadResult.message}</h3>
                            </div>
                            {uploadResult.createdAccounts && uploadResult.createdAccounts.length > 0 && (
                                <div className="space-y-1 text-sm">
                                    {uploadResult.createdAccounts.map((account, index) => (
                                        <div key={index}>
                                            ✓ {account.account_no} - {account.account_name} ({account.account_category})
                                        </div>
                                    ))}
                                </div>
                            )}
                            {uploadResult.errors && uploadResult.errors.length > 0 && (
                                <div className="mt-2 space-y-1 text-sm text-red-600">
                                    {uploadResult.errors.map((error, index) => (
                                        <div key={index}>
                                            ✗ Account {error.account_no}: {error.error}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/20">
                    <Button variant="outline" onClick={handleClose}>
                        {uploadResult ? 'Close' : 'Cancel'}
                    </Button>
                    {!uploadResult && (
                        <Button
                            onClick={handleUpload}
                            disabled={!isValid || uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
