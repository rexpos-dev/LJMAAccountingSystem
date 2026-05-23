"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/layout/dialog-context";
import { DisbursementSlipForm } from "@/components/forms/disbursement-slip-form";

export function DisbursementDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { closeDialog, getDialogData } = useDialog();
    const data = getDialogData("disbursement-dialog");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-6 overflow-y-auto bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl">
                <DialogTitle className="sr-only">Disbursement Slip</DialogTitle>
                {open && (
                    <DisbursementSlipForm
                        initialData={data?.initialData}
                        onCancel={() => closeDialog("disbursement-dialog")}
                        onSuccess={() => closeDialog("disbursement-dialog")}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
