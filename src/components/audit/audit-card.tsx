"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    FileText,
    Banknote,
    User,
    UserCheck,
    Calendar,
    ChevronRight,
    GripVertical,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AuditCardProps {
    id: string;
    actionType: string;
    transactionId: string | null;
    bankName: string | null;
    amount: number | null;
    initiatedBy: string | null;
    assignee?: string | null;
    date: string;
    status: string;
    index?: number;
    onViewHistory: () => void;
}

// Status → accent colors
const statusStyles: Record<string, { border: string; amountColor: string; badge: string }> = {
    default: {
        border: "border-l-blue-500",
        amountColor: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    ongoing: {
        border: "border-l-amber-500",
        amountColor: "text-amber-600 dark:text-amber-400",
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    done: {
        border: "border-l-emerald-500",
        amountColor: "text-emerald-600 dark:text-emerald-500",
        badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    history: {
        border: "border-l-slate-400",
        amountColor: "text-muted-foreground",
        badge: "bg-muted text-muted-foreground border-border",
    },
};

function getStatusKey(status: string) {
    const s = status.toLowerCase();
    if (s.includes("ongoing")) return "ongoing";
    if (s.includes("done") || s === "audited") return "done";
    if (s.includes("history") || s.includes("approv") || s.includes("reject")) return "history";
    return "default";
}

export function AuditCard({
    id,
    actionType,
    transactionId,
    bankName,
    amount,
    initiatedBy,
    assignee = null,
    date,
    status,
    index = 0,
    onViewHistory,
}: AuditCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const statusKey = getStatusKey(status);
    const styles = statusStyles[statusKey];
    const [isExpanded, setIsExpanded] = useState(true);

    const dragStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isDragEnabled = statusKey !== "history";

    return (
        <motion.div
            ref={setNodeRef}
            style={dragStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
            whileHover={!isDragging ? { y: -2, transition: { duration: 0.15 } } : undefined}
            className="group"
        >
            <div
                onClick={onViewHistory}
                className={cn(
                    "relative overflow-hidden cursor-pointer rounded-xl border border-border/50 border-l-4 bg-card",
                    "transition-shadow duration-200 hover:shadow-md hover:border-border/80",
                    styles.border,
                    isDragging && "ring-2 ring-primary shadow-2xl"
                )}
            >
                <div className="p-3.5">
                    {/* ── Header row ───────────────────────────────── */}
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[9px] uppercase font-black tracking-widest py-0 px-2 rounded-md shrink-0",
                                    styles.badge
                                )}
                            >
                                {actionType}
                            </Badge>
                            <button
                                type="button"
                                className="p-0.5 rounded-md hover:bg-muted transition-colors shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded((v) => !v);
                                }}
                            >
                                {isExpanded ? (
                                    <ChevronUp className="h-3 w-3 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                )}
                            </button>
                        </div>

                        {isDragEnabled && (
                            <div
                                {...attributes}
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity shrink-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* ── Collapsed summary ────────────────────────── */}
                    {!isExpanded && (
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                <span className="text-xs font-mono font-bold truncate text-foreground">
                                    {transactionId || "N/A"}
                                </span>
                            </div>
                            <span className={cn("text-xs font-mono font-black shrink-0", styles.amountColor)}>
                                ₱{amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                            </span>
                        </div>
                    )}

                    {/* ── Expanded detail ──────────────────────────── */}
                    {isExpanded && (
                        <div className="space-y-3">
                            {/* Ref & Bank */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="text-xs font-mono font-bold truncate">
                                        {transactionId || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <Banknote className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="text-xs font-semibold truncate capitalize">
                                        {bankName || "No Bank"}
                                    </span>
                                </div>
                            </div>

                            {/* Amount pill */}
                            <div
                                className="rounded-lg p-2.5 border border-border/40"
                                style={{ background: "hsl(var(--muted)/0.3)" }}
                            >
                                <div className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                                    Amount
                                </div>
                                <div className={cn("text-base font-mono font-black", styles.amountColor)}>
                                    ₱{amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                                </div>
                            </div>

                            {/* Assignee row */}
                            {assignee && (
                                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/40 border border-border/30">
                                    <UserCheck className="h-3 w-3 text-primary/70 shrink-0" />
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Auditor:</span>
                                    <span className="text-[10px] font-bold text-foreground truncate">{assignee}</span>
                                </div>
                            )}

                            {/* Footer meta */}
                            <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <User className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="text-[10px] text-muted-foreground truncate">
                                        {initiatedBy || "System"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground">
                                        {date ? format(new Date(date), "MMM dd, HH:mm") : "--"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hover chevron indicator */}
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-150 group-hover:translate-x-0 translate-x-1">
                    <ChevronRight className="h-4 w-4 text-primary" />
                </div>
            </div>
        </motion.div>
    );
}
