import { NextRequest, NextResponse } from 'next/server';

export interface ExternalProduct {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  unitOfMeasure: string | null;
  stock: number;
  price: string;
  cost: string | null;
  sku: string;
  barcode: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalProductResponse {
  success: boolean;
  data: ExternalProduct[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  timestamp: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '10';
  const offset = searchParams.get('offset') || '0';
  const search = searchParams.get('search');
  const filterBy = searchParams.get('filterBy');
  const filterValue = searchParams.get('filterValue');

  // Build query parameters for external API
  const externalParams = new URLSearchParams({
    limit,
    offset,
  });

  if (search) externalParams.append('search', search);
  if (filterBy) externalParams.append('filterBy', filterBy);
  if (filterValue) externalParams.append('filterValue', filterValue);

  try {
    const response = await fetch(
      `http://192.168.1.163:3001/api/products?${externalParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error(
        'External products API responded with non-OK status',
        response.status,
        text
      );

      const failureResponse: ExternalProductResponse = {
        success: false,
        data: [],
        pagination: {
          total: 0,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: false,
        },
        timestamp: new Date().toISOString(),
      };

      // Always return 200 so the client can inspect `success`.
      return NextResponse.json(failureResponse);
    }

    const data: ExternalProductResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    // Most likely a connection / timeout error to the external service
    console.error('Error fetching external products:', error);

    const failureResponse: ExternalProductResponse = {
      success: false,
      data: [],
      pagination: {
        total: 0,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: false,
      },
      timestamp: new Date().toISOString(),
    };

    // Still return 200, but mark success as false so the client can show a
    // friendly "No Products Fetch" message.
    return NextResponse.json(failureResponse);
  }
}
