
'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, CheckCircle, Play, Ban, Trash, ShieldCheck } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import format from '@/lib/date-format';

interface Request {
    id: string;
    requestNumber: string;
    requesterName: string;
    position: string;
    accountNo: string;
    purpose: string;
    amount: number;
    verifiedBy: string | null;
    approvedBy: string | null;
    processedBy: string | null;
    status: string;
    date: string;
}

export function RequestTable() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = () => {
        fetch('/api/requests')
            .then((res) => res.json())
            .then((data) => {
                console.log('Fetched requests data:', data);
                if (Array.isArray(data)) {
                    console.log('First request sample:', data[0]);
                    setRequests(data);
                } else {
                    console.error('API returned non-array:', data);
                    setRequests([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch requests:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = (action: string, id: string) => {
        console.log(`Action: ${action} on request ${id}`);
        // Implement action logic here
    };

    if (loading) {
        return <div>Loading requests...</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Requestor Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Account No.</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="min-w-[400px]">Signatures</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                No requests found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.requestNumber}</TableCell>
                                <TableCell>{request.requesterName}</TableCell>
                                <TableCell>{request.position || '-'}</TableCell>
                                <TableCell>{request.accountNo || '-'}</TableCell>
                                <TableCell>{request.purpose || '-'}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(request.amount)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-6 text-xs py-1">
                                        <div className="flex flex-col min-w-[100px]">
                                            <span className="font-semibold text-muted-foreground uppercase text-[10px] mb-1">Verified By:</span>
                                            <span className="text-foreground text-sm">{request.verifiedBy || 'Wait for input'}</span>
                                        </div>
                                        <div className="flex flex-col min-w-[100px]">
                                            <span className="font-semibold text-muted-foreground uppercase text-[10px] mb-1">Approved By:</span>
                                            <span className="text-foreground text-sm">{request.approvedBy || 'Wait for input'}</span>
                                        </div>
                                        <div className="flex flex-col min-w-[100px]">
                                            <span className="font-semibold text-muted-foreground uppercase text-[10px] mb-1">Processed By:</span>
                                            <span className="text-foreground text-sm">{request.processedBy || 'Wait for input'}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        request.status === 'Released' ? 'default' :
                                            request.status === 'Received' ? 'secondary' :
                                                'outline'
                                    }>
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleAction('view', request.id)}>
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('edit', request.id)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleAction('approve', request.id)}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('verify', request.id)}>
                                                <ShieldCheck className="mr-2 h-4 w-4" /> Verified
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('process', request.id)}>
                                                <Play className="mr-2 h-4 w-4" /> Process
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('release', request.id)}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Released
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleAction('void', request.id)} className="text-destructive">
                                                <Ban className="mr-2 h-4 w-4" /> Void
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('delete', request.id)} className="text-destructive">
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
