"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditCardProps {
    id: string;
    accountName: string;
    accountNumber: string; // or int depending on schema, likely string for display
    balance: number;
    status: "to-audit" | "ongoing" | "done" | "history";
    onViewHistory: () => void;
}

export function AuditCard({
    id,
    accountName,
    accountNumber,
    balance,
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

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // History items might not be draggable or sortable in the same way, but for now assuming all are draggable except maybe history
    const isDragEnabled = status !== "history";

    return (
        <div ref={setNodeRef} style={style} className="mb-3">
            <Card className={cn("cursor-default hover:shadow-md transition-shadow relative group", isDragging && "ring-2 ring-primary")}>
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium leading-none">
                        {accountName}
                    </CardTitle>
                    {isDragEnabled && (
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab hover:text-primary text-muted-foreground p-1 rounded-sm -mr-2"
                        >
                            <GripVertical className="h-4 w-4" />
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="text-xs text-muted-foreground mb-1">Acct: {accountNumber}</div>
                    <div className="font-bold text-lg mb-2">
                        ₱{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-8"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start if configured that way
                            onViewHistory();
                        }}
                    >
                        <Eye className="mr-2 h-3 w-3" />
                        View Transactions
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
