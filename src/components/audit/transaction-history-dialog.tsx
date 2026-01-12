"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
// import { DateRangePicker } from "@/components/ui/date-range-picker"; // Assuming this exists or using simple inputs for now

interface TransactionHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: { id: string; name: string; accountNumber: string } | null;
}

export function TransactionHistoryDialog({
    open,
    onOpenChange,
    account,
}: TransactionHistoryDialogProps) {
    // Mock transactions for now
    const [transactions] = useState([
        { id: "1", date: "2024-01-15", description: "Opening Balance", debit: 0, credit: 0, balance: 5000 },
        { id: "2", date: "2024-01-20", description: "Payment Received", debit: 0, credit: 1500, balance: 6500 },
        { id: "3", date: "2024-02-05", description: "Office Supplies", debit: 200, credit: 0, balance: 6300 },
    ]);

    if (!account) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Transaction History - {account.name}</DialogTitle>
                    <DialogDescription>
                        Account No: {account.accountNumber}
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

                <div className="flex-1 overflow-auto border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>{tx.date}</TableCell>
                                    <TableCell>{tx.description}</TableCell>
                                    <TableCell className="text-right">{tx.debit > 0 ? `₱${tx.debit.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell className="text-right">{tx.credit > 0 ? `₱${tx.credit.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell className="text-right">₱{tx.balance.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
