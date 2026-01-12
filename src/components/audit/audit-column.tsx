"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AuditCard } from "./audit-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface AuditAccount {
    id: string;
    name: string;
    accountNumber: string;
    balance: number;
    status: "to-audit" | "ongoing" | "done" | "history";
}

interface AuditColumnProps {
    id: "to-audit" | "ongoing" | "done" | "history";
    title: string;
    items: AuditAccount[];
    color?: string; // Tailwind color class for header maybe
    onViewHistory: (account: AuditAccount) => void;
}

export function AuditColumn({ id, title, items, color, onViewHistory }: AuditColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full bg-muted/40 rounded-lg border border-border/50">
            <div className={cn("p-4 font-semibold text-sm border-b uppercase tracking-wider", color)}>
                {title} <span className="ml-2 text-xs text-muted-foreground font-normal bg-background px-2 py-0.5 rounded-full border">{items.length}</span>
            </div>
            <ScrollArea className="flex-1 p-3">
                <div ref={setNodeRef} className="min-h-[150px] space-y-3">
                    <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <AuditCard
                                key={item.id}
                                id={item.id}
                                accountName={item.name}
                                accountNumber={item.accountNumber}
                                balance={item.balance}
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
