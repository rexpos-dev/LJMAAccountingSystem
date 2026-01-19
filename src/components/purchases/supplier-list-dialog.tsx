"use client";

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Check,
    Plus,
    X,
    Pencil,
    Mail,
    Phone,
    FileText,
    Briefcase,
    HelpCircle,
    ChevronDown
} from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Supplier {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    contactPerson: string | null;
    contactFirstName: string | null;
    phoneAlternative: string | null;
    fax: string | null;
    address: string | null;
    paymentTerms: string | null;
    paymentTermsValue: string | null;
    vatInfo: string | null;
    isTaxExempt: boolean;
    additionalInfo: string | null;
    // Placeholder fields for UI matching
    accountsPayable?: number;
    dueDate?: string;
}

export default function SupplierListDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (openDialogs['supplier-list']) {
            fetchSuppliers();
        }
    }, [openDialogs['supplier-list']]);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/suppliers');
            if (res.ok) {
                const data = await res.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error('Failed to fetch suppliers', error);
        } finally {
            setLoading(false);
        }
    };

    const ToolbarButton = ({
        icon: Icon,
        label,
        onClick,
        disabled = false,
        hasDropdown = false
    }: {
        icon: any,
        label: string,
        onClick?: () => void,
        disabled?: boolean,
        hasDropdown?: boolean
    }) => (
        <Button
            variant="ghost"
            className="flex flex-col items-center h-auto py-2 px-3 gap-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md disabled:opacity-50"
            onClick={onClick}
            disabled={disabled}
        >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
            {hasDropdown && <ChevronDown className="h-3 w-3" />}
        </Button>
    );

    const handleAddSupplier = () => {
        setDialogData('add-supplier', { mode: 'add' });
        openDialog('add-supplier');
    };

    const handleEditSupplier = () => {
        if (!selectedSupplierId) return;
        const supplier = suppliers.find(s => s.id === selectedSupplierId);
        if (supplier) {
            setDialogData('add-supplier', { mode: 'edit', supplier });
            openDialog('add-supplier');
        }
    };

    const handleDeleteSupplier = async () => {
        if (!selectedSupplierId) return;
        if (!confirm('Are you sure you want to delete this supplier?')) return;

        try {
            const res = await fetch(`/api/suppliers?id=${selectedSupplierId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast({ title: 'Supplier deleted' });
                fetchSuppliers();
                setSelectedSupplierId(null);
            } else {
                const data = await res.json();
                toast({ title: 'Error', description: data.error || 'Failed to delete', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete supplier', variant: 'destructive' });
        }
    };

    const handleSelect = () => {
        if (selectedSupplierId) {
            // In future, this will return data to parent dialog
            toast({ title: 'Supplier Selected', description: 'This function will be connected to purchase orders soon.' });
        }
    };

    const handleEmail = () => {
        const supplier = suppliers.find(s => s.id === selectedSupplierId);
        if (supplier?.email) {
            window.location.href = `mailto:${supplier.email}`;
        } else {
            toast({ title: 'No Email', description: 'This supplier has no email address.', variant: 'destructive' });
        }
    };

    const handleCall = () => {
        const supplier = suppliers.find(s => s.id === selectedSupplierId);
        if (supplier?.phone) {
            window.location.href = `tel:${supplier.phone}`;
        } else {
            toast({ title: 'No Phone', description: 'This supplier has no phone number.', variant: 'destructive' });
        }
    };

    return (
        <Dialog open={openDialogs['supplier-list']} onOpenChange={() => closeDialog('supplier-list')}>
            <DialogContent className="max-w-4xl h-[600px] flex flex-col p-0 gap-0 sm:rounded-lg overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Suppliers</DialogTitle>
                </DialogHeader>

                {/* Toolbar */}
                <div className="flex items-center px-4 py-2 border-b gap-2 overflow-x-auto">
                    <ToolbarButton icon={Check} label="Select" onClick={handleSelect} disabled={!selectedSupplierId} />
                    <ToolbarButton icon={Plus} label="Add" onClick={handleAddSupplier} />
                    <ToolbarButton icon={X} label="Delete" onClick={handleDeleteSupplier} disabled={!selectedSupplierId} />
                    <ToolbarButton icon={Pencil} label="Edit" onClick={handleEditSupplier} disabled={!selectedSupplierId} />
                    <div className="w-px h-8 bg-border mx-1" />
                    <ToolbarButton icon={Mail} label="Email" onClick={handleEmail} disabled={!selectedSupplierId} />
                    <ToolbarButton icon={Phone} label="Call" onClick={handleCall} disabled={!selectedSupplierId} />
                    <div className="w-px h-8 bg-border mx-1" />
                    <ToolbarButton icon={FileText} label="Statement" hasDropdown disabled />
                    <ToolbarButton icon={Briefcase} label="Suite" hasDropdown disabled />
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={fetchSuppliers} title="Refresh List">
                            <span className="sr-only">Refresh</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                        </Button>
                        <ToolbarButton icon={HelpCircle} label="Help" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[25%]">Supplier</TableHead>
                                <TableHead className="w-[15%] text-right">Accounts Payable</TableHead>
                                <TableHead className="w-[15%]">Due Date</TableHead>
                                <TableHead className="w-[15%]">Phone</TableHead>
                                <TableHead className="w-[10%]">Markup</TableHead>
                                <TableHead className="w-[20%]">Payment Terms</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Loading suppliers...</TableCell>
                                </TableRow>
                            ) : suppliers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No suppliers found.</TableCell>
                                </TableRow>
                            ) : (
                                suppliers.map((supplier) => (
                                    <TableRow
                                        key={supplier.id}
                                        className={cn(
                                            "cursor-pointer",
                                            selectedSupplierId === supplier.id && "bg-muted"
                                        )}
                                        onClick={() => setSelectedSupplierId(supplier.id)}
                                    >
                                        <TableCell className="font-medium">{supplier.name}</TableCell>
                                        <TableCell className="text-right">₱0.00</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell>{supplier.phone}</TableCell>
                                        <TableCell>
                                            {(() => {
                                                const match = supplier.additionalInfo?.match(/Markup: (\d+)%/);
                                                return match ? `${match[1]}%` : '0%';
                                            })()}
                                        </TableCell>
                                        <TableCell>
                                            {supplier.paymentTerms === 'Pay in Days'
                                                ? `${supplier.paymentTermsValue} Days`
                                                : supplier.paymentTerms || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
