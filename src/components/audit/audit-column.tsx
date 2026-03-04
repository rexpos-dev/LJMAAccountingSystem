"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AuditCard } from "./audit-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface AuditItem {
    id: string;
    actionType: string;
    transactionId: string | null;
    details: string | null;
    amount: number | null;
    status: string;
    assignee: string | null;
    remarks: string | null;
    date: string;
    bankName: string | null;
    initiatedBy: string | null;
}

interface AuditColumnProps {
    id: "to-audit" | "ongoing" | "done" | "history" | string;
    title: string;
    items: AuditItem[];
    color?: string; // Tailwind color class for header maybe
    auditors: { id: string, username: string, name: string }[];
    onViewHistory: (account: AuditItem) => void;
    onAssign: (auditId: string, assignee: string) => void;
}

export function AuditColumn({ id, title, items, color, auditors, onViewHistory, onAssign }: AuditColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full bg-muted/40 rounded-lg border border-border/50">
            <div className={cn("p-4 font-semibold text-sm border-b uppercase tracking-wider rounded-t-lg", color)}>
                {title} <span className="ml-2 text-xs font-medium bg-background/90 text-foreground px-2 py-0.5 rounded-full shadow-sm">{items.length}</span>
            </div>
            <ScrollArea className="flex-1 p-3">
                <div ref={setNodeRef} className="min-h-[150px] space-y-3">
                    <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <AuditCard
                                key={item.id}
                                id={item.id}
                                actionType={item.actionType}
                                transactionId={item.transactionId}
                                bankName={item.bankName}
                                amount={item.amount}
                                initiatedBy={item.initiatedBy}
                                date={item.date}
                                status={item.status}
                                onViewHistory={() => onViewHistory(item)}
                            />
                        ))}
                        {items.length === 0 && (
                            <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed rounded-md">
                                Drop here
                            </div>
                        )}
                    </SortableContext>
                </div>
            </ScrollArea>
        </div>
    );
}
