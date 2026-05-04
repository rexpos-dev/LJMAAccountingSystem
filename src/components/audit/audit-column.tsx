"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AuditCard } from "./audit-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, InboxIcon } from "lucide-react";
import { motion } from "framer-motion";

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
    createdAt?: string;
    updatedAt?: string;
    auditedAt?: string;
    reviewedBy?: string;
    bankName: string | null;
    initiatedBy: string | null;
}

interface AuditColumnProps {
    id: string;
    title: string;
    items: AuditItem[];
    color?: string;
    borderColor?: string;
    glowColor?: string;
    auditors: { id: string; username: string; name: string }[];
    onViewHistory: (account: AuditItem) => void;
    onAssign: (auditId: string, assignee: string) => void;
}

const ITEMS_PER_PAGE = 5;

export function AuditColumn({
    id,
    title,
    items,
    color,
    borderColor,
    glowColor,
    auditors,
    onViewHistory,
    onAssign,
}: AuditColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [items.length, totalPages, currentPage]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return items.slice(start, start + ITEMS_PER_PAGE);
    }, [items, currentPage]);

    return (
        <div
            className={cn(
                "flex flex-col h-full rounded-xl border transition-all duration-200",
                "bg-card/60 backdrop-blur-sm",
                isOver
                    ? cn("border-2", borderColor ?? "border-primary", "shadow-lg")
                    : "border-border/50",
            )}
            style={isOver && glowColor ? { boxShadow: `0 0 24px ${glowColor}` } : undefined}
        >
            {/* ── Column Header ──────────────────────────────────────── */}
            <div
                className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-t-xl",
                    color ?? "bg-muted text-foreground"
                )}
            >
                <span className="text-xs font-black uppercase tracking-widest truncate">
                    {title}
                </span>
                <span
                    className="ml-2 shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(0,0,0,0.2)" }}
                >
                    {items.length}
                </span>
            </div>

            {/* ── Card List ──────────────────────────────────────────── */}
            <ScrollArea className="flex-1 px-2.5 py-2.5">
                <div ref={setNodeRef} className="min-h-[120px] space-y-2.5">
                    <SortableContext
                        items={paginatedItems.map((item) => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {paginatedItems.map((item, index) => (
                            <AuditCard
                                key={item.id}
                                id={item.id}
                                actionType={item.actionType}
                                transactionId={item.transactionId}
                                bankName={item.bankName}
                                amount={item.amount}
                                initiatedBy={item.initiatedBy}
                                assignee={item.assignee}
                                date={item.date}
                                status={item.status}
                                index={index}
                                onViewHistory={() => onViewHistory(item)}
                            />
                        ))}

                        {items.length === 0 && (
                            <div className="h-28 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/40 rounded-xl text-muted-foreground/60">
                                <InboxIcon className="h-5 w-5" />
                                <span className="text-[11px] font-medium">Drop here</span>
                            </div>
                        )}
                    </SortableContext>
                </div>
            </ScrollArea>

            {/* ── Pagination ─────────────────────────────────────────── */}
            {items.length > ITEMS_PER_PAGE && (
                <div className="px-3 py-2.5 border-t border-border/40 flex items-center justify-between gap-2 bg-muted/20 rounded-b-xl">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={cn(
                                    "rounded-full transition-all duration-200",
                                    i + 1 === currentPage
                                        ? "w-4 h-1.5 bg-primary"
                                        : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                                )}
                            />
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
