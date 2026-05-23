"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";

import { AuditColumn, AuditItem } from "./audit-column";
import { AuditCard } from "./audit-card";
import { AuditReviewDialog } from "./audit-review-dialog";
import { useDialog } from "@/components/layout/dialog-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    CalendarIcon,
    Filter,
    RotateCcw,
    Loader2,
    Search,
    Users,
    SlidersHorizontal,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Clock,
    CheckCircle2,
    ArchiveIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";

// ── Column config ──────────────────────────────────────────────────────
const COLUMNS = [
    {
        id: "to-audit" as const,
        title: "To Audit",
        color: "bg-blue-600 text-foreground",
        borderColor: "border-blue-500",
        activeTabBg: "bg-blue-600",
        icon: ClipboardList,
        glowColor: "rgba(59,130,246,0.15)",
    },
    {
        id: "ongoing" as const,
        title: "Ongoing Audit",
        color: "bg-amber-500 text-foreground",
        borderColor: "border-amber-500",
        activeTabBg: "bg-amber-500",
        icon: Clock,
        glowColor: "rgba(245,158,11,0.15)",
    },
    {
        id: "done" as const,
        title: "Done Audit",
        color: "bg-emerald-600 text-foreground",
        borderColor: "border-emerald-500",
        activeTabBg: "bg-emerald-600",
        icon: CheckCircle2,
        glowColor: "rgba(16,185,129,0.15)",
    },
    {
        id: "history" as const,
        title: "Audit History",
        color: "bg-slate-600 text-foreground",
        borderColor: "border-slate-500",
        activeTabBg: "bg-slate-600",
        icon: ArchiveIcon,
        glowColor: "rgba(100,116,139,0.15)",
    },
] as const;

type ColumnId = typeof COLUMNS[number]["id"];

const initialData: Record<ColumnId, AuditItem[]> = {
    "to-audit": [],
    "ongoing": [],
    "done": [],
    "history": [],
};

// ──────────────────────────────────────────────────────────────────────

