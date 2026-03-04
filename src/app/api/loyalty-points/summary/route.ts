import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
    }

    // Fetch from external API for this specific customer
    const externalUrl = new URL('http://192.168.1.163:3001/api/customer-loyalty');
    externalUrl.searchParams.append('search', customerId); // Assuming search can match customerId or name
    externalUrl.searchParams.append('limit', '1000'); // Get as many as possible to sum

    const response = await fetch(externalUrl.toString(), {
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const externalData = await response.json();
    let dataArray = [];
    if (Array.isArray(externalData)) {
      dataArray = externalData;
    } else if (externalData && Array.isArray(externalData.data)) {
      dataArray = externalData.data;
    }

    // Sum loyaltyPoints for the matching customer (by rfid_code, id, or customer_id)
    const total = dataArray
      .filter((item: any) =>
        String(item.rfid_code) === String(customerId) ||
        String(item.id) === String(customerId) ||
        String(item.customer_id) === String(customerId)
      )
      .reduce((sum: number, item: any) => sum + Number(item.loyaltyPoints ?? 0), 0);

    return NextResponse.json({ total });
  } catch (error) {
    console.error('Error fetching loyalty points summary from external API:', error);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
