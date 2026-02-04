
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    ClipboardList,
    ThumbsUp,
    Settings,
    Truck,
    CheckCircle,
    Plus
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { NewRequestDialog } from '@/components/todo/new-request-dialog';
import { RequestTable } from '@/components/todo/request-table';
import { StatCard } from '@/components/dashboard/stat-card';

// Define the shape of the stats data
interface RequestStats {
    total: number;
    toVerify: number;
    toApprove: number;
    toProcess: number;
    released: number;
    received: number;
    releasedAndReceived: number;
}

import { RequestDetailsDialog } from './request-details-dialog';

export function RequestDashboard() {
    const [stats, setStats] = useState<RequestStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [openNewRequest, setOpenNewRequest] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const searchParams = useSearchParams();
    const requestIdFromUrl = searchParams.get('id');

    const fetchStats = () => {
        fetch('/api/requests/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch stats:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStats();

        const handleUpdate = () => fetchStats();
        const handleOpenDetails = (e: any) => {
            const { id, mode } = e.detail;
            console.log(`Opening details for ${id} in ${mode} mode`);
            // Set state to open details dialog
            setSelectedRequestId(id);
            setDetailMode(mode);
            setOpenDetails(true);
        };

        window.addEventListener('request-updated', handleUpdate);
        window.addEventListener('request-open-details', handleOpenDetails);

        return () => {
            window.removeEventListener('request-updated', handleUpdate);
            window.removeEventListener('request-open-details', handleOpenDetails);
        };
    }, []);

    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(requestIdFromUrl);
    const [detailMode, setDetailMode] = useState<'view' | 'edit'>('view');
    const [openDetails, setOpenDetails] = useState(!!requestIdFromUrl);

    const handleRequestCreated = () => {
        setOpenNewRequest(false);
        fetchStats(); // Refresh stats locally
        setRefreshKey(prev => prev + 1); // Trigger table refresh
    };

    const handleDetailsClosed = () => {
        setOpenDetails(false);
        setSelectedRequestId(null);
        setRefreshKey(prev => prev + 1); // Refresh table
        fetchStats(); // Refresh stats
    };

    if (loading) {
        return <div className="p-8">Loading stats...</div>;
    }

    // Fallback if fetch fails or returns error
    const data = {
        total: stats?.total ?? 0,
        toVerify: stats?.toVerify ?? 0,
        toApprove: stats?.toApprove ?? 0,
        toProcess: stats?.toProcess ?? 0,
        released: stats?.released ?? 0,
        received: stats?.received ?? 0,
        releasedAndReceived: stats?.releasedAndReceived ?? 0
    };

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <NewRequestDialog open={openNewRequest} onOpenChange={setOpenNewRequest} onRequestCreated={handleRequestCreated} />
            <RequestDetailsDialog
                open={openDetails}
                requestId={selectedRequestId}
                mode={detailMode}
                onOpenChange={setOpenDetails}
                onSuccess={handleDetailsClosed}
            />
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Request Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => setOpenNewRequest(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <StatCard
                    title="Total Requests"
                    value={data.total.toString()}
                    change="All time requests"
                    icon={FileText}
                />
                <StatCard
                    title="To Verify"
                    value={data.toVerify.toString()}
                    change="Pending verification"
                    icon={ClipboardList}
                />
                <StatCard
                    title="To Approve"
                    value={data.toApprove.toString()}
                    change="Awaiting approval"
                    icon={ThumbsUp}
                />
                <StatCard
                    title="To Process"
                    value={data.toProcess.toString()}
                    change="Ready for processing"
                    icon={Settings}
                />
                <StatCard
                    title="Released & Received"
                    value={data.releasedAndReceived.toString()}
                    change="Completed requests"
                    icon={Truck}
                />
            </div>

            <RequestTable key={refreshKey} />
        </div>
    );
}
