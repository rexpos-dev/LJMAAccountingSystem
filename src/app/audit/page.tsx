import { AuditBoard } from "@/components/audit/audit-board";
import { ShieldCheck } from "lucide-react";

export default function AuditPage() {
    return (
        <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8 pt-5 sm:pt-6 gap-5">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Audit Board</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Drag &amp; drop transactions across audit stages
                    </p>
                </div>
            </div>

            <AuditBoard />
        </div>
    );
}
