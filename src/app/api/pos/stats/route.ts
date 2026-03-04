import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('http://192.168.1.163:3001/api/reports/stats', {
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store', // Always fetch fresh data
        });

        if (!response.ok) {
            console.error('POS Stats API responded with status:', response.status);
            return NextResponse.json(
                { error: `POS API Error: ${response.status} ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Proxy error fetching POS stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from POS server', details: error.message },
            { status: 500 }
        );
    }
}
