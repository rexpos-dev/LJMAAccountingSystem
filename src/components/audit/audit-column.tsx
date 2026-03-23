"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AuditCard } from "./audit-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;

    // Ensure current page is valid when items change
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [items.length, totalPages, currentPage]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return items.slice(start, start + ITEMS_PER_PAGE);
    }, [items, currentPage]);

    return (
        <div className="flex flex-col h-full bg-muted/40 rounded-lg border border-border/50">
            <div className={cn("p-4 font-semibold text-sm border-b uppercase tracking-wider rounded-t-lg", color)}>
                {title} <span className="ml-2 text-xs font-medium bg-background/90 text-foreground px-2 py-0.5 rounded-full shadow-sm">{items.length}</span>
            </div>
            <ScrollArea className="flex-1 p-3">
                <div ref={setNodeRef} className="min-h-[150px] space-y-3">
                    <SortableContext items={paginatedItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                        {paginatedItems.map((item) => (
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

            {/* Pagination Controls */}
            {items.length > ITEMS_PER_PAGE && (
                <div className="p-3 border-t bg-muted/20 flex items-center justify-between gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
