import { NextRequest, NextResponse } from 'next/server';

export interface ExternalProduct {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  brand: string | null;
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
  try {
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

    const response = await fetch(`http://192.168.1.163:9003/api/products?${externalParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data: ExternalProductResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching external products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external products' },
      { status: 500 }
    );
  }
}
