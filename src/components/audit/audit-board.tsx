"use client";

import { useState } from "react";
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

import { AuditColumn, AuditAccount } from "./audit-column";
import { AuditCard } from "./audit-card";
import { TransactionHistoryDialog } from "./transaction-history-dialog";

// Initial Mock Data
const initialData: Record<string, AuditAccount[]> = {
    "to-audit": [
        { id: "1", name: "Cash on Hand", accountNumber: "1010", balance: 50000, status: "to-audit" },
        { id: "2", name: "Petty Cash", accountNumber: "1020", balance: 5000, status: "to-audit" },
        { id: "3", name: "Accounts Receivable", accountNumber: "1200", balance: 125000, status: "to-audit" },
    ],
    "ongoing": [],
    "done": [],
    "history": [
        { id: "4", name: "Old Audit 2023", accountNumber: "1010", balance: 45000, status: "history" },
    ],
};

export function AuditBoard() {
    const [items, setItems] = useState<Record<string, AuditAccount[]>>(initialData);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Dialog State
    const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<AuditAccount | null>(null);

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

            // Update status of moved item
            const movedItem = { ...activeItems[activeIndex], status: overContainer as any };

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

        setActiveId(null);
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

    const handleViewHistory = (account: AuditAccount) => {
        setSelectedAccount(account);
        setViewHistoryOpen(true);
    };

    const activeItem = activeId ? (
        Object.values(items).flat().find(item => item.id === activeId)
    ) : null;


    return (
        <div className="h-[calc(100vh-100px)] w-full"> {/* Adjust height as needed */}
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
                        color="border-blue-500 text-blue-600 bg-blue-50/50"
                        onViewHistory={handleViewHistory}
                    />
                    <AuditColumn
                        id="ongoing"
                        title="Ongoing Audit"
                        items={items["ongoing"]}
                        color="border-amber-500 text-amber-600 bg-amber-50/50"
                        onViewHistory={handleViewHistory}
                    />
                    <AuditColumn
                        id="done"
                        title="Done Audit"
                        items={items["done"]}
                        color="border-green-500 text-green-600 bg-green-50/50"
                        onViewHistory={handleViewHistory}
                    />
                    <AuditColumn
                        id="history"
                        title="Audit History"
                        items={items["history"]}
                        color="border-slate-500 text-slate-600 bg-slate-50/50"
                        onViewHistory={handleViewHistory}
                    />
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeItem ? (
                        <AuditCard
                            id={activeItem.id}
                            accountName={activeItem.name}
                            accountNumber={activeItem.accountNumber}
                            balance={activeItem.balance}
                            status={activeItem.status}
                            onViewHistory={() => { }}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <TransactionHistoryDialog
                open={viewHistoryOpen}
                onOpenChange={setViewHistoryOpen}
                account={selectedAccount}
            />
        </div>
    );
}
