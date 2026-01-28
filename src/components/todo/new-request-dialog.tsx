
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
}

const REQUEST_FORMS = [
    "ACCOUNT DEDUCTION REQUEST FORM",
    "CASH ADVANCE REQUEST FOR FOR CONTRACTOR",
    "CASH FUND REQUEST FORM",
    "CONTRACTOR CASH ADVANCE MONITORING FILE",
    "DISBURSEMENT",
    "HOUSE CHARGE REQUEST FORM",
    "JOB ORDER REQUEST FORM",
    "JOB ORDER REQUEST FORM INTERNAL",
    "MATERNAL REQUEST FORM",
    "PURCHASE ORDER REQUEST (EXTERNAL)",
    "PURCHASE ORDER REQUEST (SUPERMARKET)",
    "REQUEST AND AUTHORIZATION OF CASH ADVANCES",
    "STORE USE REQUEST FORM"
].sort();

import { useState } from 'react';
import { AccountDeductionForm } from '@/components/forms/account-deduction-form';
import { CashFundForm } from '@/components/forms/cash-fund-form';
import { ArrowLeft } from 'lucide-react';

export function NewRequestDialog({ open, onOpenChange }: NewRequestDialogProps) {
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
        // Ideally trigger refresh of dashboard
    };

    if (selectedForm === "ACCOUNT DEDUCTION REQUEST FORM") {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 border-b">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="h-8 px-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <DialogTitle>Account Deduction Request Form</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1 pr-6 -mr-6 mt-4">
                        <AccountDeductionForm onSuccess={handleFormSuccess} onCancel={() => onOpenChange(false)} />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    if (selectedForm === "CASH FUND REQUEST FORM") {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 border-b">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="h-8 px-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <DialogTitle>Cash / Fund Request Form</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1 pr-6 -mr-6 mt-4">
                        <CashFundForm onSuccess={handleFormSuccess} onCancel={() => onOpenChange(false)} />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Select Request Form</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {REQUEST_FORMS.map((form) => (
                        <Button
                            key={form}
                            variant="outline"
                            className="justify-start h-auto py-4 px-4 text-left whitespace-normal break-words"
                            onClick={() => handleSelect(form)}
                        >
                            <FileText className="mr-3 h-5 w-5 shrink-0" />
                            <span className="text-sm font-medium">{form}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
