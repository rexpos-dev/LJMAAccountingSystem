"use client";

import { useDialog } from "@/components/layout/dialog-provider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, HardDrive, Clock, ShieldCheck, Download, FileArchive, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackupSchedulerDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState("00:00");
    const [frequency, setFrequency] = useState("week");
    const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(false);

    useEffect(() => {
        if (openDialogs["backup-scheduler"]) console.log("Backup Scheduler Mounted");
    }, [openDialogs]);

    const handleSave = () => {
        closeDialog("backup-scheduler" as any);
    };

    const handleRunNow = () => {
        alert("Manual backup process started (Mock).");
    }

    return (
        <Dialog
            open={openDialogs["backup-scheduler"] || false}
            onOpenChange={(open) => {
                if (!open) closeDialog("backup-scheduler" as any);
            }}
        >
            <DialogContent className="sm:max-w-[950px] max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <HardDrive className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Database Backup Manager</DialogTitle>
                            <DialogDescription className="text-sm mt-1">
                                Secure your financial data with automated schedules and manual controls.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* LEFT COLUMN: Configuration (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* Status Card */}
                            <Card className="border shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-primary" />
                                            System Status
                                        </CardTitle>
                                        <Badge variant={isAutoBackupEnabled ? "default" : "secondary"}>
                                            {isAutoBackupEnabled ? "Active" : "Idle"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-muted/50 p-3 rounded-lg border">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Backups</span>
                                            <div className="text-2xl font-bold mt-1">12</div>
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded-lg border">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Storage Used</span>
                                            <div className="text-2xl font-bold mt-1">542 MB</div>
                                        </div>
                                        <div className="col-span-2 bg-muted/50 p-3 rounded-lg border flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Last Successful Backup</span>
                                                <div className="text-sm font-medium mt-0.5">Jan 09, 2026 • 10:30 AM</div>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Automation Configuration */}
                            <Card className="border shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-orange-500" />
                                                Automation Settings
                                            </CardTitle>
                                            <CardDescription>Configure recurring backup schedules</CardDescription>
                                        </div>
                                        <Switch
                                            checked={isAutoBackupEnabled}
                                            onCheckedChange={setIsAutoBackupEnabled}
                                        />
                                    </div>
                                </CardHeader>
                                {isAutoBackupEnabled && (
                                    <CardContent className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="grid gap-5 pl-1">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium text-muted-foreground">Frequency</Label>
                                                <RadioGroup defaultValue="week" value={frequency} onValueChange={setFrequency} className="flex gap-4">
                                                    {["week", "month", "custom"].map((val) => (
                                                        <div key={val} className={cn(
                                                            "flex items-center space-x-2 border rounded-md p-3 w-full transition-all cursor-pointer hover:bg-accent",
                                                            frequency === val ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "bg-transparent"
                                                        )}>
                                                            <RadioGroupItem value={val} id={val} />
                                                            <Label htmlFor={val} className="cursor-pointer flex-1 capitalize">{val === 'week' ? 'Weekly' : val === 'month' ? 'Monthly' : 'Custom'}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={date}
                                                                onSelect={setDate}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-muted-foreground">Run Time</Label>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                                                        <Input
                                                            id="time"
                                                            type="time"
                                                            className="pl-9"
                                                            value={time}
                                                            onChange={(e) => setTime(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>

                            <Button
                                className="w-full h-11"
                                onClick={handleRunNow}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Run Immediate Backup
                                </div>
                            </Button>
                        </div>

                        {/* RIGHT COLUMN: Files & Info (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col gap-6">

                            <Card className="flex-1 border shadow-sm flex flex-col overflow-hidden">
                                <CardHeader className="border-b bg-muted/20 py-4">
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <FileArchive className="w-4 h-4 text-primary" />
                                        Repository
                                    </CardTitle>
                                    <CardDescription>Available restore points</CardDescription>
                                </CardHeader>
                                <div className="flex-1 overflow-y-auto max-h-[400px] p-2">
                                    <div className="space-y-1">
                                        {[
                                            { name: "backup_v2.4_final.sql", date: "Today, 10:30 AM", size: "45.2 MB", type: "Full" },
                                            { name: "backup_v2.3_week_02.sql", date: "Jan 03, 9:00 AM", size: "44.8 MB", type: "Scheduled" },
                                            { name: "backup_v2.3_week_01.sql", date: "Dec 27, 9:00 AM", size: "43.5 MB", type: "Scheduled" },
                                            { name: "manual_pre_update.sql", date: "Dec 24, 2:15 PM", size: "42.1 MB", type: "Manual" },
                                            { name: "backup_v2.2_week_52.sql", date: "Dec 20, 9:00 AM", size: "41.8 MB", type: "Scheduled" },
                                            { name: "backup_v2.2_week_51.sql", date: "Dec 13, 9:00 AM", size: "41.6 MB", type: "Scheduled" },
                                        ].map((file, i) => (
                                            <div key={i} className="group flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-all border border-transparent hover:border-muted cursor-default">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", file.type === 'Full' ? "bg-purple-500" : file.type === 'Manual' ? "bg-blue-500" : "bg-slate-400")} />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{file.name}</p>
                                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                            <span>{file.date}</span>
                                                            <span className="w-0.5 h-0.5 bg-muted-foreground/50 rounded-full" />
                                                            <span>{file.size}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => alert(`Downloading...`)}>
                                                    <Download className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-sm">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground">Scope of Backup</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            This backup includes <strong>Financial Reports</strong>, <strong>Inventory Records</strong>, Chart of Accounts, Journal Entries, Transaction History, Customer Data, User Permissions, Business Profile, and Loyalty Points.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t sticky bottom-0 z-10 bg-background">
                    <Button variant="outline" className="mr-auto" onClick={() => closeDialog("backup-scheduler" as any)}>Close Viewer</Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => closeDialog("backup-scheduler" as any)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
