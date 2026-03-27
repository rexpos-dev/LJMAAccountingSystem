"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { AuditColumn, AuditItem } from "./audit-column";
import { AuditCard } from "./audit-card";
import { AuditReviewDialog } from "./audit-review-dialog";
import { format } from "date-fns";
import { useDialog } from "@/components/layout/dialog-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Filter, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Initial Layout Data
const initialData: Record<string, AuditItem[]> = {
    "to-audit": [],
    "ongoing": [],
    "done": [],
    "history": [],
};

export function AuditBoard() {
    const [items, setItems] = useState<Record<string, AuditItem[]>>(initialData);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [originalColumn, setOriginalColumn] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    // Filter State
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    // Dialog State
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);

    // Auditor State
    const [auditors, setAuditors] = useState<{ id: string, username: string, name: string }[]>([]);

    const fetchAuditLogs = async (useOverlay = false) => {
        if (useOverlay) setIsFiltering(true);
        else setIsLoading(true);

        try {
            const params = new URLSearchParams();
            if (fromDate) params.append('fromDate', fromDate);
            if (toDate) params.append('toDate', toDate);

            const res = await fetch(`/api/reports/to-audit?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch audit logs');
            const data = await res.json();

            const categorized: Record<string, AuditItem[]> = {
                "to-audit": [],
                "ongoing": [],
                "done": [],
                "history": [],
            };

            data.forEach((log: AuditItem) => {
                const status = log.status?.toLowerCase() || 'to audit';
                if (status.includes('ongoing')) categorized["ongoing"].push(log);
                else if (status.includes('done') || status === 'audited') categorized["done"].push(log);
                else if (status.includes('history')) categorized["history"].push(log);
                else categorized["to-audit"].push(log);
            });

            setItems(categorized);
        } catch (error) {
            console.error("Error fetching audit logs", error);
        } finally {
            setIsLoading(false);
            setIsFiltering(false);
        }
    };

    useEffect(() => {
        const fetchAuditors = async () => {
            try {
                const res = await fetch('/api/user-permissions');
                if (!res.ok) throw new Error('Failed to fetch users');
                const users = await res.json();

                // Filter users to only those with 'auditor' role or similar permissions
                const auditorUsers = users
                    .filter((u: any) => u.isActive && (u.accountType.toLowerCase() === 'auditor' || u.accountType.toLowerCase() === 'admin'))
                    .map((u: any) => ({ id: u.id, username: u.username, name: `${u.firstName} ${u.lastName}` }));

                setAuditors(auditorUsers);
            } catch (error) {
                console.error("Error fetching auditors", error);
            }
        };

        fetchAuditLogs();
        fetchAuditors();
    }, []);

    const handleFilter = () => {
        fetchAuditLogs(true);
    };

    const handleReset = () => {
        setFromDate("");
        setToDate("");
        // Use timeout to ensure state is updated before fetching
        setTimeout(() => {
            fetchAuditLogs(true);
        }, 0);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require slight movement to start drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id: string) => {
        if (id in items) {
            return id;
        }
        return Object.keys(items).find((key) => items[key].find((item) => item.id === id));
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
        const activeContainer = findContainer(active.id as string);
        setOriginalColumn(activeContainer || null);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) {
            return;
        }

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = overItems.findIndex((item) => item.id === overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            const newStatus = overContainer === "to-audit" ? "To Audit" :
                overContainer === "ongoing" ? "Ongoing Audit" :
                    overContainer === "done" ? "Done Audit" : "Audit History";

            const movedItem = { ...activeItems[activeIndex], status: newStatus };

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item.id !== active.id),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    movedItem,
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
            };
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(over?.id as string);

        if (
            activeContainer &&
            overContainer &&
            activeContainer === overContainer
        ) {
            const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
            const overIndex = items[overContainer].findIndex((item) => item.id === over?.id);

            if (activeIndex !== overIndex) {
                setItems((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
                }));
            }
        }

        if (activeContainer && originalColumn && originalColumn !== activeContainer) {
            let newStatus = activeContainer === "to-audit" ? "To Audit" :
                activeContainer === "ongoing" ? "Ongoing Audit" :
                    activeContainer === "done" ? "Done Audit" :
                        "Audit History";
            fetch(`/api/audit/${active.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
                headers: { 'Content-Type': 'application/json' }
            }).catch(console.error);
        }

        setActiveId(null);
        setOriginalColumn(null);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    const handleViewHistory = (item: AuditItem) => {
        setSelectedItem(item);
        setHistoryDialogOpen(true);
    };

    const handleAssign = async (auditId: string, assignee: string) => {
        setItems(prevItems => {
            const nextItems = { ...prevItems };
            for (const col of Object.keys(nextItems)) {
                nextItems[col] = nextItems[col].map(item =>
                    item.id === auditId ? { ...item, assignee } : item
                );
            }
            return nextItems;
        });

        const selectedAuditor = auditors.find(a => (a.username === assignee || a.name === assignee));
        const assigneeId = selectedAuditor?.id || null;

        fetch(`/api/audit/${auditId}`, {
            method: 'PATCH',
            body: JSON.stringify({ assignee, assigneeId }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(console.error);
    };

    const activeItem = activeId ? (
        Object.values(items).flat().find(item => item.id === activeId)
    ) : null;


    return (
        <div className="flex flex-col h-[calc(100vh-100px)] w-full gap-4">
            {/* Filter Section */}
            <div className="bg-card p-4 rounded-lg border shadow-sm flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fromDate" className="text-xs font-semibold flex items-center gap-2">
                        <CalendarIcon className="h-3 w-3" /> From Date
                    </Label>
                    <Input
                        id="fromDate"
                        type="date"
                        className="h-9 text-xs w-[160px]"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="toDate" className="text-xs font-semibold flex items-center gap-2">
                        <CalendarIcon className="h-3 w-3" /> To Date
                    </Label>
                    <Input
                        id="toDate"
                        type="date"
                        className="h-9 text-xs w-[160px]"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={handleFilter}
                        disabled={isFiltering}
                        className="h-9 px-4"
                    >
                        {isFiltering ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Filter className="h-4 w-4 mr-2" />
                        )}
                        Filter
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={isFiltering}
                        className="h-9 px-4"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Loading audit logs...
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-4 gap-4 h-full">
                        <AuditColumn
                            id="to-audit"
                            title="To Audit"
                            items={items["to-audit"]}
                            color="bg-blue-600 text-white border-blue-600"
                            auditors={auditors}
                            onViewHistory={handleViewHistory}
                            onAssign={handleAssign}
                        />
                        <AuditColumn
                            id="ongoing"
                            title="Ongoing Audit"
                            items={items["ongoing"]}
                            color="bg-amber-500 text-white border-amber-500"
                            auditors={auditors}
                            onViewHistory={handleViewHistory}
                            onAssign={handleAssign}
                        />
                        <AuditColumn
                            id="done"
                            title="Done Audit"
                            items={items["done"]}
                            color="bg-emerald-600 text-white border-emerald-600"
                            auditors={auditors}
                            onViewHistory={handleViewHistory}
                            onAssign={handleAssign}
                        />
                        <AuditColumn
                            id="history"
                            title="Audit History"
                            items={items["history"]}
                            color="bg-slate-700 text-white border-slate-700"
                            auditors={auditors}
                            onViewHistory={handleViewHistory}
                            onAssign={handleAssign}
                        />
                    </div>

                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeItem ? (
                            <AuditCard
                                id={activeItem.id}
                                actionType={activeItem.actionType}
                                transactionId={activeItem.transactionId}
                                bankName={activeItem.bankName}
                                amount={activeItem.amount}
                                initiatedBy={activeItem.initiatedBy}
                                date={activeItem.date}
                                status={activeItem.status}
                                onViewHistory={() => { }}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}

            <AuditReviewDialog
                open={historyDialogOpen}
                onOpenChange={setHistoryDialogOpen}
                item={selectedItem}
                onActionComplete={fetchAuditLogs}
            />
        </div>
    );
}
