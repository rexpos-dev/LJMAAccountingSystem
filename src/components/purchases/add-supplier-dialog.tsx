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
import { Checkbox } from '@/components/ui/checkbox';
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
import { Phone, Mail, FileText, User, Building } from 'lucide-react';

export default function AddSupplierDialog() {
    const { openDialogs, closeDialog, getDialogData, setDialogData } = useDialog();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Get edit data if any
    const dialogData = getDialogData('add-supplier');
    const isEditMode = dialogData?.mode === 'edit';
    const supplierToEdit = dialogData?.supplier;

    const [formData, setFormData] = useState({
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
            paymentTerms: 'Pay in Days',
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
            const body = isEditMode ? { ...formData, id: supplierToEdit.id } : formData;

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
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col sm:rounded-lg overflow-hidden gap-0 p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Supplier</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Identity & Address */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-2 mb-4">Identity & Address</h3>

                            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                                <Label htmlFor="name" className="text-right text-xs">Supplier name:</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="h-8"
                                />
                            </div>

                            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                                <Label htmlFor="contactPerson" className="text-right text-xs">Contact person:</Label>
                                <Input
                                    id="contactPerson"
                                    placeholder="Last Name"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                    className="h-8"
                                />
                            </div>

                            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                                <Label htmlFor="contactFirstName" className="text-right text-xs">Contact first name:</Label>
                                <Input
                                    id="contactFirstName"
                                    placeholder="First Name"
                                    value={formData.contactFirstName}
                                    onChange={(e) => handleInputChange('contactFirstName', e.target.value)}
                                    className="h-8"
                                />
                            </div>
//Test
                            <div className="grid grid-cols-[110px_1fr] items-start gap-2">
                                <Label htmlFor="address" className="text-right text-xs pt-2">Address:</Label>
                                <Textarea
                                    id="address"
                                    placeholder="Enter address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>

                        {/* Right Column: Key Contact & Financials */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm border-b pb-2 mb-4">Contact Info & Financials</h3>

                            <div className="grid grid-cols-[110px_1fr_auto] items-center gap-2">
                                <Label htmlFor="phone" className="text-right text-xs">Phone (primary):</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="h-8"
                                />
                                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">Call</Button>
                            </div>

                            <div className="grid grid-cols-[110px_1fr_auto] items-center gap-2">
                                <Label htmlFor="phoneAlternative" className="text-right text-xs">Phone (alt):</Label>
                                <Input
                                    id="phoneAlternative"
                                    value={formData.phoneAlternative}
                                    onChange={(e) => handleInputChange('phoneAlternative', e.target.value)}
                                    className="h-8"
                                />
                                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">Call</Button>
                            </div>

                            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                                <Label htmlFor="fax" className="text-right text-xs">Fax:</Label>
                                <Input
                                    id="fax"
                                    value={formData.fax}
                                    onChange={(e) => handleInputChange('fax', e.target.value)}
                                    className="h-8"
                                />
                            </div>

                            <div className="grid grid-cols-[110px_1fr_auto] items-center gap-2">
                                <Label htmlFor="email" className="text-right text-xs">Email:</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="h-8"
                                />
                                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">Email</Button>
                            </div>

                            <div className="border-t my-2"></div>

                            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                                <Label htmlFor="vatInfo" className="text-right text-xs">VAT Reg. No:</Label>
                                <Input
                                    id="vatInfo"
                                    value={formData.vatInfo}
                                    onChange={(e) => handleInputChange('vatInfo', e.target.value)}
                                    className="h-8"
                                />
                            </div>

                            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                                <div></div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isTaxExempt"
                                        checked={formData.isTaxExempt}
                                        onCheckedChange={(checked) => handleInputChange('isTaxExempt', checked as boolean)}
                                    />
                                    <Label htmlFor="isTaxExempt" className="font-normal cursor-pointer text-xs">Tax exempt</Label>
                                </div>
                            </div>

                            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                                <Label htmlFor="additionalInfo" className="text-right text-xs">Additional info:</Label>
                                <Input
                                    id="additionalInfo"
                                    value={formData.additionalInfo}
                                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                                    className="h-8"
                                />
                            </div>

                            <div className="grid grid-cols-[110px_1fr_auto] items-center gap-2">
                                <Label className="text-right text-xs">Payment terms:</Label>
                                <Select
                                    value={formData.paymentTerms}
                                    onValueChange={(val) => handleInputChange('paymentTerms', val)}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select terms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pay in Days">Pay in Days</SelectItem>
                                        <SelectItem value="COD">COD</SelectItem>
                                        <SelectItem value="Prepaid">Prepaid</SelectItem>
                                    </SelectContent>
                                </Select>
                                {formData.paymentTerms === 'Pay in Days' && (
                                    <Input
                                        type="number"
                                        className="w-16 h-8 text-xs"
                                        value={formData.paymentTermsValue}
                                        onChange={(e) => handleInputChange('paymentTermsValue', e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/20">
                    <Button variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'OK'}</Button>
                    <div className="flex-1"></div>
                    <Button variant="ghost" disabled>Help</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
