import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Fetch all loyalty points with includes
    const allLoyaltyPoints = await prisma.loyaltyPoint.findMany({
      where: {
        customer: {
          OR: [
            { customerName: { contains: search } },
            { code: { contains: search } }
          ]
        }
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group by customerId, loyaltyCardId, pointSettingId
    const groupedMap = new Map<string, any>();

    for (const point of allLoyaltyPoints) {
      const key = `${point.customerId}-${point.loyaltyCardId}-${point.pointSettingId}`;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          id: key,
          customerId: point.customerId,
          loyaltyCardId: point.loyaltyCardId,
          totalPoints: 0,
          pointSettingId: point.pointSettingId,
          expiryDate: null,
          createdAt: point.createdAt,
          customer: point.customer,
          pointSetting: point.pointSetting
        });
      }
      const group = groupedMap.get(key);
      group.totalPoints += point.totalPoints;
      // Keep the latest expiry date
      if (!group.expiryDate || (point.expiryDate && new Date(point.expiryDate) > new Date(group.expiryDate))) {
        group.expiryDate = point.expiryDate;
      }
    }

    const groupedArray = Array.from(groupedMap.values());

    // Sort by createdAt desc
    groupedArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const total = groupedArray.length;
    const startIndex = offset;
    const endIndex = startIndex + limit;
    const paginatedData = groupedArray.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching loyalty points:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loyalty points' },
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
