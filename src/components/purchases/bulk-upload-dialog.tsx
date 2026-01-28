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
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
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
            <DialogContent className="max-w-[900px] h-[80vh] flex flex-col p-0 gap-0 sm:rounded-lg overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-background">
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Bulk Upload Purchase Orders
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-6 space-y-4">
                    {/* File Upload Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select CSV File</label>
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
                            CSV must include columns: Supplier, Categories, SKU, Barcode, Product Description, Buying UOM, QTY/Case, Offtake, Order QTY, Pieces, Cost Price per Case, Cost Price per Piece, Discount 1, Discount 2, Discount 3, Net Cost Amount
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
                                            <TableHead>Supplier</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Order QTY</TableHead>
                                            <TableHead>Cost/Piece</TableHead>
                                            <TableHead>Net Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {csvData.slice(0, 10).map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.Supplier}</TableCell>
                                                <TableCell>{row.SKU}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">{row['Product Description']}</TableCell>
                                                <TableCell>{row['Order QTY']}</TableCell>
                                                <TableCell>₱{row['Cost Price per Piece']}</TableCell>
                                                <TableCell>₱{row['Net Cost Amount']}</TableCell>
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
                            {uploadResult.createdOrders && uploadResult.createdOrders.length > 0 && (
                                <div className="space-y-1 text-sm">
                                    {uploadResult.createdOrders.map((order, index) => (
                                        <div key={index}>
                                            ✓ {order.supplier}: {order.itemCount} items, Total: ₱{order.total.toFixed(2)}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {uploadResult.errors && uploadResult.errors.length > 0 && (
                                <div className="mt-2 space-y-1 text-sm text-red-600">
                                    {uploadResult.errors.map((error, index) => (
                                        <div key={index}>
                                            ✗ {error.supplier}: {error.error}
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
