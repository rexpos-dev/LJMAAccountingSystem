
'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface NewRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRequestCreated?: () => void;
}

const REQUEST_FORMS = [
    "ACCOUNT DEDUCTION REQUEST FORM",
    "CASH ADVANCE REQUEST FOR CONTRACTOR",
    "CASH FUND REQUEST FORM",
    "CONTRACTOR CASH ADVANCE MONITORING FILE",
    "DISBURSEMENT",
    "HOUSE CHARGE REQUEST FORM",
    "JOB ORDER REQUEST FORM",
    "JOB ORDER REQUEST FORM INTERNAL",
    "MATERIAL/FUEL REQUEST FORM",
    "MATERIALS REQUEST FORM",
    "PURCHASE ORDER REQUEST (EXTERNAL)",
    "PURCHASE ORDER REQUEST (SUPERMARKET)",
    "REQUEST AND AUTHORIZATION OF CASH ADVANCES",
    "STORE USE REQUEST FORM"
].sort();

import { useState } from 'react';
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
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NewRequestDialog({ open, onOpenChange, onRequestCreated }: NewRequestDialogProps) {
    const [selectedForm, setSelectedForm] = useState<string | null>(null);

    const handleSelect = (formName: string) => {
        setSelectedForm(formName);
    };

    const handleBack = () => {
        setSelectedForm(null);
    };

    const handleFormSuccess = () => {
        onOpenChange(false);
        setSelectedForm(null);
        if (onRequestCreated) {
            onRequestCreated();
        }
    };

    const renderForm = () => {
        if (!selectedForm) return null;

        const commonProps = {
            onSuccess: handleFormSuccess,
            onCancel: () => onOpenChange(false),
        };

        if (selectedForm === "ACCOUNT DEDUCTION REQUEST FORM") {
            return <AccountDeductionForm {...commonProps} />;
        }
        if (selectedForm === "CASH ADVANCE REQUEST FOR CONTRACTOR") {
            return <ContractorCashAdvanceForm {...commonProps} />;
        }
        if (selectedForm === "CONTRACTOR CASH ADVANCE MONITORING FILE") {
            return <ContractorMonitoringForm {...commonProps} />;
        }
        if (selectedForm === "HOUSE CHARGE REQUEST FORM") {
            return <HouseChargeForm {...commonProps} />;
        }
        if (selectedForm === "JOB ORDER REQUEST FORM INTERNAL") {
            return <JobOrderInternalForm {...commonProps} />;
        }
        if (selectedForm === "PURCHASE ORDER REQUEST (SUPERMARKET)") {
            return <PurchaseOrderSupermarketForm {...commonProps} />;
        }
        if (selectedForm === "STORE USE REQUEST FORM") {
            return <StoreUseRequestForm {...commonProps} />;
        }
        if (selectedForm === "CASH FUND REQUEST FORM") {
            return <CashFundForm {...commonProps} />;
        }
        if (selectedForm === "DISBURSEMENT") {
            return <DisbursementSlipForm {...commonProps} />;
        }
        if (selectedForm === "JOB ORDER REQUEST FORM" || selectedForm === "JOB ORDER REQUEST FORM INTERNAL") {
            return <JobOrderRequestForm {...commonProps} />;
        }
        if (selectedForm === "MATERIALS REQUEST FORM" || selectedForm === "MATERIAL/FUEL REQUEST FORM") {
            return <MaterialsRequestForm formName={selectedForm} {...commonProps} />;
        }
        if (selectedForm === "PURCHASE ORDER REQUEST (EXTERNAL)") {
            return <PurchaseOrderExternalForm {...commonProps} />;
        }
        if (selectedForm === "REQUEST AND AUTHORIZATION OF CASH ADVANCES") {
            return <SalaryCashAdvanceForm {...commonProps} />;
        }

        // Use GenericRequestForm for the rest
        return <GenericRequestForm formName={selectedForm} {...commonProps} />;
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) setSelectedForm(null);
        }}>
            <DialogContent className={cn(
                "transition-all duration-300 flex flex-col p-0 gap-0 overflow-hidden",
                selectedForm ? "max-w-6xl h-[95vh]" : "max-w-4xl max-h-[90vh]"
            )}>
                {selectedForm && (
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0 px-6 py-4 border-b shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="h-8 px-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <DialogTitle className="text-xl">{selectedForm}</DialogTitle>
                    </DialogHeader>
                )}

                {!selectedForm ? (
                    <div className="flex flex-col h-full">
                        <DialogHeader className="px-6 py-4 border-b">
                            <DialogTitle>Select Request Form</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                {REQUEST_FORMS.map((form) => (
                                    <Button
                                        key={form}
                                        variant="outline"
                                        className="justify-start h-auto py-4 px-4 text-left whitespace-normal break-words hover:border-primary hover:bg-primary/5 transition-colors group border-muted-foreground/20"
                                        onClick={() => handleSelect(form)}
                                    >
                                        <FileText className="mr-3 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
                                        <span className="text-sm font-medium">{form}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 pb-20">
                            {renderForm()}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
