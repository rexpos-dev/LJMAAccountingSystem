import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        console.log('Fetching customer balances from external API...');

        const externalUrl = new URL('http://192.168.1.163:3001/api/customers/balances');
        if (search) {
            externalUrl.searchParams.append('search', search);
        }

        const response = await fetch(externalUrl.toString(), {
            next: { revalidate: 0 } // Disable caching for fresh data
        });

        if (!response.ok) {
            throw new Error(`External API returned ${response.status}`);
        }

        const externalData = await response.json();

        return NextResponse.json(externalData);
    } catch (error: any) {
        console.error('❌ [API/Customers/Balances] Error fetching customer balances:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch customer balances',
                details: error.message || error.toString(),
            },
            { status: 500 }
        );
    }
}
