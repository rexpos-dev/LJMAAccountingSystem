import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        console.log('Fetching customer balances from external API...');

        const externalUrl = new URL('http://192.168.1.163:3000/api/customers/balances');
        if (search) {
            externalUrl.searchParams.append('search', search);
        }

        const response = await fetch(externalUrl.toString(), {
            next: { revalidate: 0 } // Disable caching for fresh data
        }).catch(() => null);

        if (!response || !response.ok) {
            console.warn(`External API unavailable for customer balances. Returning empty array.`);
            return NextResponse.json([]);
        }

        const externalData = await response.json();

        return NextResponse.json(externalData);
    } catch (error: any) {
        console.warn('❌ [API/Customers/Balances] Silent Fallback: Error fetching customer balances:', error.message);

        return NextResponse.json([]);
    }
}
