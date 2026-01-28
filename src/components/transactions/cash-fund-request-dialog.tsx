'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { useUserPermissions } from '@/hooks/use-user-permissions';
import Image from 'next/image';

export default function CashFundRequestDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
    const [formData, setFormData] = useState({
        controlNo: '',
        date: new Date().toISOString().split('T')[0],
        requestor: '',
        position: '',
        temporaryChargeTo: '',
        tempAccountNo: '',
        finalChargeTo: '',
        finalAccountNo: '',
        purpose: '',
        amount: '',
        requestedBy: '',
        verifiedBy: '',
        approvedBy: '',
        processedBy: '',
        releasedReceivedBy: '',
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        if (isSaving) return;
        closeDialog('cash-fund-request');
    };

    const handleSave = async () => {
        if (!formData.requestor || !formData.purpose || !formData.amount) {
            alert('Please fill in the required fields: Requestor, Purpose, and Amount.');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requesterName: formData.requestor,
                    position: formData.position,
                    businessUnit: formData.temporaryChargeTo, // Using this for business unit if appropriate
                    chargeTo: formData.finalChargeTo,
                    accountNo: formData.finalAccountNo,
                    purpose: formData.purpose,
                    amount: parseFloat(formData.amount) || 0,
                    verifiedBy: formData.verifiedBy,
                    approvedBy: formData.approvedBy,
                    processedBy: formData.processedBy,
                    items: [] // Basic form as per image doesn't have multiple items line by line
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save request');
            }

            alert('Request saved successfully!');
            handleClose();
        } catch (error) {
            console.error('Error saving request:', error);
            alert('Error saving request. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={openDialogs['cash-fund-request']} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl p-8 bg-white text-black font-sans shadow-2xl border-none overflow-hidden">
                <style jsx global>{`
          .request-form-container {
            border: 2px solid #000;
            padding: 20px;
            position: relative;
          }
          .form-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0px;
          }
          .form-table td, .form-table th {
            border: 1px solid #000;
            padding: 4px 8px;
            vertical-align: middle;
          }
          .label-cell {
            font-weight: bold;
            font-size: 14px;
            width: 150px;
            background-color: transparent;
          }
          .input-cell {
            padding: 0 !important;
          }
          .input-cell input {
            border: none;
            width: 100%;
            height: 100%;
            padding: 4px 8px;
            font-size: 14px;
            background: transparent;
            outline: none;
          }
          .purpose-header {
             border: 1px solid #000;
             border-bottom: none;
             text-align: center;
             font-weight: bold;
             padding: 4px;
             font-size: 16px;
          }
           .amount-header {
             border: 1px solid #000;
             border-left: none;
             border-bottom: none;
             text-align: center;
             font-weight: bold;
             padding: 4px;
             font-size: 16px;
             width: 200px;
          }
          .purpose-cell {
            border: 1px solid #000;
            height: 200px;
            vertical-align: top;
            padding: 0 !important;
          }
          .purpose-cell textarea {
            border: none;
            width: 100%;
            height: 100%;
            padding: 8px;
            font-size: 14px;
            resize: none;
            background: transparent;
            outline: none;
          }
          .amount-cell {
            border: 1px solid #000;
            border-left: none;
            width: 200px;
            vertical-align: top;
            padding: 0 !important;
          }
          .amount-cell input {
             border: none;
             width: 100%;
             height: 100%;
             padding: 8px;
             font-size: 18px;
             font-weight: bold;
             text-align: right;
             background: transparent;
             outline: none;
          }
          .signature-row {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin-top: 30px;
          }
          .signature-block {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            width: 100%;
            margin-bottom: 4px;
            height: 30px;
          }
          .signature-label {
            font-size: 11px;
            text-align: center;
            color: #333;
          }
          .signature-role {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            align-self: flex-start;
          }
        `}</style>

                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col items-start">
                        <div className="text-4xl font-serif font-bold text-[#1e3a8a] leading-none mb-1">
                            R
                        </div>
                        <div className="text-[10px] font-bold text-[#1e3a8a] text-left uppercase leading-tight">
                            ROSLINDA<br />GROUP OF COMPANIES
                        </div>
                    </div>

                    <div className="flex-1 text-center pt-2">
                        <h1 className="text-2xl font-bold uppercase tracking-wider">CASH / FUND REQUEST FORM</h1>
                    </div>

                    <div className="w-[250px] space-y-2 pt-2">
                        <div className="flex items-center gap-2">
                            <Label className="font-bold text-sm whitespace-nowrap">Control No.:</Label>
                            <Input
                                className="border-0 border-b border-black rounded-none p-0 h-6 focus-visible:ring-0 bg-transparent text-sm"
                                value={formData.controlNo}
                                onChange={(e) => handleInputChange('controlNo', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="font-bold text-sm whitespace-nowrap">Date:</Label>
                            <Input
                                type="date"
                                className="border-0 border-b border-black rounded-none p-0 h-6 focus-visible:ring-0 bg-transparent text-sm"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <table className="form-table">
                    <tbody>
                        <tr>
                            <td className="label-cell">Requestor</td>
                            <td className="input-cell">
                                <input
                                    value={formData.requestor}
                                    onChange={(e) => handleInputChange('requestor', e.target.value)}
                                />
                            </td>
                            <td className="label-cell">Position</td>
                            <td className="input-cell">
                                <input
                                    value={formData.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Temporary Charge To:</td>
                            <td className="input-cell">
                                <input
                                    value={formData.temporaryChargeTo}
                                    onChange={(e) => handleInputChange('temporaryChargeTo', e.target.value)}
                                />
                            </td>
                            <td className="label-cell">Account No.:</td>
                            <td className="input-cell">
                                <input
                                    value={formData.tempAccountNo}
                                    onChange={(e) => handleInputChange('tempAccountNo', e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">Final Charge To:</td>
                            <td className="input-cell">
                                <input
                                    value={formData.finalChargeTo}
                                    onChange={(e) => handleInputChange('finalChargeTo', e.target.value)}
                                />
                            </td>
                            <td className="label-cell">Account No.:</td>
                            <td className="input-cell">
                                <input
                                    value={formData.finalAccountNo}
                                    onChange={(e) => handleInputChange('finalAccountNo', e.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex">
                    <div className="flex-1 purpose-header">Purpose</div>
                    <div className="amount-header">Amount</div>
                </div>
                <div className="flex">
                    <div className="flex-1 purpose-cell">
                        <textarea
                            value={formData.purpose}
                            onChange={(e) => handleInputChange('purpose', e.target.value)}
                        />
                    </div>
                    <div className="amount-cell">
                        <input
                            type="text"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}
                        />
                    </div>
                </div>

                <div className="signature-row">
                    <div className="signature-block">
                        <div className="signature-role">Requested by:</div>
                        <Select value={formData.requestedBy} onValueChange={(value) => handleInputChange('requestedBy', value)}>
                            <SelectTrigger className="h-8 text-xs border-0 border-b border-black rounded-none focus:ring-0">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                {userPermissions.filter(u => u.isActive).map((user) => (
                                    <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`}>
                                        {user.firstName} {user.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="signature-label mt-1">Name / Signature / Date</div>
                    </div>
                    <div className="signature-block">
                        <div className="signature-role">Verified by:</div>
                        <Select value={formData.verifiedBy} onValueChange={(value) => handleInputChange('verifiedBy', value)}>
                            <SelectTrigger className="h-8 text-xs border-0 border-b border-black rounded-none focus:ring-0">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                {userPermissions.filter(u => u.isActive && (u.accountType === 'Manager' || u.accountType === 'Admin')).map((user) => (
                                    <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`}>
                                        {user.firstName} {user.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="signature-label mt-1">Name / Signature / Date</div>
                    </div>
                    <div className="signature-block">
                        <div className="signature-role">Approved by:</div>
                        <Select value={formData.approvedBy} onValueChange={(value) => handleInputChange('approvedBy', value)}>
                            <SelectTrigger className="h-8 text-xs border-0 border-b border-black rounded-none focus:ring-0">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                {userPermissions.filter(u => u.isActive && u.accountType === 'Admin').map((user) => (
                                    <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`}>
                                        {user.firstName} {user.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="signature-label mt-1">Name / Signature / Date</div>
                    </div>
                    <div className="signature-block">
                        <div className="signature-role">Processed by:</div>
                        <Select value={formData.processedBy} onValueChange={(value) => handleInputChange('processedBy', value)}>
                            <SelectTrigger className="h-8 text-xs border-0 border-b border-black rounded-none focus:ring-0">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                {userPermissions.filter(u => u.isActive && (u.accountType === 'AdminStaff' || u.accountType === 'Admin')).map((user) => (
                                    <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`}>
                                        {user.firstName} {user.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="signature-label mt-1">Name / Signature / Date</div>
                    </div>
                    <div className="signature-block">
                        <div className="signature-role">Released and Received by:</div>
                        <Select value={formData.releasedReceivedBy} onValueChange={(value) => handleInputChange('releasedReceivedBy', value)}>
                            <SelectTrigger className="h-8 text-xs border-0 border-b border-black rounded-none focus:ring-0">
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                {userPermissions.filter(u => u.isActive).map((user) => (
                                    <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`}>
                                        {user.firstName} {user.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="signature-label mt-1">Name / Signature / Date</div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-8 no-print">
                    <Button variant="outline" onClick={handleClose} disabled={isSaving}>Cancel</Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Request'}
                    </Button>
                    <Button variant="secondary" onClick={() => window.print()} disabled={isSaving}>Print Form</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
