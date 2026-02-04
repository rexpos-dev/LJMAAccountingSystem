
"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AccountDeductionForm } from '@/components/forms/account-deduction-form';
import { ContractorCashAdvanceForm } from '@/components/forms/contractor-cash-advance-form';
import { ContractorMonitoringForm } from '@/components/forms/contractor-monitoring-form';
import { HouseChargeForm } from '@/components/forms/house-charge-form';
import { JobOrderInternalForm } from '@/components/forms/job-order-internal-form';
import { PurchaseOrderSupermarketForm } from '@/components/forms/purchase-order-supermarket-form';
import { StoreUseRequestForm } from '@/components/forms/store-use-request-form';
import { CashFundForm } from '@/components/forms/cash-fund-form';
import { DisbursementSlipForm } from '@/components/forms/disbursement-slip-form';
import { JobOrderRequestForm } from '@/components/forms/job-order-request-form';
import { MaterialsRequestForm } from '@/components/forms/materials-request-form';
import { PurchaseOrderExternalForm } from '@/components/forms/purchase-order-external-form';
import { SalaryCashAdvanceForm } from '@/components/forms/salary-cash-advance-form';
import { GenericRequestForm } from '@/components/forms/generic-request-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestDetailsDialogProps {
    requestId: string | null;
    mode: 'view' | 'edit';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function RequestDetailsDialog({
    requestId,
    mode,
    open,
    onOpenChange,
    onSuccess
}: RequestDetailsDialogProps) {
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && requestId) {
            fetchRequest(requestId);
        } else {
            setRequest(null);
        }
    }, [open, requestId]);

    const fetchRequest = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/requests/${id}`);
            if (response.ok) {
                const data = await response.json();
                setRequest(data);
            }
        } catch (error) {
            console.error('Error fetching request details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        if (onSuccess) onSuccess();
        onOpenChange(false);
    };

    const renderForm = () => {
        if (!request) return null;

        const type = request.formName || 'ACCOUNT DEDUCTION REQUEST FORM';

        const commonProps = {
            initialData: request,
            mode: mode,
            onSuccess: handleSuccess,
            onCancel: () => onOpenChange(false),
        };

        if (type === 'CASH FUND REQUEST FORM') {
            return <CashFundForm {...commonProps} />;
        }

        if (type === 'DISBURSEMENT') {
            return <DisbursementSlipForm {...commonProps} />;
        }

        if (type === 'JOB ORDER REQUEST FORM' || type === 'JOB ORDER REQUEST FORM INTERNAL') {
            return <JobOrderRequestForm {...commonProps} />;
        }

        if (type === 'MATERIALS REQUEST FORM' || type === 'MATERIAL/FUEL REQUEST FORM') {
            return <MaterialsRequestForm formName={type} {...commonProps} />;
        }

        if (type === 'PURCHASE ORDER REQUEST (EXTERNAL)') {
            return <PurchaseOrderExternalForm {...commonProps} />;
        }

        if (type === 'REQUEST AND AUTHORIZATION OF CASH ADVANCES') {
            return <SalaryCashAdvanceForm {...commonProps} />;
        }

        if (type === 'ACCOUNT DEDUCTION REQUEST FORM') {
            return <AccountDeductionForm {...commonProps} />;
        }

        if (type === 'CASH ADVANCE REQUEST FOR CONTRACTOR') {
            return <ContractorCashAdvanceForm {...commonProps} />;
        }

        if (type === 'CONTRACTOR CASH ADVANCE MONITORING FILE') {
            return <ContractorMonitoringForm {...commonProps} />;
        }

        if (type === 'HOUSE CHARGE REQUEST FORM') {
            return <HouseChargeForm {...commonProps} />;
        }

        if (type === 'JOB ORDER REQUEST FORM INTERNAL') {
            return <JobOrderInternalForm {...commonProps} />;
        }

        if (type === 'PURCHASE ORDER REQUEST (SUPERMARKET)') {
            return <PurchaseOrderSupermarketForm {...commonProps} />;
        }

        if (type === 'STORE USE REQUEST FORM') {
            return <StoreUseRequestForm {...commonProps} />;
        }

        // Generic fallback for all other forms
        return <GenericRequestForm formName={type} {...commonProps} />;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                    <DialogTitle className="text-xl">
                        {mode === 'view' ? 'View Request' : 'Edit Request'} - <span className="text-primary">{request?.requestNumber || '...'}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-50">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">Loading details...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full overflow-y-auto">
                            <div className="p-6 pb-20"> {/* Extra bottom padding to ensure buttons are visible */}
                                {renderForm()}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
