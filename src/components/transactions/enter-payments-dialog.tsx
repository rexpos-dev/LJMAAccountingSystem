"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/components/layout/dialog-context"; // Note: fixing path if needed, but the original was dialog-provider
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  ArrowRight, 
  Wallet, 
  Receipt, 
  X,
  PlusCircle,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export function EnterPaymentsDialog() {
  const { closeDialog, openDialogs, openDialog } = useDialog();

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

  const menuItems = [
    {
      title: "Accounts Payable",
      description: "Settle outstanding bills and vendor obligations",
      icon: <Receipt className="h-6 w-6" />,
      onClick: handleEnterPaymentsOfAccountsPayable,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      title: "Direct Payments",
      description: "Quick payment entry without prior billing",
      icon: <Wallet className="h-6 w-6" />,
      onClick: handleEnterDirectPayments,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      title: "Disbursement Slip",
      description: "Official fund release and cash vouchers",
      icon: <CreditCard className="h-6 w-6" />,
      onClick: handleDisbursement,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20"
    }
  ];

  return (
    <Dialog open={openDialogs["enter-payments"]} onOpenChange={(open) => !open && closeDialog("enter-payments")}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground">Payment Initiation</DialogTitle>
              <p className="text-xs text-foreground/40 font-medium tracking-wide mt-0.5">Select a financial outflow channel</p>
            </div>
          </div>

          
        </div>

        <div className="p-8 space-y-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className={cn(
                "w-full group relative flex items-center gap-6 p-6 rounded-2xl border transition-all duration-300 overflow-hidden",
                "bg-foreground/[0.02] border-foreground/5 hover:border-foreground/20 hover:bg-foreground/[0.05] hover:-translate-y-1 active:scale-[0.98]",
              )}
            >
              {/* Background Glow */}
              <div className={cn(
                "absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 blur-[64px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none",
                item.bg
              )} />

              <div className={cn(
                "p-4 rounded-xl border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                item.bg,
                item.border,
                item.color
              )}>
                {item.icon}
              </div>

              <div className="flex-1 text-left">
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground/40 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="p-2 rounded-full bg-foreground/5 group-hover:bg-primary group-hover:text-black transition-all">
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer Meta */}
        <div className="px-8 py-4 bg-foreground/5 border-t border-foreground/5 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2 opacity-30">
              <TrendingUp className="h-3 w-3" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Secure Ledger Entry</span>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
