"use client";

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';

export default function AddSupplierDialog() {
    const { openDialogs, closeDialog, getDialogData, setDialogData } = useDialog();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Get edit data if any
    const dialogData = getDialogData('add-supplier');
    const isEditMode = dialogData?.mode === 'edit';
    const supplierToEdit = dialogData?.supplier;

    // Helper to extract markup from additionalInfo
    const getMarkupFromInfo = (info: string | null) => {
        if (!info) return '0';
        const match = info.match(/Markup: (\d+)%/);
        return match ? match[1] : '0';
    };

    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '', // Mapped to Company
        contactFirstName: '', // Not used in this UI layout, keep as hidden/empty or preserve
        address: '',
        phone: '', // Telephone
        phoneAlternative: '', // Mobile Phone
        fax: '', // Not used in this UI
        email: '',
        vatInfo: '', // TIN
        isTaxExempt: false,
        additionalInfo: '', // Will store Markup
        markup: '0', // Temporary state for markup input
        paymentTerms: '',
        paymentTermsValue: '30',
    });

    // Populate form when opening in edit mode
    useEffect(() => {
        if (openDialogs['add-supplier'] && isEditMode && supplierToEdit) {
            setFormData({
                name: supplierToEdit.name || '',
                contactPerson: supplierToEdit.contactPerson || '',
                contactFirstName: supplierToEdit.contactFirstName || '',
                address: supplierToEdit.address || '',
                phone: supplierToEdit.phone || '',
                phoneAlternative: supplierToEdit.phoneAlternative || '',
                fax: supplierToEdit.fax || '',
                email: supplierToEdit.email || '',
                vatInfo: supplierToEdit.vatInfo || '',
                isTaxExempt: supplierToEdit.isTaxExempt || false,
                additionalInfo: supplierToEdit.additionalInfo || '',
                markup: getMarkupFromInfo(supplierToEdit.additionalInfo),
                paymentTerms: supplierToEdit.paymentTerms || '',
                paymentTermsValue: supplierToEdit.paymentTermsValue || '30',
            });
        }
    }, [openDialogs['add-supplier'], isEditMode, supplierToEdit]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        closeDialog('add-supplier');
        setDialogData('add-supplier', null); // Clear data
        setFormData({
            name: '',
            contactPerson: '',
            contactFirstName: '',
            address: '',
            phone: '',
            phoneAlternative: '',
            fax: '',
            email: '',
            vatInfo: '',
            isTaxExempt: false,
            additionalInfo: '',
            markup: '0',
            paymentTerms: '',
            paymentTermsValue: '30',
        });
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Supplier Name is required.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            const url = isEditMode ? '/api/suppliers' : '/api/suppliers';
            const method = isEditMode ? 'PUT' : 'POST';

            // Format additional info to include markup
            const finalAdditionalInfo = `Markup: ${formData.markup}%`;

            const body = isEditMode ? {
                ...formData,
                additionalInfo: finalAdditionalInfo,
                id: supplierToEdit.id
            } : {
                ...formData,
                additionalInfo: finalAdditionalInfo
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save supplier');
            }

            toast({
                title: 'Success',
                description: `Supplier ${isEditMode ? 'updated' : 'added'} successfully.`,
            });
            handleClose();
        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to save supplier. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={openDialogs['add-supplier']} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl flex flex-col sm:rounded-lg overflow-hidden gap-0 p-0 border-none">
                <DialogHeader className="px-6 py-4 border-b bg-background">
                    <DialogTitle>{isEditMode ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 p-6 space-y-4 bg-background">
                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Supplier Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="bg-muted/50 border-input"
                        />
                    </div>

                    {/* Company & TIN */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                            <Input
                                id="company"
                                placeholder="Company Name"
                                value={formData.contactPerson} // Mapped to contactPerson
                                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                className="bg-muted/50 border-input"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tin" className="text-sm font-medium">TIN</Label>
                            <Input
                                id="tin"
                                placeholder="TIN"
                                value={formData.vatInfo} // Mapped to vatInfo
                                onChange={(e) => handleInputChange('vatInfo', e.target.value)}
                                className="bg-muted/50 border-input"
                            />
                        </div>
                    </div>

                    {/* Telephone & Mobile Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="telephone" className="text-sm font-medium">Telephone</Label>
                            <Input
                                id="telephone"
                                placeholder="Landline"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="bg-muted/50 border-input"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="mobile" className="text-sm font-medium">Mobile Phone</Label>
                            <Input
                                id="mobile"
                                placeholder="Mobile"
                                value={formData.phoneAlternative}
                                onChange={(e) => handleInputChange('phoneAlternative', e.target.value)}
                                className="bg-muted/50 border-input"
                            />
                        </div>
                    </div>

                    {/* Email, Payment Terms, Markup */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6 grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input
                                id="email"
                                placeholder="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="bg-muted/50 border-input"
                            />
                        </div>
                        <div className="col-span-3 grid gap-2">
                            <Label htmlFor="paymentTerms" className="text-sm font-medium">Payment Terms</Label>
                            <Select
                                value={formData.paymentTerms}
                                onValueChange={(val) => handleInputChange('paymentTerms', val)}
                            >
                                <SelectTrigger className="bg-muted/50 border-input">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pay in Days">Pay in Days</SelectItem>
                                    <SelectItem value="COD">COD</SelectItem>
                                    <SelectItem value="Prepaid">Prepaid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-3 grid gap-2">
                            <Label htmlFor="markup" className="text-sm font-medium">Markup (%)</Label>
                            <Input
                                id="markup"
                                type="number"
                                placeholder="0"
                                value={formData.markup}
                                onChange={(e) => handleInputChange('markup', e.target.value)}
                                className="bg-muted/50 border-input"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="grid gap-2">
                        <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                        <Textarea
                            id="address"
                            placeholder="Full Address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="bg-muted/50 border-input min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-background">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="ml-auto bg-indigo-500 hover:bg-indigo-600 text-white min-w-[140px]"
                    >
                        {loading ? 'Saving...' : 'Save Supplier'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
