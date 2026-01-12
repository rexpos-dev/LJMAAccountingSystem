import { AuditBoard } from "@/components/audit/audit-board";

export default function AuditPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 h-full">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Audit Menu</h2>
                <div className="flex items-center space-x-2">
                    {/* Add Date Range Picker or other global controls here if needed */}
                </div>
            </div>
            <AuditBoard />
        </div>
    );
}