export function AuditBoard() {
    const { user } = useAuth();

    const [items, setItems] = useState<Record<ColumnId, AuditItem[]>>(initialData);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [originalColumn, setOriginalColumn] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    // Filter state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [assigneeFilter, setAssigneeFilter] = useState("all");

    // Dialog
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);

    // Auditors
    const [auditors, setAuditors] = useState<{ id: string; username: string; name: string }[]>([]);

    const activeFilterCount = [
        fromDate,
        toDate,
        assigneeFilter !== "all" ? assigneeFilter : "",
        searchQuery,
    ].filter(Boolean).length;

    const fetchAuditLogs = async (useOverlay = false, fDate?: string, tDate?: string) => {
        if (useOverlay) setIsFiltering(true);
        else setIsLoading(true);

        try {
            const params = new URLSearchParams();
            const start = fDate !== undefined ? fDate : fromDate;
            const end = tDate !== undefined ? tDate : toDate;
            if (start) params.append("fromDate", start);
            if (end) params.append("toDate", end);

            const res = await fetch(`/api/reports/to-audit?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch audit logs");
            const data = await res.json();

            const categorized: Record<ColumnId, AuditItem[]> = {
                "to-audit": [],
                "ongoing": [],
                "done": [],
                "history": [],
            };

            data.forEach((log: AuditItem) => {
                const status = log.status?.toLowerCase() || "to audit";
                if (status.includes("ongoing")) categorized["ongoing"].push(log);
                else if (status.includes("done") || status === "audited") categorized["done"].push(log);
                else if (status.includes("history") || status.includes("approve") || status.includes("reject"))
                    categorized["history"].push(log);
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
                const res = await fetch("/api/user-permissions");
                if (!res.ok) throw new Error("Failed to fetch users");
                const users = await res.json();
                const auditorUsers = users
                    .filter(
                        (u: any) =>
                            u.isActive &&
                            (u.accountType.toLowerCase() === "auditor" ||
                                u.accountType.toLowerCase() === "admin")
                    )
                    .map((u: any) => ({
                        id: u.id,
                        username: u.username,
                        name: `${u.firstName} ${u.lastName}`,
                    }));
                setAuditors(auditorUsers);
            } catch (error) {
                console.error("Error fetching auditors", error);
            }
        };

        fetchAuditLogs();
        fetchAuditors();
    }, []);

    const handleFilter = () => fetchAuditLogs(true);

    const handleReset = () => {
        setSearchQuery("");
        setFromDate("");
        setToDate("");
        setAssigneeFilter("all");
        fetchAuditLogs(true, "", "");
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const findContainer = (id: string) => {
        if (id in items) return id;
        return Object.keys(items).find((key) =>
            (items as any)[key].find((item: AuditItem) => item.id === id)
        );
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
        setOriginalColumn(findContainer(active.id as string) || null);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;
        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);
        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setItems((prev) => {
            const activeItems = (prev as any)[activeContainer];
            const overItems = (prev as any)[overContainer];
            const activeIndex = activeItems.findIndex((item: AuditItem) => item.id === active.id);
            const overIndex = overItems.findIndex((item: AuditItem) => item.id === overId);

            let newIndex: number;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;
                newIndex = overIndex >= 0 ? overIndex + (isBelowOverItem ? 1 : 0) : overItems.length + 1;
            }

            const statusMap: Record<string, string> = {
                "to-audit": "To Audit",
                ongoing: "Ongoing Audit",
                done: "Done Audit",
                history: "Audit History",
            };
            const movedItem = { ...activeItems[activeIndex], status: statusMap[overContainer] };

            return {
                ...prev,
                [activeContainer]: (prev as any)[activeContainer].filter(
                    (item: AuditItem) => item.id !== active.id
                ),
                [overContainer]: [
                    ...overItems.slice(0, newIndex),
                    movedItem,
                    ...overItems.slice(newIndex),
                ],
            };
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(over?.id as string);

        if (activeContainer && overContainer && activeContainer === overContainer) {
            const activeIndex = (items as any)[activeContainer].findIndex(
                (item: AuditItem) => item.id === active.id
            );
            const overIndex = (items as any)[overContainer].findIndex(
                (item: AuditItem) => item.id === over?.id
            );
            if (activeIndex !== overIndex) {
                setItems((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove((prev as any)[activeContainer], activeIndex, overIndex),
                }));
            }
        }

        if (activeContainer && originalColumn && originalColumn !== activeContainer) {
            const statusMap: Record<string, string> = {
                "to-audit": "To Audit",
                ongoing: "Ongoing Audit",
                done: "Done Audit",
                history: "Audit History",
            };
            fetch(`/api/audit/${active.id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: statusMap[activeContainer] }),
                headers: { "Content-Type": "application/json" },
            }).catch(console.error);
        }

        setActiveId(null);
        setOriginalColumn(null);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: "0.4" } },
        }),
    };

    const handleViewHistory = (item: AuditItem) => {
        setSelectedItem(item);
        setHistoryDialogOpen(true);
    };

    const handleAssign = async (auditId: string, assignee: string) => {
        setItems((prevItems) => {
            const nextItems = { ...prevItems };
            for (const col of Object.keys(nextItems) as ColumnId[]) {
                nextItems[col] = nextItems[col].map((item) =>
                    item.id === auditId ? { ...item, assignee } : item
                );
            }
            return nextItems;
        });

        const selectedAuditor = auditors.find(
            (a) => a.username === assignee || a.name === assignee
        );
        fetch(`/api/audit/${auditId}`, {
            method: "PATCH",
            body: JSON.stringify({ assignee, assigneeId: selectedAuditor?.id || null }),
            headers: { "Content-Type": "application/json" },
        }).catch(console.error);
    };

    const activeItem = activeId
        ? Object.values(items).flat().find((item) => item.id === activeId)
        : null;

    const accountType = user?.accountType?.toLowerCase() || "";
    const isAdmin = accountType.includes("admin");
    const currentUserFullName = user ? `${user.firstName} ${user.lastName}` : "";
    const currentAssigneeName = user?.username || currentUserFullName;

    const filteredItems = Object.fromEntries(
        Object.entries(items).map(([key, colItems]) => [
            key,
            colItems.filter((item) => {
                if (!isAdmin && key !== "history") {
                    if (item.assignee !== user?.username && item.assignee !== currentUserFullName) {
                        return false;
                    }
                }

                if (assigneeFilter !== "all") {
                    const auditor = auditors.find(a => a.name === assigneeFilter || a.username === assigneeFilter);
                    if (auditor) {
                        if (item.assignee !== auditor.username && item.assignee !== auditor.name) {
                            return false;
                        }
                    } else if (item.assignee !== assigneeFilter) {
                        return false;
                    }
                }

                const q = searchQuery.toLowerCase();
                if (!q) return true;
                return (
                    item.transactionId?.toLowerCase().includes(q) ||
                    item.bankName?.toLowerCase().includes(q) ||
                    item.assignee?.toLowerCase().includes(q) ||
                    item.initiatedBy?.toLowerCase().includes(q) ||
                    item.details?.toLowerCase().includes(q) ||
                    item.actionType?.toLowerCase().includes(q)
                );
            }),
        ])
    ) as Record<ColumnId, AuditItem[]>;

    // ── Render ─────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-[calc(100vh-100px)] w-full gap-3">

            {/* ── Filter Panel ───────────────────────────────────────── */}
            <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
                {/* Filter header row */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-primary/10 rounded-md">
                            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-semibold">Filters</span>
                        {activeFilterCount > 0 && (
                            <Badge className="h-5 px-1.5 text-[10px] rounded-full bg-primary text-primary-foreground">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Search — always visible */}
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            <Input type="text" placeholder="Search transactions…" className="pl-8 pr-3 text-xs w-56 bg-muted/40" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="ghost" size="sm" className="px-3 text-xs gap-1.5" onClick={() => setIsFilterOpen((v) => !v)}
                        >
                            {isFilterOpen ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                            )}
                            <span className="hidden sm:inline">{isFilterOpen ? "Hide" : "More"} Filters</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile search */}
                <div className="sm:hidden px-4 pt-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        <Input type="text" placeholder="Search transactions…" className="pl-8 text-xs w-full bg-muted/40" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Collapsible extended filters */}
                <AnimatePresence initial={false}>
                    {isFilterOpen && (
                        <motion.div
                            key="filter-body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 flex flex-wrap items-end gap-3 border-t border-border/40 bg-muted/20">
                                <div className="flex flex-col gap-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <CalendarIcon className="h-3 w-3" /> From Date
                                    </Label>
                                    <Input type="date" className="text-xs w-[150px] bg-background" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <CalendarIcon className="h-3 w-3" /> To Date
                                    </Label>
                                    <Input type="date" className="text-xs w-[150px] bg-background" value={toDate} onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 min-w-[170px]">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Users className="h-3 w-3" /> Assigned To
                                    </Label>
                                    <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                                        <SelectTrigger className="h-8 text-xs bg-background">
                                            <SelectValue placeholder="All Personnel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Personnel</SelectItem>
                                            {auditors.map((a) => (
                                                <SelectItem key={a.id} value={a.name || a.username}>
                                                    {a.name || a.username}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2 ml-auto">
                                    <Button size="sm" onClick={handleFilter} disabled={isFiltering} className="px-4 text-xs gap-1.5" >
                                        {isFiltering ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Filter className="h-3.5 w-3.5" />
                                        )}
                                        Apply
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleReset} disabled={isFiltering} className="px-4 text-xs gap-1.5" >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Mobile Column Scroll Legend ─────────────────────────── */}
            <div className="lg:hidden flex items-center gap-3 px-1">
                {COLUMNS.map((col, i) => {
                    const Icon = col.icon;
                    const count = filteredItems[col.id]?.length ?? 0;
                    return (
                        <div key={col.id} className="flex items-center gap-1.5 shrink-0">
                            {i > 0 && <span className="text-muted-foreground/30 text-[10px]">›</span>}
                            <Icon className="h-3 w-3 text-muted-foreground/60" />
                            <span className="text-[10px] text-muted-foreground font-medium">{col.title.split(" ")[0]}</span>
                            <span className="text-[10px] font-bold text-muted-foreground/50">({count})</span>
                        </div>
                    );
                })}
                <span className="ml-auto text-[10px] text-muted-foreground/40 italic shrink-0">swipe →</span>
            </div>

            {/* ── Board Content ──────────────────────────────────────── */}
            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="h-7 w-7 animate-spin text-primary/60" />
                    <span className="text-sm font-medium">Loading audit logs…</span>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    {/* Desktop: 4-column grid */}
                    <div className="hidden lg:grid grid-cols-4 gap-3 flex-1 min-h-0">
                        {COLUMNS.map((col) => (
                            <AuditColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                items={filteredItems[col.id]}
                                color={col.color}
                                borderColor={col.borderColor}
                                glowColor={col.glowColor}
                                auditors={auditors}
                                onViewHistory={handleViewHistory}
                                onAssign={handleAssign}
                            />
                        ))}
                    </div>

                    {/* Mobile: horizontal scrollable columns (supports DnD across all) */}
                    <div
                        className="lg:hidden flex-1 min-h-0 flex gap-3 overflow-x-auto pb-2"
                        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
                    >
                        {COLUMNS.map((col) => (
                            <div
                                key={col.id}
                                className="shrink-0 flex flex-col min-h-0 h-full"
                                style={{ width: "88vw", scrollSnapAlign: "start" }}
                            >
                                <AuditColumn
                                    id={col.id}
                                    title={col.title}
                                    items={filteredItems[col.id]}
                                    color={col.color}
                                    borderColor={col.borderColor}
                                    glowColor={col.glowColor}
                                    auditors={auditors}
                                    onViewHistory={handleViewHistory}
                                    onAssign={handleAssign}
                                />
                            </div>
                        ))}
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
                                assignee={activeItem.assignee}
                                date={activeItem.date}
                                status={activeItem.status}
                                onViewHistory={() => {}}
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
