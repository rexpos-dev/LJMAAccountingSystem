"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/layout/dialog-provider";
import { useRouter } from "next/navigation";

export function EnterPaymentsDialog() {
  const { closeDialog, openDialogs, openDialog } = useDialog();
  const router = useRouter();

  const handleEnterPaymentsOfAccountsPayable = () => {
    closeDialog("enter-payments");
    openDialog("enter-payments-of-accounts-payable");
  };

  const handleEnterDirectPayments = () => {
    closeDialog("enter-payments");
    openDialog("enter-direct-payments");
  };

  const handleDisbursement = () => {
    closeDialog("enter-payments");
    openDialog("disbursement-dialog");
  };

  return (
    <Dialog open={openDialogs["enter-payments"]} onOpenChange={(open) => !open && closeDialog("enter-payments")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter payments</DialogTitle>
          <DialogDescription>
            Which payment would you like to enter?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <button
            className="flex items-center space-x-2 text-blue-500 hover:underline text-left"
            onClick={handleEnterPaymentsOfAccountsPayable}
          >
            <span className="text-xl">&rarr;</span>
            <span>Enter payments of accounts payable</span>
          </button>
          <button
            className="flex items-center space-x-2 text-blue-500 hover:underline text-left"
            onClick={handleEnterDirectPayments}
          >
            <span className="text-xl">&rarr;</span>
            <span>Enter direct payments</span>
          </button>
          <button
            className="flex items-center space-x-2 text-blue-500 hover:underline text-left"
            onClick={handleDisbursement}
          >
            <span className="text-xl">&rarr;</span>
            <span>Disbursement</span>
          </button>
        </div>
        <div className="flex flex-shrink-0 items-center justify-end px-4 py-2 border-t mt-auto">
          {/* Footnote or summary could go here if needed, but removing redundant Close */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
