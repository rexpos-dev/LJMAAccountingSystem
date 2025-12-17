"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDialog } from "@/components/layout/dialog-provider";
import { useRouter } from "next/navigation";

export function EnterPaymentsDialog() {
  const { closeDialog, openDialogs, openDialog } = useDialog();
  const router = useRouter();

  const handleEnterPaymentsOfAccountsPayable = () => {
    closeDialog("enter-payment");
    openDialog("enter-payments-of-accounts-payable");
  };

  const handleEnterDirectPayments = () => {
    closeDialog("enter-payment");
    openDialog("enter-direct-payments");
  };

  return (
    <AlertDialog open={openDialogs["enter-payment"]} onOpenChange={(open) => !open && closeDialog("enter-payment")}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter payments</AlertDialogTitle>
          <AlertDialogDescription>
            Which payment would you like to enter?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col space-y-4">
          <button
            className="flex items-center space-x-2 text-blue-500 hover:underline"
            onClick={handleEnterPaymentsOfAccountsPayable}
          >
            <span className="text-xl">&rarr;</span>
            <span>Enter payments of accounts payable</span>
          </button>
          <button
            className="flex items-center space-x-2 text-blue-500 hover:underline"
            onClick={handleEnterDirectPayments}
          >
            <span className="text-xl">&rarr;</span>
            <span>Enter direct payments</span>
          </button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => closeDialog("enter-payment")}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
