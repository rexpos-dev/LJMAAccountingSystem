import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const settings = await prisma.loyaltyPointSetting.findMany({
      where: search ? {
        description: {
          contains: search
        }
      } : undefined,
      select: {
        id: true,
        description: true,
        amount: true,
        equivalentPoint: true
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching loyalty point settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch loyalty point settings',
        details:
          process.env.NODE_ENV !== 'production' && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, amount, equivalentPoint } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Missing required fields: description' },
        { status: 400 }
      );
    }

    const newSetting = await prisma.loyaltyPointSetting.create({
      data: {
        description: description.trim(),
        amount: parseFloat(amount) || 0,
        equivalentPoint: parseFloat(equivalentPoint) || 0,
      },
    });

    return NextResponse.json(newSetting, { status: 201 });
  } catch (error: any) {
    console.error('Error creating loyalty point setting:', error);

    // Provide more detailed error messages
    let errorMessage = 'Failed to create loyalty point setting';

    if (error.code === 'P2002') {
      errorMessage = 'A loyalty point setting with this description already exists';
    } else if (error.code === 'P1001') {
      errorMessage = 'Cannot reach database server. Please check your database connection.';
    } else if (error.message?.includes('Unknown model')) {
      errorMessage = 'Database model not found. Please run: npx prisma generate && npx prisma migrate dev';
    } else if (error.message?.includes('Table') && error.message?.includes("doesn't exist")) {
      errorMessage = 'Database table does not exist. Please run: npx prisma migrate dev';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, description, amount, equivalentPoint } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (description !== undefined) updateData.description = description.trim();
    if (amount !== undefined) updateData.amount = parseFloat(amount) || 0;
    if (equivalentPoint !== undefined) updateData.equivalentPoint = parseFloat(equivalentPoint) || 0;

    const updatedSetting = await prisma.loyaltyPointSetting.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedSetting);
  } catch (error: any) {
    console.error('Error updating loyalty point setting:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Loyalty point setting not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update loyalty point setting' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    await prisma.loyaltyPointSetting.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting loyalty point setting:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Loyalty point setting not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete loyalty point setting' },
      { status: 500 }
    );
  }
}
