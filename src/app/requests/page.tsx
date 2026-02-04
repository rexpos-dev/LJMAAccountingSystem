'use client';

import { RequestDashboard } from '@/components/todo/request-dashboard';
import { Suspense } from 'react';

export default function RequestsPage() {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <RequestDashboard />
        </Suspense>
    );
}
