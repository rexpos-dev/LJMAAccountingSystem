'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface BusinessProfileData {
    id?: string;
    businessName: string;
    address: string;
    owner: string;
    contactPhone: string;
    contactTel: string;
    email: string;
    tin: string;
    permit: string;
    bankDetails: string;
    logo: string | null;
}

export default function BusinessSetupDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<BusinessProfileData>({
        businessName: '',
        address: '',
        owner: '',
        contactPhone: '',
        contactTel: '',
        email: '',
        tin: '',
        permit: '',
        bankDetails: '',
        logo: null,
    });

    const handleClose = () => {
        closeDialog('business-setup');
    };

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/business-profile');
            if (res.ok) {
                const data = await res.json();
                if (data && Object.keys(data).length > 0) {
                    setFormData({
                        id: data.id,
                        businessName: data.businessName || '',
                        address: data.address || '',
                        owner: data.owner || '',
                        contactPhone: data.contactPhone || '',
                        contactTel: data.contactTel || '',
                        email: data.email || '',
                        tin: data.tin || '',
                        permit: data.permit || '',
                        bankDetails: data.bankDetails || '',
                        logo: data.logo || null,
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
            toast({
                title: 'Error',
                description: 'Failed to load business profile.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (openDialogs['business-setup']) {
            fetchProfile();
        }
    }, [openDialogs['business-setup']]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setFormData((prev) => ({ ...prev, logo: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        if (!formData.businessName.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Business Name is required.',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSaving(true);
            const res = await fetch('/api/business-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast({
                    title: 'Success',
                    description: 'Business profile saved successfully.',
                });
                handleClose();
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving profile', error);
            toast({
                title: 'Error',
                description: 'Failed to save business profile.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={openDialogs['business-setup']} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Business Setup</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                        {/* Left Column: Form Fields */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder="Enter business name"
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="address">Business Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter complete address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="owner">Business Owner</Label>
                                    <Input
                                        id="owner"
                                        value={formData.owner}
                                        onChange={handleChange}
                                        placeholder="Owner name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactTel">Telephone No.</Label>
                                    <Input
                                        id="contactTel"
                                        value={formData.contactTel}
                                        onChange={handleChange}
                                        placeholder="(02) 1234-5678"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone">Mobile Phone No.</Label>
                                    <Input
                                        id="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleChange}
                                        placeholder="0912-345-6789"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tin">TIN #</Label>
                                    <Input
                                        id="tin"
                                        value={formData.tin}
                                        onChange={handleChange}
                                        placeholder="Tax Identification Number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="permit">Business Permit</Label>
                                    <Input
                                        id="permit"
                                        value={formData.permit}
                                        onChange={handleChange}
                                        placeholder="Permit Number"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="bankDetails">Bank Details / Payment Instructions</Label>
                                    <Input
                                        id="bankDetails"
                                        value={formData.bankDetails}
                                        onChange={handleChange}
                                        placeholder="e.g. BPI: 123-456-789 | GCash: 09123456789"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Logo Upload */}
                        <div className="space-y-4">
                            <Label>Business Logo</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] bg-gray-50 relative">
                                {formData.logo ? (
                                    <div className="relative w-full h-full flex flex-col items-center">
                                        <div className="relative w-40 h-40 mb-4">
                                            <Image
                                                src={formData.logo}
                                                alt="Business Logo"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={removeLogo}
                                            className="gap-2"
                                        >
                                            <X className="w-4 h-4" /> Remove Logo
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4">
                                        <div className="bg-white p-4 rounded-full inline-block shadow-sm">
                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Click to upload logo</p>
                                            <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="w-4 h-4 mr-2" /> Select File
                                        </Button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isLoading}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
