"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Save, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { AuditItem } from "./audit-column";

interface TransactionHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: AuditItem | null;
}

export function TransactionHistoryDialog({
    open,
    onOpenChange,
    account,
}: TransactionHistoryDialogProps) {
    const { toast } = useToast();
    const [remarks, setRemarks] = useState(account?.remarks || "");
    const [notifyUserId, setNotifyUserId] = useState<string>("none");
    const [users, setUsers] = useState<{ id: string, name: string }[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when dialog opens with a new account
    useEffect(() => {
        if (open && account) {
            setRemarks(account.remarks || "");
            setNotifyUserId("none");
        }
    }, [open, account]);

    // Fetch users for notification dropdown
    useEffect(() => {
        if (open) {
            fetch('/api/user-permissions')
                .then(res => res.json())
                .then(data => {
                    const mapped = data.filter((u: any) => u.isActive).map((u: any) => ({
                        id: u.id,
                        username: u.username,
                        name: `${u.firstName} ${u.lastName} (${u.accountType})`
                    }));
                    setUsers(mapped);

                    // If we have an assignee and the dropdown is currently 'none', map it
                    if (account?.assignee && notifyUserId === 'none') {
                        const matched = mapped.find((u: any) => u.username === account.assignee);
                        if (matched) setNotifyUserId(matched.id);
                    }
                })
                .catch(console.error);
        }
    }, [open, account]);

    const handleSaveRemarks = async () => {
        if (!account) return;
        setIsSaving(true);
        try {
            // Include notifyUserId if someone is selected
            const payload: any = { remarks };
            if (notifyUserId !== "none") {
                payload.notifyUserId = notifyUserId;
            }

            const res = await fetch(`/api/audit/${account.id}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) throw new Error("Failed to save remarks");

            // Update local object so it feels responsive instantly
            account.remarks = remarks;

            toast({
                title: "Remarks Saved",
                description: notifyUserId !== "none" ? "Remarks saved and user notified." : "Remarks tracked successfully.",
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Could not save remarks. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!account) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Audit Log Details</DialogTitle>
                    <DialogDescription>
                        Reference: {account.transactionId || 'None'} - {account.actionType}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between py-4">
                    {/* Placeholder for Date Range Picker */}
                    <div className="text-sm text-muted-foreground">Date Range: [Start Date] - [End Date]</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto border rounded-md p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Action Type</h3>
                                <p className="text-lg font-semibold">{account.actionType}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                <p className="text-lg font-semibold">{account.status}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Transaction Amount</h3>
                                <p className="text-lg font-semibold cursor-default">
                                    {account.amount !== null && account.amount !== undefined
                                        ? `₱${account.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Logged On</h3>
                                <p className="text-lg font-semibold">
                                    {account.date ? new Date(account.date).toLocaleString() : 'Unknown'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Auditor Remarks & Comments
                            </h3>
                            <Textarea
                                placeholder="Add comments, findings, or questions regarding this audit item..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="min-h-[100px] mb-4"
                            />

                            <div className="flex items-end justify-between gap-4">
                                <div className="space-y-1 w-[300px]">
                                    <label className="text-xs font-medium text-muted-foreground">Notify User (Optional)</label>
                                    <Select value={notifyUserId} onValueChange={setNotifyUserId}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Select user to notify" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none" className="italic">Nobody</SelectItem>
                                            {users.map(u => (
                                                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleSaveRemarks} disabled={isSaving}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSaving ? "Saving..." : "Save Comments"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
