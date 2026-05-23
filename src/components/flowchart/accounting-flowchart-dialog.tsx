"use client";

import { useDialog } from "@/components/layout/dialog-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flowchart } from "./flowchart";

export function AccountingFlowchartDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isAudit = searchParams?.get('mode') === 'audit';

    return (
        <Dialog open={openDialogs["accounting-flowchart"]} onOpenChange={(open) => !open && closeDialog("accounting-flowchart")}>
            <DialogContent className="max-w-[1450px] mx-auto w-full p-0 border-foreground/10 shadow-2xl rounded-b-[2.5rem] bg-background/90 backdrop-blur-2xl overflow-hidden" variant="top-drawer">
                <DialogHeader className="px-10 py-4 border-b border-foreground/10 bg-foreground/5 flex flex-row items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-blue-500 rounded-full" />
                            <DialogTitle className="text-2xl font-black tracking-tighter font-headline text-foreground uppercase">
                                Operational Protocol Matrix
                            </DialogTitle>
                        </div>
                        <p className="text-slate-400 text-xs font-medium tracking-widest uppercase mt-2 ml-5">
                            Standard Accounting Workflow & System Navigation Map
                        </p>
                    </div>
                    
                    {isAudit && (
                        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Audit Mode Active</span>
                        </div>
                    )}
                </DialogHeader>
                <div className="min-h-[700px] p-8">
                    <div className="w-full flex justify-center">
                        <Flowchart />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
