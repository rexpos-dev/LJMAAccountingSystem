"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    FileText,
    Banknote,
    User,
    Calendar,
    ChevronRight,
    GripVertical,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AuditCardProps {
    id: string;
    actionType: string;
    transactionId: string | null;
    bankName: string | null;
    amount: number | null;
    initiatedBy: string | null;
    date: string;
    status: string;
    onViewHistory: () => void;
}

export function AuditCard({
    id,
    actionType,
    transactionId,
    bankName,
    amount,
    initiatedBy,
    date,
    status,
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

    const isPostStatus = status.toLowerCase().includes('done') || status.toLowerCase().includes('history');
    const [isExpanded, setIsExpanded] = useState(!isPostStatus);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isDragEnabled = status !== "history";

    return (
        <div ref={setNodeRef} style={style} className="mb-3 group">
            <Card
                className={cn(
                    "cursor-pointer hover:shadow-lg transition-all border-l-4 relative overflow-hidden",
                    status === "history" ? "border-l-slate-400" :
                        status === "done" ? "border-l-emerald-500" :
                            status === "ongoing" ? "border-l-amber-500" : "border-l-blue-500",
                    isDragging && "ring-2 ring-primary shadow-2xl scale-[1.02] z-50"
                )}
                onClick={onViewHistory}
            >
                <CardContent className="p-4">
                    {/* Header: Action Type & Drag Handle */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider py-0 px-2 bg-muted/50 rounded-sm">
                                {actionType}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full hover:bg-muted"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                            >
                                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </Button>
                        </div>
                        {isDragEnabled && (
                            <div
                                {...attributes}
                                {...listeners}
                                className="cursor-grab hover:text-primary text-muted-foreground p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <GripVertical className="h-4 w-4" />
                            </div>
                        )}
                    </div>

                    {/* Transaction ID summary when collapsed */}
                    {!isExpanded && (
                        <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-xs font-mono font-bold truncate">
                                {transactionId || 'N/A'}
                            </span>
                            <span className="text-[10px] font-mono font-black text-primary ml-auto">
                                ₱{amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                            </span>
                        </div>
                    )}

                    {/* Main Content Area - Expandable */}
                    {isExpanded && (
                        <div className="space-y-3 mt-3">
                            {/* Transaction No & Bank */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="text-xs font-mono font-bold truncate">
                                        {transactionId || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Banknote className="h-3 w-3 text-muted-foreground shrink-0" />
                                    <span className="text-xs font-semibold truncate capitalize">
                                        {bankName || 'No Bank'}
                                    </span>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="bg-muted/30 p-2 rounded-lg border border-border/50">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Amount</div>
                                <div className="text-lg font-mono font-black text-primary">
                                    ₱{amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                                </div>
                            </div>

                            {/* Metadata: Created By & Date */}
                            <div className="flex items-center justify-between pt-1 border-t border-border/50 mt-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[10px] font-medium text-muted-foreground truncate">
                                        {initiatedBy || 'System'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-[10px] font-medium text-muted-foreground">
                                        {date ? format(new Date(date), 'MMM dd, HH:mm') : '--'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review Indicator (Visible on hover) */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all">
                        <ChevronRight className="h-5 w-5 text-primary" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
