import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = searchParams.get('limit') || '10';
    const page = searchParams.get('page') || '1';

    // Fetch from external API
    const externalUrl = new URL('http://192.168.1.163:3001/api/customer-loyalty');
    externalUrl.searchParams.append('search', search);
    externalUrl.searchParams.append('limit', limit);
    externalUrl.searchParams.append('page', page);

    const response = await fetch(externalUrl.toString(), {
      next: { revalidate: 0 } // Disable caching to get fresh data
    });

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const externalData = await response.json();

    let rawData = [];
    if (Array.isArray(externalData)) {
      rawData = externalData;
    } else if (externalData && Array.isArray(externalData.data)) {
      rawData = externalData.data;
    }

    // Map external fields to internal structure
    const mappedData = rawData.map((item: any) => ({
      id: item.id || item.rfid_code,
      customerId: item.customer_id || item.rfid_code || item.id || item.name, // Ensure we have a customerId for balance lookup
      loyaltyCardId: item.rfid_code,
      totalPoints: parseFloat(item.loyaltyPoints || 0),
      pointSettingId: item.point_setting_id || '',
      expiryDate: item.created_at || null,
      customer: {
        code: item.rfid_code || '',
        customerName: item.name || 'N/A'
      },
      pointSetting: {
        description: item.point_setting || 'N/A'
      }
    }));

    return NextResponse.json({
      data: mappedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mappedData.length,
        totalPages: 1
      }
    });
  } catch (error) {
    console.error('Error fetching loyalty points from external API:', error);
    // Fallback to local prisma if external API fails? 
    // The user specifically asked to fetch from there, so maybe we should report the error.
    return NextResponse.json(
      { error: 'Failed to fetch loyalty points from external API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, loyaltyCardId, totalPoints, pointSettingId, expiryDate } = body;

    const loyaltyPoint = await prisma.loyaltyPoint.create({
      data: {
        customerId,
        loyaltyCardId,
        totalPoints: parseFloat(totalPoints),
        pointSettingId,
        expiryDate: expiryDate ? new Date(expiryDate) : null
      },
      include: {
        customer: {
          select: {
            code: true,
            customerName: true
          }
        },
        pointSetting: {
          select: {
            description: true
          }
        }
      }
    });

    return NextResponse.json(loyaltyPoint, { status: 201 });
  } catch (error) {
    console.error('Error creating loyalty point:', error);
    return NextResponse.json(
      { error: 'Failed to create loyalty point' },
      { status: 500 }
    );
  }
}
