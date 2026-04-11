
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, CheckCircle, Play, Ban, Trash, ShieldCheck, Banknote } from 'lucide-react';
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
import { useAuth } from '@/components/providers/auth-provider';
import { useDialog } from '@/components/layout/dialog-provider';

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
    chargeTo: string | null;
    businessUnit: string | null;
    department: string | null;
    status: string;
    date: string;
    formName: string | null;
}

const PAGE_SIZE = 10;

export function RequestTable() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useAuth();
    const { openDialog, setDialogData } = useDialog();

    // Role checks
    const accountType = (user?.accountType || '').trim().toLowerCase();
    const isAdmin = ['administrator', 'admin', 'super admin'].includes(accountType);
    const isTreasurer = accountType === 'treasurer';
    const isVerifier = isAdmin || user?.formPermissions === 'Verifier';
    const isApprover = isAdmin || user?.formPermissions === 'Approver';
    const isProcessor = isAdmin || user?.formPermissions === 'Processor' || accountType === 'AdminStaff';
    const currentUserName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Unknown User';

    const fetchRequests = () => {
        fetch('/api/requests')
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    console.error(`API Error (${res.status}):`, errorData);
                    setRequests([]);
                    return;
                }
                const data = await res.json();
                console.log('Fetched requests data:', data);
                if (Array.isArray(data)) {
                    setRequests(data);
                    setCurrentPage(1); // reset to first page on reload
                } else {
                    console.error('API returned non-array:', data);
                    setRequests([]);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch requests:', err);
                setRequests([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
    const paginatedRequests = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return requests.slice(start, start + PAGE_SIZE);
    }, [requests, currentPage]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (action: string, id: string) => {
        console.log(`Action: ${action} on request ${id}`);

        try {
            if (action === 'delete') {
                if (!confirm('Are you sure you want to delete this request?')) return;
                const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    fetchRequests();
                    // Optional: Dispatch event to refresh dashboard stats
                    window.dispatchEvent(new CustomEvent('request-updated'));
                }
                return;
            }

            if (action === 'view' || action === 'edit') {
                // These will be handled by a dialog in the parent or a local state
                window.dispatchEvent(new CustomEvent('request-open-details', {
                    detail: { id, mode: action }
                }));
                return;
            }

            let newStatus = '';
            let updatePayload: any = {};
            switch (action) {
                case 'verify':
                    newStatus = 'To Approve';
                    updatePayload = { status: newStatus, verifiedBy: currentUserName };
                    break;
                case 'approve':
                    newStatus = 'To Process';
                    updatePayload = { status: newStatus, approvedBy: currentUserName };
                    break;
                case 'process':
                    newStatus = 'Released';
                    updatePayload = { status: newStatus, processedBy: currentUserName };
                    break;
                case 'release':
                    newStatus = 'Received';
                    updatePayload = { status: newStatus };
                    break;
                case 'void':
                    newStatus = 'Void';
                    updatePayload = { status: newStatus };
                    break;
            }

            if (newStatus) {
                const res = await fetch(`/api/requests/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePayload),
                });

                if (res.ok) {
                    fetchRequests();
                    window.dispatchEvent(new CustomEvent('request-updated'));
                }
            }
        } catch (error) {
            console.error(`Error performing action ${action}:`, error);
        }
    };

    if (loading) {
        return <div>Loading requests...</div>;
    }

    return (
        <div className="space-y-0">
            <div className="rounded-md border overflow-auto max-h-[600px]">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Requestor</TableHead>
                            <TableHead>Branch / Location</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="min-w-[300px]">Signatures</TableHead>
                            <TableHead>Form Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRequests.length === 0 ? (
                            <TableRow><TableCell colSpan={10} className="text-center h-24 text-muted-foreground">No requests found.</TableCell></TableRow>
                        ) : (
                            paginatedRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium align-top">{request.requestNumber}</TableCell>
                                    <TableCell className="align-top">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{request.requesterName}</span>
                                            <span className="text-xs text-muted-foreground">{request.position || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{request.department || '-'}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{request.businessUnit || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top">
                                        <span className="text-sm truncate max-w-[200px] block" title={request.purpose || '-'}>{request.purpose || '-'}</span>
                                    </TableCell>
                                    <TableCell className="text-right align-top font-medium">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(request.amount)}</TableCell>
                                    <TableCell className="align-top">
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-muted-foreground uppercase text-[10px] mb-1">Verified By:</span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-2 w-2 rounded-full shrink-0 ${['To Approve', 'To Process', 'Released', 'Received'].includes(request.status) ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <span className={`text-xs truncate ${!['To Approve', 'To Process', 'Released', 'Received'].includes(request.status) ? 'text-red-500 font-medium' : 'text-foreground'}`} title={request.verifiedBy || 'Not Assigned'}>{request.verifiedBy && String(request.verifiedBy).trim() !== 'null' && String(request.verifiedBy).trim().length > 0 ? request.verifiedBy : 'Not Assigned'}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-muted-foreground uppercase text-[10px] mb-1">Approved By:</span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-2 w-2 rounded-full shrink-0 ${['To Process', 'Released', 'Received'].includes(request.status) ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <span className={`text-xs truncate ${!['To Process', 'Released', 'Received'].includes(request.status) ? 'text-red-500 font-medium' : 'text-foreground'}`} title={request.approvedBy || 'Not Assigned'}>{request.approvedBy && String(request.approvedBy).trim() !== 'null' && String(request.approvedBy).trim().length > 0 ? request.approvedBy : 'Not Assigned'}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-muted-foreground uppercase text-[10px] mb-1">Processed By:</span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-2 w-2 rounded-full shrink-0 ${['Released', 'Received'].includes(request.status) ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <span className={`text-xs truncate ${!['Released', 'Received'].includes(request.status) ? 'text-red-500 font-medium' : 'text-foreground'}`} title={request.processedBy || 'Not Assigned'}>{request.processedBy && String(request.processedBy).trim() !== 'null' && String(request.processedBy).trim().length > 0 ? request.processedBy : 'Not Assigned'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-medium text-muted-foreground">{request.formName || 'General Request'}</span>
                                    </TableCell>
                                    <TableCell><Badge variant={request.status === 'Released' ? 'default' : request.status === 'Received' ? 'secondary' : 'outline'}>{request.status}</Badge></TableCell>
                                    <TableCell><DropdownMenu><DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleAction('view', request.id)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                                            <DropdownMenuSeparator />

                                            {!isTreasurer && request.status === 'To Verify' && request.verifiedBy === currentUserName && (
                                                <DropdownMenuItem onClick={() => handleAction('verify', request.id)}><ShieldCheck className="mr-2 h-4 w-4" /> Verify</DropdownMenuItem>
                                            )}
                                            {!isTreasurer && request.status === 'To Approve' && request.approvedBy === currentUserName && (
                                                <DropdownMenuItem onClick={() => handleAction('approve', request.id)}><CheckCircle className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                                            )}
                                            {!isTreasurer && request.status === 'To Process' && request.processedBy === currentUserName && (
                                                <DropdownMenuItem onClick={() => handleAction('process', request.id)}><Play className="mr-2 h-4 w-4" /> Process</DropdownMenuItem>
                                            )}
                                            {!isTreasurer && request.status === 'Released' && request.processedBy === currentUserName && (
                                                <DropdownMenuItem onClick={() => handleAction('release', request.id)}><CheckCircle className="mr-2 h-4 w-4" /> Mark Received</DropdownMenuItem>
                                            )}

                                            {isTreasurer && (request.status === 'To Process' || request.status === 'Approved') && (
                                                <DropdownMenuItem
                                                    onClick={async (e) => {
                                                        try {
                                                            // Fetch the full request including items
                                                            const res = await fetch(`/api/requests/${request.id}`);
                                                            if (!res.ok) throw new Error('Failed to fetch request details');
                                                            const fullData = await res.json();
                                                            setDialogData('disbursement-dialog', { initialData: fullData });
                                                            openDialog('disbursement-dialog');
                                                        } catch (error) {
                                                            console.error("Error fetching request for disbursement:", error);
                                                            // Fallback to basic request data if fetch fails
                                                            setDialogData('disbursement-dialog', { initialData: request });
                                                            openDialog('disbursement-dialog');
                                                        }
                                                    }}
                                                >
                                                    <Banknote className="mr-2 h-4 w-4" /> Disburse
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleAction('void', request.id)} className="text-destructive"><Ban className="mr-2 h-4 w-4" /> Void</DropdownMenuItem>
                                            {!isTreasurer && (
                                                <DropdownMenuItem onClick={() => handleAction('delete', request.id)} className="text-destructive"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent></DropdownMenu>
                                    </TableCell></TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 py-3 border-t bg-background rounded-b-md">
                <span className="text-xs text-muted-foreground">
                    Showing {requests.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, requests.length)} of {requests.length} requests
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md border text-xs font-medium disabled:opacity-40 hover:bg-muted/50 transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-xs font-medium text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md border text-xs font-medium disabled:opacity-40 hover:bg-muted/50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
